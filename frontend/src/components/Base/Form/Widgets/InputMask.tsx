import React, {
  FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import type { InputMaskProps } from "./types";

import Input from "./Input";
import { lruCache } from "@/utils/cache";
import { replaceAt } from "@/utils/common";

// 9 => number
// a => letter
// b => number

const MaskChar = {
  digit: "0",
  letter: "a",
  any: "*",
};

const MASK_CHARS = new Set(Object.values(MaskChar));
const maskRegex = new RegExp(`[${Object.values(MaskChar).join("")}]`, "g");

const invalidLetter = new RegExp("[^a-zA-Z]");
const invalidNumber = new RegExp("[^0-9]");

const DEFAULT_ERROR = "Invalid value. Please ensure to fill the pattern.";

const slotFromMask = lruCache(
  (mask: string) => mask.replace(maskRegex, "_"),
  100
);

const isInvalidChar = (mChar: string, vChar: string): boolean => {
  return (
    !vChar ||
    (mChar === MaskChar.digit && invalidNumber.test(vChar)) ||
    (mChar === MaskChar.letter && invalidLetter.test(vChar))
  );
};

const applyFullMask = (mask: string, value?: string, slot?: string) => {
  slot = slot && slot.length >= mask.length ? slot : slotFromMask(mask);
  value = value || "";
  let masked = "";

  let x = 0;
  let y = 0;
  let count = 0;

  while (x < mask.length && y <= value.length) {
    count++;
    let vChar = value[y];
    if (!vChar) {
      masked += slot.substring(x);
      break;
    }

    const mChar = mask[x];
    const sChar = slot[x];

    if (!MASK_CHARS.has(mChar)) {
      vChar === mChar && y++;
      vChar = sChar;
    } else {
      while (isInvalidChar(mChar, value[y]) && ++y < value.length) {}
      vChar = value[y];
      if (!vChar) continue;
      y++;
    }
    masked += vChar;
    x++;
  }
  return masked;
};

const isInvalidMask = (mask: string, value: string): boolean => {
  if (mask.length != value.length) return true;
  for (let i = 0; i < mask.length; i++) {
    const mChar = mask[i];
    const vChar = value[i];

    if (!MASK_CHARS.has(mChar) && vChar != mChar) return true;

    if (isInvalidChar(mChar, vChar)) return true;
  }
  return false;
};

const InputMask: FC<InputMaskProps> = ({
  setValue,
  mask,
  slotChar,
  placeholder,
  yieldMasked = false,
  errorMessage = DEFAULT_ERROR,
  ...props
}) => {
  const slotVal = useMemo(() => slotChar || slotFromMask(mask), []);
  const [masked, setMasked] = useState(slotVal);
  const maskRef = useRef(masked);

  const isPaste = useRef(false);
  const pressedKey = useRef("");
  const curStart = useRef(0);
  const curEnd = useRef(0);

  useEffect(() => {
    maskRef.current = masked;
    setValue(masked);
  }, [masked]);

  const handleKeyPress = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let [curA, curB] = [curStart.current, curEnd.current];
      const key = pressedKey.current;
      const [isBack, isDel, isSelection] = [
        key === "Backspace",
        key === "Delete",
        curA != curB,
      ];

      const isDelChar = isBack || isDel;

      curA += -(isBack && !!curA);

      const shiftVal = isBack ? -1 : 1;
      let endShift = 0;
      let mChar = mask[curA];

      if (!(isSelection && isDelChar)) {
        while (!(mChar && MASK_CHARS.has(mChar))) {
          if ((curA += shiftVal) >= mask.length || curA < 0) return;
          mChar = mask[curA];
        }

        if (!isSelection || curA > curB) curB = curA;
      }

      let newVal = maskRef.current;
      let vChar = key.length === 1 ? key : slotVal[curA];

      if (isSelection) {
        if (isDelChar || isInvalidChar(mChar, vChar)) {
          newVal =
            curA === 0 && curB >= mask.length
              ? slotVal
              : (newVal.substring(0, curA) || "") +
                slotVal.substring(curA, curB) +
                (newVal.substring(curB) || "");
        } else {
          newVal =
            (newVal.substring(0, curA) || "") +
            vChar +
            slotVal.substring(curA + 1, curB) +
            (newVal.substring(curB) || "");
          endShift = 1;
        }
      } else {
        if (!isInvalidChar(mChar, vChar) || isBack || isDel) {
          newVal = replaceAt(newVal, curA, vChar);
          endShift = +!isBack;
        }
      }

      const { target } = event;

      target.value = newVal;
      curStart.current = curEnd.current = target.selectionEnd = curA + endShift;
      setMasked(newVal);
    },
    []
  );

  const handleInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (isPaste.current) {
        isPaste.current = false;
        const { target } = event;
        setMasked(applyFullMask(mask, target.value, slotVal));
      } else {
        handleKeyPress(event);
      }
    },
    []
  );

  const validate: InputMaskProps["handleValidate"] = useCallback(() => {
    const masked = maskRef.current;

    if (slotVal === masked) {
      return;
    }

    if (isInvalidMask(mask, masked)) {
      throw new Error(errorMessage);
    }
    return yieldMasked ? masked : masked.replace(/[^a-zA-Z0-9]/g, "");
  }, []);

  return (
    <Input
      {...props}
      value={masked}
      setValue={setMasked}
      placeholder={placeholder || mask}
      handleValidate={validate}
      onPaste={() => (isPaste.current = true)}
      onChange={handleInput}
      onKeyDown={(event) => {
        const { key, target } = event;

        const inputElm = target as HTMLInputElement;
        pressedKey.current = key;
        curStart.current = inputElm.selectionStart || 0;
        curEnd.current = inputElm.selectionEnd || 0;
      }}
    />
  );
};

export default InputMask;

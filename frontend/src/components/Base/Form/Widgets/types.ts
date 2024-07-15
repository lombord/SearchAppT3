import type { FC, ReactNode, RefObject } from "react";
import type {
  InputProps as NextInputProps,
  TextAreaProps as NextTextAreaProps,
} from "@nextui-org/react";

import type { FormBaseRef } from "../types";
import type { ValueOf } from "@/types/utils";

import type { Widgets } from "./index";

// Widget base/inferred types
export type WidgetKeys = keyof Widgets;

export type SetterFunc<T> = React.Dispatch<React.SetStateAction<T>>;

export interface WidgetBase<T = string> {
  value?: T;
  setValue: SetterFunc<T>;
  widgetRef?: RefObject<WidgetRef<T> | undefined>;
}

export type WidgetPropsType = {
  [K in WidgetKeys]: Widgets[K] extends FC<infer T> ? T : unknown;
};

export type WidgetValuesMap = {
  [K in keyof WidgetPropsType]: WidgetPropsType[K] extends WidgetBase<infer T>
    ? T
    : string;
};

export type WidgetValues = ValueOf<WidgetValuesMap>;

// widget refs
export type WidgetRef<T> = FormBaseRef<T>;

export type PickWidgetRef<T extends WidgetKeys> = T extends any
  ? RefObject<WidgetRef<WidgetValuesMap[T]>>
  : never;

// widgets prop types
type InputTextBase = {
  maxLength?: number;
};

export type HandleValidate<T> = (value?: T) => T | void;

export type InputProps<T = string> = Omit<NextInputProps, "ref"> &
  WidgetBase<T> &
  InputTextBase & {
    regexPattern?: RegExp;
    regexError?: string;
    handleValidate?: HandleValidate<T>;
  };

export type NoRegexInputProps = Omit<
  InputProps,
  "type" | "regexPattern" | "regexError"
> & {
  errorMessage?: string;
};

export type EmailProps = NoRegexInputProps;

export type InputMaskProps = InputProps & {
  mask: string;
  slotChar?: string;
  yieldMasked?: boolean;
  errorMessage?: string;
};

export type InputPhoneProps = Omit<InputMaskProps, "mask" | "slotChar">;

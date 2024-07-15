import { lruCache } from "./cache";

export const keyToLabel = lruCache((key: string): string => {
  if (!key) return "";
  key = key.replace(/([a-z])([A-Z])|[_-]+/g, "$1 $2");
  return key.charAt(0).toUpperCase() + key.slice(1).toLowerCase();
});

export const replaceAt = (
  value: string,
  idx: number,
  replace: string
): string => {
  if (replace === value[idx]) return value;
  return value.substring(0, idx) + replace + value.substring(idx + 1);
};

export function hasOwn<T>(
  target: T,
  key: string | symbol | number
): key is keyof T {
  return Object.prototype.hasOwnProperty.call(target, key);
}

export function hasProps<T extends {}>(obj: T): boolean {
  for (const _ in obj) {
    return true;
  }
  return false;
}

export function isEmpty<T>(obj: T): boolean {
  if (obj == null) return true;

  if (Array.isArray(obj)) {
    return !obj.length;
  }

  const objType = typeof obj;

  if (objType == "object") {
    return !hasProps(obj);
  }

  if (objType == "string") {
    return !obj;
  }

  return false;
}

export function notEmpty<T>(
  obj: T
): obj is Exclude<T, undefined | null | void | never | ""> {
  return !isEmpty<T>(obj);
}

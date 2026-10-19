import type { Count } from "../types/Count.type.ts";
import { isCount } from "./isCount.function.ts";

export const toCount = (value: number): Count => {
    if (!isCount(value)) throw new RangeError(`${value} is not a whole number, zero or more`);
    return value;
};

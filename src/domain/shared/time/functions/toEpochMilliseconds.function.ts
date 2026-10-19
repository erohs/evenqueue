import type { EpochMilliseconds } from "../types/EpochMilliseconds.type.ts";
import { isEpochMilliseconds } from "./isEpochMilliseconds.function.ts";

export const toEpochMilliseconds = (value: number): EpochMilliseconds => {
    if (!isEpochMilliseconds(value)) throw new RangeError(`${value} is not a time in whole milliseconds`);
    return value;
};

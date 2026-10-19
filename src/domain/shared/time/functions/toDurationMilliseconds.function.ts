import type { DurationMilliseconds } from "../types/DurationMilliseconds.type.ts";
import { isDurationMilliseconds } from "./isDurationMilliseconds.function.ts";

export const toDurationMilliseconds = (value: number): DurationMilliseconds => {
    if (!isDurationMilliseconds(value)) throw new RangeError(`${value} is not a duration in whole milliseconds`);
    return value;
};

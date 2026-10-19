import type { Priority } from "../types/Priority.type.ts";
import { isPriority } from "./isPriority.function.ts";

/** Adding zero turns a negative zero into zero, so every priority has one spelling. */
export const toPriority = (value: number): Priority => {
    if (!isPriority(value)) throw new RangeError(`${value} is not a priority that fits in 32 signed bits`);
    return (value + 0) as Priority;
};

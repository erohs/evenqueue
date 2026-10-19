import type { Priority } from "../types/Priority.type.ts";

export const isPriority = (value: unknown): value is Priority =>
    Number.isSafeInteger(value) && (value as number) >= -(2 ** 31) && (value as number) < 2 ** 31;

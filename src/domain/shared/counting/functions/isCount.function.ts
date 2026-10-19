import type { Count } from "../types/Count.type.ts";

export const isCount = (value: unknown): value is Count => Number.isSafeInteger(value) && (value as number) >= 0;

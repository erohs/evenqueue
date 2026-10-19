import { dropStates } from "../consts/dropStates.const.ts";
import type { DropState } from "../types/DropState.type.ts";

export const isDropState = (value: unknown): value is DropState =>
    typeof value === "string" && (dropStates as readonly string[]).includes(value);

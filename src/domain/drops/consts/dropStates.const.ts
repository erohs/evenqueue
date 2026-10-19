import type { DropState } from "../types/DropState.type.ts";

export const dropStates: readonly DropState[] = [
    "draft",
    "open",
    "closed",
    "committed",
    "drawing",
    "offering",
    "finished",
    "cancelled",
];

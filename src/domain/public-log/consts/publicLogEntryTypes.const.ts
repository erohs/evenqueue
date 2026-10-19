import type { PublicLogEntryType } from "../types/PublicLogEntryType.type.ts";

export const publicLogEntryTypes: readonly PublicLogEntryType[] = [
    "commitment",
    "beacon-round",
    "draw-order",
    "draw-void",
    "service-gap",
    "settings-change",
    "recovery",
    "unit-counts",
];

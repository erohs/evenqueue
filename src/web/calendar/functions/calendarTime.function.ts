import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** A UTC date-time, `20261021T140000Z`: calendar files always carry UTC, and the reader's calendar shows local time. */
export const calendarTime = (time: EpochMilliseconds): string =>
    new Date(time)
        .toISOString()
        .replace(/\.\d{3}Z$/u, "Z")
        .replaceAll("-", "")
        .replaceAll(":", "");

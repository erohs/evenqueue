import type { EpochMilliseconds } from "../types/EpochMilliseconds.type.ts";

export const latestOf = (first: EpochMilliseconds, ...others: readonly EpochMilliseconds[]): EpochMilliseconds =>
    others.reduce((latest, time) => (time > latest ? time : latest), first);

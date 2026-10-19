import { latestRepresentableTime } from "../consts/latestRepresentableTime.const.ts";
import type { EpochMilliseconds } from "../types/EpochMilliseconds.type.ts";

export const isEpochMilliseconds = (value: unknown): value is EpochMilliseconds =>
    Number.isSafeInteger(value) && Math.abs(value as number) <= latestRepresentableTime;

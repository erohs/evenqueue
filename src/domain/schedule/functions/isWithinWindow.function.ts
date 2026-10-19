import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";
import { windowClose } from "./windowClose.function.ts";

/** Open from `opensAt` up to, but not including, the moment it closes. */
export const isWithinWindow = (
    opensAt: EpochMilliseconds,
    length: DurationMilliseconds,
    gaps: readonly IServiceGap[],
    now: EpochMilliseconds,
): boolean => now >= opensAt && now < windowClose(opensAt, length, gaps).closesAt;

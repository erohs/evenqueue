import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { heartbeatInterval } from "../consts/heartbeatInterval.const.ts";
import { missedHeartbeatsBeforeGap } from "../consts/missedHeartbeatsBeforeGap.const.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";

/**
 * The outage between two consecutive heartbeats, or null if too few beats were missed to count. The gap starts one
 * interval after the earlier beat, because the service may have been up until then.
 */
export const serviceGapBetweenHeartbeats = (
    previousBeatAt: EpochMilliseconds,
    currentBeatAt: EpochMilliseconds,
    interval: DurationMilliseconds = heartbeatInterval,
    missedBeatsBeforeGap = missedHeartbeatsBeforeGap,
): IServiceGap | null => {
    if (currentBeatAt - previousBeatAt <= missedBeatsBeforeGap * interval) return null;
    return { startsAt: previousBeatAt + interval, endsAt: currentBeatAt };
};

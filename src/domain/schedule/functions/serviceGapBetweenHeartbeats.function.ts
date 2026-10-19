import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { heartbeatInterval } from "../consts/heartbeatInterval.const.ts";
import { missedHeartbeatsBeforeGap } from "../consts/missedHeartbeatsBeforeGap.const.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";
import { createServiceGap } from "./createServiceGap.function.ts";

/**
 * The outage between two consecutive heartbeats, or null if too few beats were missed to count. The gap starts one
 * interval after the earlier beat, because the service may have been up until then.
 */
export const serviceGapBetweenHeartbeats = (
    previousBeatAt: EpochMilliseconds,
    currentBeatAt: EpochMilliseconds,
): IServiceGap | null => {
    if (currentBeatAt - previousBeatAt <= missedHeartbeatsBeforeGap * heartbeatInterval) return null;
    return createServiceGap(addDuration(previousBeatAt, heartbeatInterval), currentBeatAt);
};

import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { maximumWindowExtensionRatio } from "../consts/maximumWindowExtensionRatio.const.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";
import { mergeServiceGaps } from "./mergeServiceGaps.function.ts";

/**
 * A window promises a length of uptime, not a pair of clock times, so an outage never shortens anybody's time to
 * join or to claim. It closes once the service has been up for `length` since `opensAt`, extended by at most
 * `extensionRatio` of its length.
 */
export const windowClosesAt = (
    opensAt: EpochMilliseconds,
    length: DurationMilliseconds,
    gaps: readonly IServiceGap[],
    extensionRatio = maximumWindowExtensionRatio,
): EpochMilliseconds => {
    let cursor = opensAt;
    let uptimeStillOwed = length;
    for (const gap of mergeServiceGaps(gaps)) {
        if (gap.endsAt <= cursor) continue;
        const uptimeBeforeGap = Math.max(0, gap.startsAt - cursor);
        if (uptimeBeforeGap >= uptimeStillOwed) break;
        uptimeStillOwed -= uptimeBeforeGap;
        cursor = gap.endsAt;
    }
    return Math.min(cursor + uptimeStillOwed, opensAt + length * (1 + extensionRatio));
};

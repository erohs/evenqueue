import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { maximumWindowExtensionRatio } from "../consts/maximumWindowExtensionRatio.const.ts";
import type { IServiceGap } from "../interfaces/IServiceGap.ts";
import type { IWindowClose } from "../interfaces/IWindowClose.ts";
import { mergeServiceGaps } from "./mergeServiceGaps.function.ts";

/**
 * A window promises a length of uptime, not a pair of clock times, so an outage never shortens anybody's time to
 * join or to claim. It closes once the service has been up for `length` since `opensAt`, but outages can stretch it
 * to at most twice its length; past that the window is cut short, and says so.
 */
export const windowClose = (
    opensAt: EpochMilliseconds,
    length: DurationMilliseconds,
    gaps: readonly IServiceGap[],
): IWindowClose => {
    let cursor = opensAt;
    let uptimeStillOwed: number = length;
    for (const gap of mergeServiceGaps(gaps)) {
        if (gap.endsAt <= cursor) continue;
        const uptimeBeforeGap = Math.max(0, gap.startsAt - cursor);
        if (uptimeBeforeGap >= uptimeStillOwed) break;
        uptimeStillOwed -= uptimeBeforeGap;
        cursor = gap.endsAt;
    }
    const latestClose = addDuration(opensAt, length, 1 + maximumWindowExtensionRatio);
    const promisedClose = toEpochMilliseconds(cursor + uptimeStillOwed);
    if (promisedClose > latestClose) return { closesAt: latestClose, isCutShortByOutages: true };
    return { closesAt: promisedClose, isCutShortByOutages: false };
};

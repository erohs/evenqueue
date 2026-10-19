import type { PlaceOutcomeInDrop } from "#domain/allocation-rules/types/PlaceOutcomeInDrop.type.ts";
import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import type { IServiceGap } from "#domain/schedule/interfaces/IServiceGap.ts";
import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import type { IOffer } from "../interfaces/IOffer.ts";

/**
 * An offer that lapsed only counts against the buyer if the service gave them their full time to claim it. When
 * outages cut the window short, the vendor was at fault, and the place is treated as never offered.
 */
export const outcomeOfLapsedOffer = (
    offer: IOffer,
    offerWindow: DurationMilliseconds,
    serviceGaps: readonly IServiceGap[],
): Extract<PlaceOutcomeInDrop, "offer-not-taken" | "offer-withdrawn"> =>
    windowClose(offer.offeredAt, offerWindow, serviceGaps).isCutShortByOutages ? "offer-withdrawn" : "offer-not-taken";

import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import type { PlaceOutcomeInDrop } from "#domain/allocation-rules/types/PlaceOutcomeInDrop.type.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { IDropResult } from "../interfaces/IDropResult.ts";
import { placeIdsOfferedFirst } from "./placeIdsOfferedFirst.function.ts";

export const runDropWhereEveryOfferIsBought = async (
    rule: IAllocationRule,
    places: readonly IWaitlistPlace[],
    unitsOffered: number,
    drawLabel: string,
    currentEntryWindowNumber: number,
): Promise<IDropResult> => {
    const buyers = new Set(await placeIdsOfferedFirst(rule, places, unitsOffered, drawLabel));
    const outcomeFor = (place: IWaitlistPlace): PlaceOutcomeInDrop =>
        buyers.has(place.placeId) ? "bought" : "not-offered";
    const waitlistAfterDrop = places
        .map((place) => rule.placeAfterDrop(place, outcomeFor(place), toCount(currentEntryWindowNumber)))
        .filter((place): place is IWaitlistPlace => place !== null);
    return { buyers, waitlistAfterDrop };
};

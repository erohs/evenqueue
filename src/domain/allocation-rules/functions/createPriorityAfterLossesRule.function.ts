import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import { assertNonNegativeWholeNumber } from "#domain/shared/validation/functions/assertNonNegativeWholeNumber.function.ts";
import { countDropOnPlace } from "./countDropOnPlace.function.ts";

/**
 * The default rule: a random draw in which each drop a buyer misses out on raises their priority by one, up to
 * `highestPriorityLevel`. Priority is draws entered minus offers received, so an offer the buyer did not take up
 * leaves it unchanged. The ceiling stops an old place building an unbounded lead over newcomers.
 */
export const createPriorityAfterLossesRule = (highestPriorityLevel = 2): IAllocationRule => {
    assertNonNegativeWholeNumber(highestPriorityLevel, "highestPriorityLevel");
    return {
        id: "priority-after-losses",
        shouldKeepPlacesBetweenDrops: true,
        priorityOf: (place) => Math.min(highestPriorityLevel, place.drawsEntered - place.offersReceived),
        placeAfterDrop: (place, outcome) => (outcome === "bought" ? null : countDropOnPlace(place, outcome)),
    };
};

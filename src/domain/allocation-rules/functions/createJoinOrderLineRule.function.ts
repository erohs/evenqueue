import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import { assertNonNegativeWholeNumber } from "#domain/shared/validation/functions/assertNonNegativeWholeNumber.function.ts";
import { countDropOnPlace } from "./countDropOnPlace.function.ts";
import { placeAfterOfferNotTaken } from "./placeAfterOfferNotTaken.function.ts";

/**
 * A line served in order of entry window, in random order inside each window. Suits a closed group where every
 * genuine buyer joins at launch. A place survives `offersNotTakenBeforeMovingToBack` unclaimed offers; the next one
 * moves it to the back.
 */
export const createJoinOrderLineRule = (offersNotTakenBeforeMovingToBack = 2): IAllocationRule => {
    assertNonNegativeWholeNumber(offersNotTakenBeforeMovingToBack, "offersNotTakenBeforeMovingToBack");
    return {
        id: "join-order-line",
        shouldKeepPlacesBetweenDrops: true,
        priorityOf: (place) => -place.entryWindowNumber,
        placeAfterDrop: (place, outcome, currentEntryWindowNumber) => {
            if (outcome === "bought") return null;
            const counted = countDropOnPlace(place, outcome);
            if (outcome === "not-offered") return counted;
            return placeAfterOfferNotTaken(counted, currentEntryWindowNumber, offersNotTakenBeforeMovingToBack);
        },
    };
};

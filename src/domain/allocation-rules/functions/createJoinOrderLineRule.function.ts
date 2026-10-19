import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import { countDropOnPlace } from "./countDropOnPlace.function.ts";
import { placeAfterOfferNotTaken } from "./placeAfterOfferNotTaken.function.ts";
import { toPriority } from "./toPriority.function.ts";

/**
 * A line served in order of entry window, in random order inside each window. Suits a closed group where every
 * genuine buyer joins at launch. A place survives `offersNotTakenBeforeMovingToBack` unclaimed offers; the next one
 * moves it to the back.
 */
export const createJoinOrderLineRule = (offersNotTakenBeforeMovingToBack = 2): IAllocationRule => {
    const missesAllowed = toCount(offersNotTakenBeforeMovingToBack);
    return {
        id: "join-order-line",
        shouldKeepPlacesBetweenDrops: true,
        priorityOf: (place) => toPriority(-place.entryWindowNumber),
        placeAfterDrop: (place, outcome, currentEntryWindowNumber) => {
            if (outcome === "bought") return null;
            const counted = countDropOnPlace(place, outcome);
            if (outcome !== "offer-not-taken") return counted;
            return placeAfterOfferNotTaken(counted, currentEntryWindowNumber, missesAllowed);
        },
        placeWithPriority: (placeId, priority) => createWaitlistPlace(placeId, toCount(Math.max(0, -priority))),
    };
};

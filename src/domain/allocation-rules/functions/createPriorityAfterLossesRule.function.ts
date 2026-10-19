import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";
import type { IAllocationRule } from "../interfaces/IAllocationRule.ts";
import { countDropOnPlace } from "./countDropOnPlace.function.ts";
import { placeAfterUnclaimedOfferWithPriority } from "./placeAfterUnclaimedOfferWithPriority.function.ts";
import { toPriority } from "./toPriority.function.ts";

/**
 * The default rule: a random draw in which each drop a buyer misses out on raises their priority by one, up to
 * `highestPriorityLevel`. Priority is draws entered minus offers received, so a single offer the buyer did not take
 * up leaves it unchanged, and the ceiling stops an old place building an unbounded lead over newcomers. After
 * `unclaimedOffersThatResetPriority` offers in a row go unclaimed, the place drops back to the lowest priority.
 * Offers the vendor withdrew never count. The settings are checked here, once, when the rule is made.
 */
export const createPriorityAfterLossesRule = (
    highestPriorityLevel = 2,
    unclaimedOffersThatResetPriority = 2,
): IAllocationRule => {
    const ceiling = toPriority(toCount(highestPriorityLevel));
    const resetAfter = toCount(unclaimedOffersThatResetPriority);
    if (resetAfter === 0) throw new RangeError("unclaimedOffersThatResetPriority must be at least one");
    return {
        id: "priority-after-losses",
        shouldKeepPlacesBetweenDrops: true,
        priorityOf: (place) => toPriority(Math.min(ceiling, place.drawsEntered - place.offersReceived)),
        placeAfterDrop: (place, outcome) => {
            if (outcome === "bought") return null;
            const counted = countDropOnPlace(place, outcome);
            return outcome === "offer-not-taken" ? placeAfterUnclaimedOfferWithPriority(counted, resetAfter) : counted;
        },
        placeWithPriority: (placeId, priority) => ({
            ...createWaitlistPlace(placeId, zeroCount),
            drawsEntered: toCount(Math.max(0, priority)),
        }),
    };
};

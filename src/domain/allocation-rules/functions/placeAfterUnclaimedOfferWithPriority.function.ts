import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

/**
 * Counts an unclaimed offer, and once `unclaimedOffersThatResetPriority` have gone unclaimed in a row, drops the
 * place back to the lowest priority, so a place nobody claims for stops taking the first offer every drop.
 */
export const placeAfterUnclaimedOfferWithPriority = (
    place: IWaitlistPlace,
    unclaimedOffersThatResetPriority: Count,
): IWaitlistPlace => {
    const offersNotTaken = incrementCount(place.offersNotTakenSinceLastMove);
    const shouldResetPriority = offersNotTaken >= unclaimedOffersThatResetPriority;
    if (shouldResetPriority) {
        return { ...place, drawsEntered: place.offersReceived, offersNotTakenSinceLastMove: zeroCount };
    }
    return { ...place, offersNotTakenSinceLastMove: offersNotTaken };
};

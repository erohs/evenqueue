import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

/** Keeps the place in line, or moves it to the back once it has missed more offers than allowed. */
export const placeAfterOfferNotTaken = (
    place: IWaitlistPlace,
    currentEntryWindowNumber: Count,
    offersNotTakenBeforeMovingToBack: Count,
): IWaitlistPlace => {
    const offersNotTaken = incrementCount(place.offersNotTakenSinceLastMove);
    if (offersNotTaken <= offersNotTakenBeforeMovingToBack) {
        return { ...place, offersNotTakenSinceLastMove: offersNotTaken };
    }
    return { ...place, entryWindowNumber: currentEntryWindowNumber, offersNotTakenSinceLastMove: zeroCount };
};

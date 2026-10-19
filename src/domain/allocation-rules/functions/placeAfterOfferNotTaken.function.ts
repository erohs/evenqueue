import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

/** Keeps the place in line, or moves it to the back once it has missed more offers than allowed. */
export const placeAfterOfferNotTaken = (
    place: IWaitlistPlace,
    currentEntryWindowNumber: number,
    offersNotTakenBeforeMovingToBack: number,
): IWaitlistPlace => {
    const offersNotTaken = place.offersNotTakenSinceLastMove + 1;
    if (offersNotTaken <= offersNotTakenBeforeMovingToBack) {
        return { ...place, offersNotTakenSinceLastMove: offersNotTaken };
    }
    return { ...place, entryWindowNumber: currentEntryWindowNumber, offersNotTakenSinceLastMove: 0 };
};

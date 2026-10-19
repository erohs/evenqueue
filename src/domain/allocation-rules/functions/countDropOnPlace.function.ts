import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { PlaceOutcomeInDrop } from "../types/PlaceOutcomeInDrop.type.ts";

/** The counter update every rule that keeps places shares. */
export const countDropOnPlace = (
    place: IWaitlistPlace,
    outcome: Exclude<PlaceOutcomeInDrop, "bought">,
): IWaitlistPlace => ({
    ...place,
    drawsEntered: place.drawsEntered + 1,
    offersReceived: place.offersReceived + (outcome === "offer-not-taken" ? 1 : 0),
});

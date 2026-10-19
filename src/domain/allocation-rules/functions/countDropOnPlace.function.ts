import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { PlaceOutcomeInDrop } from "../types/PlaceOutcomeInDrop.type.ts";

/** The counter update every rule that keeps places shares. */
export const countDropOnPlace = (
    place: IWaitlistPlace,
    outcome: Exclude<PlaceOutcomeInDrop, "bought">,
): IWaitlistPlace => ({
    ...place,
    drawsEntered: incrementCount(place.drawsEntered),
    offersReceived: outcome === "offer-not-taken" ? incrementCount(place.offersReceived) : place.offersReceived,
});

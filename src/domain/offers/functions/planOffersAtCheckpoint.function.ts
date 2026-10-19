import { windowClosesAt } from "#domain/schedule/functions/windowClosesAt.function.ts";
import { assertNonNegativeWholeNumber } from "#domain/shared/validation/functions/assertNonNegativeWholeNumber.function.ts";
import type { ICheckpointOfferInput } from "../interfaces/ICheckpointOfferInput.ts";
import type { IOffer } from "../interfaces/IOffer.ts";
import { unitsStillOfferable } from "./unitsStillOfferable.function.ts";

/**
 * The offers a checkpoint releases: each unit still offerable goes to the next place in the draw order that has not
 * been offered a unit yet. Units left over when the line runs out stay free.
 */
export const planOffersAtCheckpoint = (input: ICheckpointOfferInput): IOffer[] => {
    assertNonNegativeWholeNumber(input.backfillOffersPerUnit, "backfillOffersPerUnit");
    const units = unitsStillOfferable(input.unitsAwaitingOffer, input.backfillOffersPerUnit);
    const nextInLine = input.placeIdsInDrawOrder.filter((placeId) => !input.placeIdsAlreadyOffered.has(placeId));
    const expiresAt = windowClosesAt(input.checkpointAt, input.offerWindow, input.serviceGaps);
    return units.flatMap((unit, i) => {
        const placeId = nextInLine[i];
        if (placeId === undefined) return [];
        return [
            {
                unitNumber: unit.unitNumber,
                placeId,
                offeredAt: input.checkpointAt,
                expiresAt,
                offerRound: unit.offersMade + 1,
            },
        ];
    });
};

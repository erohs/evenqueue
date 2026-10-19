import { windowClose } from "#domain/schedule/functions/windowClose.function.ts";
import { incrementCount } from "#domain/shared/counting/functions/incrementCount.function.ts";
import type { ICheckpointOfferInput } from "../interfaces/ICheckpointOfferInput.ts";
import type { IOffer } from "../interfaces/IOffer.ts";
import { unitsStillOfferable } from "./unitsStillOfferable.function.ts";

/**
 * The offers a checkpoint releases: each unit still offerable goes to the next place in the draw order that has not
 * been offered a unit yet. Units left over when the line runs out stay free.
 */
export const planOffersAtCheckpoint = (input: ICheckpointOfferInput): IOffer[] => {
    const nextInLine = [...input.placeIdsInDrawOrder].filter((placeId) => !input.placeIdsAlreadyOffered.has(placeId));
    const { closesAt: expiresAt } = windowClose(input.checkpointAt, input.offerWindow, input.serviceGaps);
    return unitsStillOfferable(input.offersMadeByUnitNumber, input.backfillOffersPerUnit)
        .slice(0, nextInLine.length)
        .flatMap(([unitNumber, offersMade], i) => {
            const placeId = nextInLine[i];
            if (placeId === undefined) return [];
            return [
                {
                    unitNumber,
                    placeId,
                    offeredAt: input.checkpointAt,
                    expiresAt,
                    offerRound: incrementCount(offersMade),
                },
            ];
        });
};

import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "../interfaces/IWaitlistPlace.ts";

export const createWaitlistPlace = (placeId: Bytes32Hex, entryWindowNumber: number): IWaitlistPlace => ({
    placeId,
    drawsEntered: 0,
    offersReceived: 0,
    entryWindowNumber,
    offersNotTakenSinceLastMove: 0,
});

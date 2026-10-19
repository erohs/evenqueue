import { zeroCount } from "#domain/shared/counting/consts/zeroCount.const.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IWaitlistPlace } from "../interfaces/IWaitlistPlace.ts";

export const createWaitlistPlace = (placeId: Bytes32Hex, entryWindowNumber: Count): IWaitlistPlace => ({
    placeId,
    drawsEntered: zeroCount,
    offersReceived: zeroCount,
    entryWindowNumber,
    offersNotTakenSinceLastMove: zeroCount,
});

import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { recoveryCodeCheck } from "#domain/credentials/functions/recoveryCodeCheck.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { placeInForce } from "./placeInForce.function.ts";

export const findPlaceByRecoveryCode = async (
    services: Pick<IApplicationServices, "places" | "clock" | "keys">,
    waitlistId: Bytes32Hex,
    recoveryCode: ByteArray,
): Promise<IPlaceRecord | null> => {
    const check = await recoveryCodeCheck(await services.keys.waitlistKey(waitlistId), recoveryCode);
    const found = await services.places.findPlaceByRecoveryCode(waitlistId, check);
    return placeInForce(services, waitlistId, found, (current) => current.recoveryCodeCheck === check);
};

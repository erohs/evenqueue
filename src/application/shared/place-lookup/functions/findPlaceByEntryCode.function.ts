import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { entrySecretLookup } from "#domain/credentials/functions/entrySecretLookup.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { placeInForce } from "./placeInForce.function.ts";

export const findPlaceByEntryCode = async (
    services: Pick<IApplicationServices, "places" | "clock">,
    waitlistId: Bytes32Hex,
    entrySecret: ByteArray,
): Promise<IPlaceRecord | null> => {
    const lookup = await entrySecretLookup(entrySecret);
    const found = await services.places.findPlaceByEntryCode(waitlistId, lookup);
    return placeInForce(services, waitlistId, found, (current) => current.entrySecretLookup === lookup);
};

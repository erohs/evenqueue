import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { viewKeyLookup } from "#domain/credentials/functions/viewKeyLookup.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { placeInForce } from "./placeInForce.function.ts";

export const findPlaceByViewKey = async (
    services: Pick<IApplicationServices, "places" | "clock">,
    waitlistId: Bytes32Hex,
    viewKey: ByteArray,
): Promise<IPlaceRecord | null> => {
    const lookup = await viewKeyLookup(viewKey);
    const found = await services.places.findPlaceByViewKey(waitlistId, lookup);
    return placeInForce(services, waitlistId, found, (current) => current.viewKeyLookup === lookup);
};

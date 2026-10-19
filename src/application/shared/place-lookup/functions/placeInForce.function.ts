import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { credentialsInForceAt } from "#domain/credentials/functions/credentialsInForceAt.function.ts";
import type { IStoredCredentials } from "#domain/credentials/interfaces/IStoredCredentials.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * The place, if the code it was found by is in force now. A recovery that has come due is applied and saved first, so
 * the replaced code stops working and the new one starts, whether or not the timer has run yet.
 */
export const placeInForce = async (
    services: Pick<IApplicationServices, "places" | "clock">,
    waitlistId: Bytes32Hex,
    found: IPlaceRecord | null,
    isCodeInForce: (current: IStoredCredentials) => boolean,
): Promise<IPlaceRecord | null> => {
    if (found === null) return null;
    const credentials = credentialsInForceAt(found.credentials, services.clock.now());
    if (!isCodeInForce(credentials.current)) return null;
    if (credentials !== found.credentials) {
        await services.places.saveCredentials(waitlistId, found.place.placeId, credentials);
    }
    return { place: found.place, credentials };
};

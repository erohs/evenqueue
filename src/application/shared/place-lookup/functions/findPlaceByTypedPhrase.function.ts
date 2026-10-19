import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { typedPhraseCheck } from "#domain/credentials/functions/typedPhraseCheck.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { placeInForce } from "./placeInForce.function.ts";

export const findPlaceByTypedPhrase = async (
    services: Pick<IApplicationServices, "places" | "clock" | "keys">,
    waitlistId: Bytes32Hex,
    words: readonly string[],
): Promise<IPlaceRecord | null> => {
    const check = await typedPhraseCheck(await services.keys.waitlistKey(waitlistId), words);
    const found = await services.places.findPlaceByTypedPhrase(waitlistId, check);
    return placeInForce(services, waitlistId, found, (current) => current.typedPhraseCheck === check);
};

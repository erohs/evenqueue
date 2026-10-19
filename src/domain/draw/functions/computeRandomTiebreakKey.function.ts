import { assertBytes32Hex } from "#domain/shared/bytes/functions/assertBytes32Hex.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { randomTiebreakKeyLayoutTag } from "../consts/randomTiebreakKeyLayoutTag.const.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";

/**
 * Orders entrants who share a priority. Layout, which other implementations must reproduce:
 * SHA-256("evenqueue/random-tiebreak-key/v1" 0x00 ‖ beaconRandomness ‖ committedWaitlistRoot ‖ publicDrawId).
 * Nobody can know it before the beacon round exists, and anyone can recompute it afterwards.
 */
export const computeRandomTiebreakKey = async (
    publicDrawInputs: IPublicDrawInputs,
    publicDrawId: Bytes32Hex,
): Promise<Bytes32Hex> => {
    assertBytes32Hex(publicDrawInputs.beaconRandomness, "beaconRandomness");
    assertBytes32Hex(publicDrawInputs.committedWaitlistRoot, "committedWaitlistRoot");
    assertBytes32Hex(publicDrawId, "publicDrawId");
    const key = await sha256OfConcatenatedParts(
        randomTiebreakKeyLayoutTag,
        decodeHex(publicDrawInputs.beaconRandomness),
        decodeHex(publicDrawInputs.committedWaitlistRoot),
        decodeHex(publicDrawId),
    );
    return encodeHex(key);
};

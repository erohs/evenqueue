import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { randomTiebreakKeyLayoutTag } from "../consts/randomTiebreakKeyLayoutTag.const.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";

/**
 * Orders leaves that share a priority. Layout, which other implementations must reproduce:
 * SHA-256("evenqueue/random-tiebreak-key/v1" 0x00 ‖ beaconRandomness ‖ committedWaitlistRoot ‖ publicDrawId).
 * Nobody can know it before the beacon round exists, and anyone can recompute it afterwards.
 */
export const computeRandomTiebreakKey = (
    publicDrawInputs: IPublicDrawInputs,
    publicDrawId: Bytes32Hex,
): Promise<Bytes32Hex> =>
    sha256Hex(
        randomTiebreakKeyLayoutTag,
        decodeHex(publicDrawInputs.beaconRandomness),
        decodeHex(publicDrawInputs.committedWaitlistRoot),
        decodeHex(publicDrawId),
    );

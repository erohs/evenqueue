import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { commitmentDerivationTags } from "../consts/commitmentDerivationTags.const.ts";

/**
 * Fixed for the life of a place, from the view key it was first issued, so both the entry code and the view key can
 * find the place in a published draw. Kept when recovery replaces the codes. Never published.
 */
export const derivePlaceTag = async (viewKey: ByteArray): Promise<Bytes32Hex> =>
    encodeHex(await sha256OfConcatenatedParts(commitmentDerivationTags.placeTag, viewKey));

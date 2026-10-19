import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/** Tagged apart from the entry code's lookup, so a view key can never be taken for an entry code. */
export const viewKeyLookup = async (viewKey: ByteArray): Promise<Bytes32Hex> =>
    encodeHex(await sha256OfConcatenatedParts(credentialDerivationTags.viewKeyLookup, viewKey));

import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { sha256OfConcatenatedParts } from "#domain/shared/bytes/functions/sha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/** A plain hash is safe here because the entry code has 128 bits. It is stored, never published. */
export const entrySecretLookup = async (entrySecret: ByteArray): Promise<Bytes32Hex> =>
    encodeHex(await sha256OfConcatenatedParts(credentialDerivationTags.entrySecretLookup, entrySecret));

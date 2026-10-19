import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/** A plain hash is safe here because the entry code has 128 bits. It is stored, never published. */
export const entrySecretLookup = (entrySecret: ByteArray): Promise<Bytes32Hex> =>
    sha256Hex(credentialDerivationTags.entrySecretLookup, entrySecret);

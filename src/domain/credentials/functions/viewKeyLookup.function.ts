import { sha256Hex } from "#domain/shared/bytes/functions/sha256Hex.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/** Tagged apart from the entry code's lookup, so a view key can never be taken for an entry code. */
export const viewKeyLookup = (viewKey: ByteArray): Promise<Bytes32Hex> =>
    sha256Hex(credentialDerivationTags.viewKeyLookup, viewKey);

import { encodeHex } from "#domain/shared/bytes/functions/encodeHex.function.ts";
import { hmacSha256OfConcatenatedParts } from "#domain/shared/bytes/functions/hmacSha256OfConcatenatedParts.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";

/**
 * Keyed with the series key, which never sits in the database: 80 bits is too few to survive offline search of a
 * plain hash. Deleting the series key makes every stored check unmatchable.
 */
export const recoveryCodeCheck = async (seriesKey: ByteArray, recoveryCode: ByteArray): Promise<Bytes32Hex> =>
    encodeHex(await hmacSha256OfConcatenatedParts(seriesKey, credentialDerivationTags.recoveryCodeCheck, recoveryCode));

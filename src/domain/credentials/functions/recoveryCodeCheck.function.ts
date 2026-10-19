import { hmacSha256Hex } from "#domain/shared/bytes/functions/hmacSha256Hex.function.ts";
import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";

/**
 * Keyed with the waitlist key, which never sits in the database: 80 bits is too few to survive offline search of a
 * plain hash. Deleting the waitlist key makes every stored check unmatchable.
 */
export const recoveryCodeCheck = (waitlistKey: ServerKey, recoveryCode: ByteArray): Promise<Bytes32Hex> =>
    hmacSha256Hex(waitlistKey, credentialDerivationTags.recoveryCodeCheck, recoveryCode);

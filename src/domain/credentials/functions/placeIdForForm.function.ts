import { hmacSha256Hex } from "#domain/shared/bytes/functions/hmacSha256Hex.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { credentialDerivationTags } from "../consts/credentialDerivationTags.const.ts";
import type { FormNonce } from "../types/FormNonce.type.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";

/**
 * Derived like the codes, so a retried form names the same place and can never add a second one, even after a
 * recovery has replaced the codes it showed. Unpredictable without the entry key, and never published.
 */
export const placeIdForForm = (entryKey: ServerKey, formNonce: FormNonce): Promise<Bytes32Hex> =>
    hmacSha256Hex(entryKey, credentialDerivationTags.placeId, formNonce);

import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** What the store keeps instead of the codes: values to look a place up by, none of which reveal a code. */
export interface IStoredCredentials {
    readonly entrySecretLookup: Bytes32Hex;
    readonly viewKeyLookup: Bytes32Hex;
    /** Keyed with the series key, because the recovery code is too short for a plain hash. */
    readonly recoveryCodeCheck: Bytes32Hex;
}

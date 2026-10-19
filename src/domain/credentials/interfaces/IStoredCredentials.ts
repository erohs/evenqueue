import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** What the store keeps instead of the codes: values to look a place up by, none of which reveal a code. */
export interface IStoredCredentials {
    readonly entrySecretLookup: Bytes32Hex;
    readonly viewKeyLookup: Bytes32Hex;
    /** Keyed with the waitlist key, because the recovery code is too short for a plain hash. */
    readonly recoveryCodeCheck: Bytes32Hex;
    /** Keyed with the waitlist key too: seven words are about 90 bits, too few for a plain hash. */
    readonly typedPhraseCheck: Bytes32Hex;
    /**
     * Derived from the current view key and replaced with the codes on recovery. A published recovery links the old
     * and new public draw ids, so the current codes can find the place in a draw committed before the swap, and the
     * replaced codes cannot. Never published.
     */
    readonly placeTag: Bytes32Hex;
}

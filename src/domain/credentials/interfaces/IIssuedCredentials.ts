import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";

/** Shown to the buyer once and never stored. */
export interface IIssuedCredentials {
    /** Claims, withdraws and checks status. */
    readonly entrySecret: ByteArray;
    /** Checks status only, for a helper or venue to hold. */
    readonly viewKey: ByteArray;
    /** Printed; replaces a lost entry code after a delay. */
    readonly recoveryCode: ByteArray;
}

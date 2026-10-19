import type { FormNonce } from "#domain/credentials/types/FormNonce.type.ts";

/**
 * too-quick: sent sooner than a person could, or dated in the future; expired: older than a day; not-genuine: not
 * signed by this instance for this form and waitlist.
 */
export type FormTokenReading =
    | { readonly kind: "accepted"; readonly nonce: FormNonce }
    | { readonly kind: "too-quick" }
    | { readonly kind: "expired" }
    | { readonly kind: "not-genuine" };

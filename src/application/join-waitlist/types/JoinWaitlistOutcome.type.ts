import type { FormRefusalReason } from "#application/shared/form-checks/types/FormRefusalReason.type.ts";
import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";

/**
 * joined: show the codes once, including on a retried form; confirm-again: show a fresh form; codes-already-replaced:
 * the form was used before and its codes have since been replaced by a recovery, so showing them would mislead.
 */
export type JoinWaitlistOutcome =
    | ({ readonly kind: "joined"; readonly codes: IIssuedCredentials } & IDropWithWaitlist)
    | ({ readonly kind: "confirm-again"; readonly reason: FormRefusalReason } & IDropWithWaitlist)
    | ({ readonly kind: "entry-closed" } & IDropWithWaitlist)
    | { readonly kind: "waitlist-full" }
    | { readonly kind: "codes-already-replaced" }
    | { readonly kind: "drop-not-found" };

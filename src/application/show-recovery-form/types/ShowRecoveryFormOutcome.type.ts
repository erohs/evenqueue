import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";

export type ShowRecoveryFormOutcome =
    ({ readonly kind: "form"; readonly formToken: string } & IDropWithWaitlist) | { readonly kind: "drop-not-found" };

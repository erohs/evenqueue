import type { FormRefusalReason } from "#application/shared/form-checks/types/FormRefusalReason.type.ts";
import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** recovery-requested: show the new codes once, and when they start working. */
export type RequestRecoveryOutcome =
    | ({
          readonly kind: "recovery-requested";
          readonly codes: IIssuedCredentials;
          readonly takesEffectAt: EpochMilliseconds;
      } & IDropWithWaitlist)
    | ({ readonly kind: "confirm-again"; readonly reason: FormRefusalReason } & IDropWithWaitlist)
    | { readonly kind: "code-not-recognised" }
    | { readonly kind: "drop-not-found" };

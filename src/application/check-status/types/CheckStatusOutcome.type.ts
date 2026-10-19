import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { CodeAccess } from "#application/shared/place-lookup/types/CodeAccess.type.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

/** A status shows no identity, only the place's own counts and whether a recovery is waiting to take effect. */
export type CheckStatusOutcome =
    | ({
          readonly kind: "status";
          readonly access: CodeAccess;
          readonly place: IWaitlistPlace;
          readonly recoveryTakesEffectAt: EpochMilliseconds | null;
      } & IDropWithWaitlist)
    | { readonly kind: "code-not-recognised" }
    | { readonly kind: "drop-not-found" };

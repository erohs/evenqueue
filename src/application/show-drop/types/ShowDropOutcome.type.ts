import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** The drop page's contents. A token is issued only while the drop is open for entry. */
export type ShowDropOutcome =
    | ({
          readonly kind: "drop";
          readonly isOpenForEntry: boolean;
          readonly entryClosesAt: EpochMilliseconds | null;
          readonly joinFormToken: string | null;
      } & IDropWithWaitlist)
    | { readonly kind: "drop-not-found" };

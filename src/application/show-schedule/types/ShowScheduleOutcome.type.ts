import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";

/** The public times of a drop; draw times and checkpoints join them once draws are stored. */
export type ShowScheduleOutcome =
    | ({ readonly kind: "schedule"; readonly entryClosesAt: EpochMilliseconds | null } & IDropWithWaitlist)
    | { readonly kind: "drop-not-found" };

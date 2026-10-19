import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { AllocationRuleId } from "../types/AllocationRuleId.type.ts";
import type { PlaceOutcomeInDrop } from "../types/PlaceOutcomeInDrop.type.ts";
import type { Priority } from "../types/Priority.type.ts";

/**
 * Decides each place's priority when a draw is committed, and what happens to each place after a drop. Higher
 * priority is offered first; equal priorities are ordered by the draw's random tiebreak key, so the vendor cannot
 * choose who comes first.
 */
export interface IAllocationRule {
    readonly id: AllocationRuleId;
    /** False means every drop starts with an empty waitlist. */
    readonly shouldKeepPlacesBetweenDrops: boolean;
    priorityOf: (place: IWaitlistPlace) => Priority;
    /** Null means the place leaves the waitlist. */
    placeAfterDrop: (
        place: IWaitlistPlace,
        outcome: PlaceOutcomeInDrop,
        currentEntryWindowNumber: Count,
    ) => IWaitlistPlace | null;
    /** A place with exactly this priority, for rebuilding one from a published draw after the database is lost. */
    placeWithPriority: (placeId: Bytes32Hex, priority: Priority) => IWaitlistPlace;
}

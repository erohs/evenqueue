import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";
import type { AllocationRuleId } from "../types/AllocationRuleId.type.ts";
import type { PlaceOutcomeInDrop } from "../types/PlaceOutcomeInDrop.type.ts";

/**
 * Decides who is offered a unit first, and what happens to each place after a drop. Higher priority is offered
 * first; equal priorities are ordered by the draw's random tiebreak key, so the vendor cannot choose who comes first.
 */
export interface IAllocationRule {
    readonly id: AllocationRuleId;
    /** False means every drop starts with an empty waitlist. */
    readonly shouldKeepPlacesBetweenDrops: boolean;
    priorityOf: (place: IWaitlistPlace) => number;
    /** Null means the place leaves the waitlist. */
    placeAfterDrop: (
        place: IWaitlistPlace,
        outcome: PlaceOutcomeInDrop,
        currentEntryWindowNumber: number,
    ) => IWaitlistPlace | null;
}

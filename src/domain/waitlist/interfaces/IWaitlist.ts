import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/**
 * A vendor's waitlist. A buyer joins it once, through any of its open drops, and is entered in each drop after that.
 * The rule and whether places are kept are fixed for its whole life, because priorities and join order mean nothing
 * under another rule; a vendor who wants a different rule starts a new waitlist.
 */
export interface IWaitlist {
    readonly waitlistId: Bytes32Hex;
    readonly allocationRuleId: AllocationRuleId;
    /**
     * Allowed only under equal-chance-each-drop, where a place carries nothing from one drop to the next: under the
     * other rules, forgetting places would silently void every buyer's priority or place in line.
     */
    readonly shouldForgetPlacesAfterEachDrop: boolean;
    /** A neutral name for buyers' code sheets and calendar files, so neither names the vendor or the product. */
    readonly label: string;
}

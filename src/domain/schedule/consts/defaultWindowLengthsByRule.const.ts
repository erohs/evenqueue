import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import { durationOfHours } from "#domain/shared/time/functions/durationOfHours.function.ts";
import type { IWindowLengths } from "../interfaces/IWindowLengths.ts";

const windowLengths = (entryHours: number, offerHours: number): IWindowLengths => ({
    entryWindow: durationOfHours(entryHours),
    offerWindow: durationOfHours(offerHours),
    checkpointInterval: durationOfHours(12),
});

/** Long windows keep buyers with intermittent access close to equal odds; a closed line needs less time. */
export const defaultWindowLengthsByRule: Readonly<Record<AllocationRuleId, IWindowLengths>> = {
    "equal-chance-each-drop": windowLengths(72, 72),
    "priority-after-losses": windowLengths(72, 72),
    "join-order-line": windowLengths(36, 36),
};

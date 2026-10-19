import type { AllocationRuleId } from "#domain/allocation-rules/types/AllocationRuleId.type.ts";
import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import type { IWindowLengths } from "../interfaces/IWindowLengths.ts";

/** Long windows keep buyers with intermittent access close to equal odds; a closed line needs less time. */
export const defaultWindowLengthsByRule: Readonly<Record<AllocationRuleId, IWindowLengths>> = {
    "equal-chance-each-drop": {
        entryWindow: 72 * millisecondsPerHour,
        offerWindow: 72 * millisecondsPerHour,
        checkpointInterval: 12 * millisecondsPerHour,
    },
    "priority-after-losses": {
        entryWindow: 72 * millisecondsPerHour,
        offerWindow: 72 * millisecondsPerHour,
        checkpointInterval: 12 * millisecondsPerHour,
    },
    "join-order-line": {
        entryWindow: 36 * millisecondsPerHour,
        offerWindow: 36 * millisecondsPerHour,
        checkpointInterval: 12 * millisecondsPerHour,
    },
};

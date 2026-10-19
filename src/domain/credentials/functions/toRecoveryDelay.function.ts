import type { DurationMilliseconds } from "#domain/shared/time/types/DurationMilliseconds.type.ts";
import { minimumRecoveryDelay } from "../consts/minimumRecoveryDelay.const.ts";
import type { RecoveryDelay } from "../types/RecoveryDelay.type.ts";

export const toRecoveryDelay = (delay: DurationMilliseconds): RecoveryDelay => {
    if (delay < minimumRecoveryDelay) throw new RangeError("the recovery delay must be at least six hours");
    return delay as RecoveryDelay;
};

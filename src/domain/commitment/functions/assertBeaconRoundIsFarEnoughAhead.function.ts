import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import type { BeaconRound } from "#domain/beacon/types/BeaconRound.type.ts";
import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { minimumBeaconLead } from "../consts/minimumBeaconLead.const.ts";

/** The rule that keeps the randomness unknown when the waitlist is fixed. */
export const assertBeaconRoundIsFarEnoughAhead = (beaconRound: BeaconRound, committedAt: EpochMilliseconds): void => {
    if (beaconRoundTime(beaconRound) < addDuration(committedAt, minimumBeaconLead)) {
        throw new RangeError("the named beacon round must be at least ten minutes after the commitment");
    }
};

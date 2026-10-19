import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { minimumBeaconLead } from "../consts/minimumBeaconLead.const.ts";

export const assertBeaconRoundIsFarEnoughAhead = (beaconRound: number, committedAt: EpochMilliseconds): void => {
    if (beaconRoundTime(beaconRound) < committedAt + minimumBeaconLead) {
        throw new RangeError("the named beacon round must be at least ten minutes after the commitment");
    }
};

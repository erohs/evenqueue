import { beaconDelayNoticeAfter } from "../consts/beaconDelayNoticeAfter.const.ts";
import { haltAttestationsNeededToVoid } from "../consts/haltAttestationsNeededToVoid.const.ts";
import { maximumVoidsPerDraw } from "../consts/maximumVoidsPerDraw.const.ts";
import type { IBeaconDecisionInput } from "../interfaces/IBeaconDecisionInput.ts";
import type { BeaconAction } from "../types/BeaconAction.type.ts";
import { beaconRoundTime } from "./beaconRoundTime.function.ts";

/**
 * Mechanical, so the public log shows no choice but the wait. A committed round can be fetched by number however late
 * it arrives, so lateness alone never voids a draw.
 */
export const decideBeaconAction = (input: IBeaconDecisionInput): BeaconAction => {
    if (input.readingSummary.status === "agreed") return "use";
    if (input.independentHaltAttestations < haltAttestationsNeededToVoid) {
        const isLate = input.now >= beaconRoundTime(input.committedRound) + beaconDelayNoticeAfter;
        return isLate ? "wait-with-delay-notice" : "wait";
    }
    return input.voidsSoFar < maximumVoidsPerDraw ? "void-and-recommit" : "abandon";
};

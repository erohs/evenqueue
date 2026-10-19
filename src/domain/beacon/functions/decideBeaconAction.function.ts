import { addDuration } from "#domain/shared/time/functions/addDuration.function.ts";
import { beaconDelayNoticeAfter } from "../consts/beaconDelayNoticeAfter.const.ts";
import { haltAttestationsNeededToVoid } from "../consts/haltAttestationsNeededToVoid.const.ts";
import { maximumVoidsPerDraw } from "../consts/maximumVoidsPerDraw.const.ts";
import type { IBeaconDecisionInput } from "../interfaces/IBeaconDecisionInput.ts";
import type { BeaconAction } from "../types/BeaconAction.type.ts";
import { beaconRoundTime } from "./beaconRoundTime.function.ts";

/**
 * Mechanical, so the public log shows no choice but the wait. A committed round can be fetched by number however late
 * it arrives, so lateness alone never voids a draw. Once any endpoint has served the round the vendor may have seen
 * the outcome, so the draw waits for the endpoints to agree and is never voided.
 */
export const decideBeaconAction = (input: IBeaconDecisionInput): BeaconAction => {
    const { status } = input.readingSummary;
    if (status === "agreed") return "use";
    const canVoid = status === "unavailable" && input.independentHaltAttestations >= haltAttestationsNeededToVoid;
    if (canVoid) return input.voidsSoFar < maximumVoidsPerDraw ? "void-and-recommit" : "abandon";
    const isLate = input.now >= addDuration(beaconRoundTime(input.committedRound), beaconDelayNoticeAfter);
    return isLate ? "wait-with-delay-notice" : "wait";
};

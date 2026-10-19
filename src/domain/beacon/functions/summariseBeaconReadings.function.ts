import type { IBeaconReadingSummary } from "../interfaces/IBeaconReadingSummary.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";

/**
 * Compares what each endpoint returned, by signature, keyed by the endpoint's origin, so each endpoint counts once.
 * A round is used only when two or more endpoints agree and none differ. Null means the endpoint did not answer, or
 * sent something that did not parse.
 */
export const summariseBeaconReadings = (readings: ReadonlyMap<string, IBeaconRound | null>): IBeaconReadingSummary => {
    const answers = [...readings].flatMap(([endpoint, round]) => (round === null ? [] : [{ endpoint, round }]));
    const answeringEndpoints = answers.map((answer) => answer.endpoint);
    const firstRound = answers[0]?.round;
    if (firstRound === undefined) return { status: "unavailable", beaconRound: null, answeringEndpoints };
    if (answers.some((answer) => answer.round.signature !== firstRound.signature)) {
        return { status: "endpoints-disagree", beaconRound: null, answeringEndpoints };
    }
    if (answers.length < 2) return { status: "single-endpoint", beaconRound: null, answeringEndpoints };
    return { status: "agreed", beaconRound: firstRound, answeringEndpoints };
};

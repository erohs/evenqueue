import type { IBeaconReadingSummary } from "../interfaces/IBeaconReadingSummary.ts";
import type { IBeaconRound } from "../interfaces/IBeaconRound.ts";
import type { IEndpointBeaconReading } from "../interfaces/IEndpointBeaconReading.ts";

/** Compares what the endpoints returned, by signature. A round is used only when two or more agree and none differ. */
export const summariseBeaconReadings = (readings: readonly IEndpointBeaconReading[]): IBeaconReadingSummary => {
    const answers = readings.flatMap((reading) =>
        reading.beaconRound === null ? [] : [{ name: reading.endpointName, beaconRound: reading.beaconRound }],
    );
    const answeringEndpointNames = answers.map((answer) => answer.name);
    const firstRound: IBeaconRound | undefined = answers[0]?.beaconRound;
    if (firstRound === undefined) return { status: "unavailable", beaconRound: null, answeringEndpointNames };
    if (answers.some((answer) => answer.beaconRound.signature !== firstRound.signature)) {
        return { status: "endpoints-disagree", beaconRound: null, answeringEndpointNames };
    }
    if (answers.length < 2) return { status: "single-endpoint", beaconRound: null, answeringEndpointNames };
    return { status: "agreed", beaconRound: firstRound, answeringEndpointNames };
};

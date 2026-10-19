import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import { beaconRoundTime } from "../functions/beaconRoundTime.function.ts";
import { decideBeaconAction } from "../functions/decideBeaconAction.function.ts";
import type { IBeaconDecisionInput } from "../interfaces/IBeaconDecisionInput.ts";

const committedRound = 1_000_000;
const roundTime = beaconRoundTime(committedRound);
const unavailable = { status: "unavailable", beaconRound: null, answeringEndpointNames: [] } as const;

const decisionInput = (overrides: Partial<IBeaconDecisionInput>): IBeaconDecisionInput => ({
    now: roundTime,
    committedRound,
    readingSummary: unavailable,
    voidsSoFar: 0,
    independentHaltAttestations: 0,
    ...overrides,
});

describe("Using decideBeaconAction, when the endpoints agree", () => {
    test("then it should use the round", () => {
        const agreed = {
            status: "agreed",
            beaconRound: { round: committedRound, signature: "", randomness: "" },
            answeringEndpointNames: ["first", "second"],
        } as const;
        assert.equal(decideBeaconAction(decisionInput({ readingSummary: agreed })), "use");
    });
});

describe("Using decideBeaconAction, when the round is under an hour late", () => {
    test("then it should keep waiting", () => {
        assert.equal(decideBeaconAction(decisionInput({ now: roundTime + 59 * 60_000 })), "wait");
    });
});

describe("Using decideBeaconAction, when the round is an hour late with no attested halt", () => {
    test("then it should keep waiting and publish a delay notice, never void", () => {
        const action = decideBeaconAction(decisionInput({ now: roundTime + 48 * millisecondsPerHour }));
        assert.equal(action, "wait-with-delay-notice");
    });
});

describe("Using decideBeaconAction, when only one party attests a halt", () => {
    test("then it should keep waiting", () => {
        assert.equal(decideBeaconAction(decisionInput({ independentHaltAttestations: 1 })), "wait");
    });
});

describe("Using decideBeaconAction, when two independent parties attest a halt", () => {
    test("then it should void and recommit while voids remain", () => {
        assert.equal(decideBeaconAction(decisionInput({ independentHaltAttestations: 2 })), "void-and-recommit");
    });

    test("then it should abandon once both voids are used", () => {
        const input = decisionInput({ independentHaltAttestations: 2, voidsSoFar: 2 });
        assert.equal(decideBeaconAction(input), "abandon");
    });
});

import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { beaconRoundTime } from "../functions/beaconRoundTime.function.ts";
import { decideBeaconAction } from "../functions/decideBeaconAction.function.ts";
import { toBeaconRound } from "../functions/toBeaconRound.function.ts";
import type { IBeaconDecisionInput } from "../interfaces/IBeaconDecisionInput.ts";
import type { IBeaconReadingSummary } from "../interfaces/IBeaconReadingSummary.ts";

const committedRound = toBeaconRound(1_000_000);
const roundTime = beaconRoundTime(committedRound);
const summary = (status: IBeaconReadingSummary["status"]): IBeaconReadingSummary => ({
    status,
    beaconRound: null,
    answeringEndpoints: [],
});

const decisionInput = (overrides: Partial<IBeaconDecisionInput>): IBeaconDecisionInput => ({
    now: roundTime,
    committedRound,
    readingSummary: summary("unavailable"),
    voidsSoFar: toCount(0),
    independentHaltAttestations: toCount(0),
    ...overrides,
});

describe("Using decideBeaconAction, when the endpoints agree", () => {
    test("then it should use the round", () => {
        assert.equal(decideBeaconAction(decisionInput({ readingSummary: summary("agreed") })), "use");
    });
});

describe("Using decideBeaconAction, when the round is under an hour late", () => {
    test("then it should keep waiting", () => {
        assert.equal(decideBeaconAction(decisionInput({ now: toEpochMilliseconds(roundTime + 59 * 60_000) })), "wait");
    });
});

describe("Using decideBeaconAction, when the round is an hour late with no attested halt", () => {
    test("then it should keep waiting and publish a delay notice, never void", () => {
        const action = decideBeaconAction(decisionInput({ now: toEpochMilliseconds(roundTime + 48 * 3_600_000) }));
        assert.equal(action, "wait-with-delay-notice");
    });
});

describe("Using decideBeaconAction, when only one party attests a halt", () => {
    test("then it should keep waiting", () => {
        assert.equal(decideBeaconAction(decisionInput({ independentHaltAttestations: toCount(1) })), "wait");
    });
});

describe("Using decideBeaconAction, when two independent parties attest a halt and no endpoint has the round", () => {
    test("then it should void and recommit while voids remain", () => {
        assert.equal(
            decideBeaconAction(decisionInput({ independentHaltAttestations: toCount(2) })),
            "void-and-recommit",
        );
    });

    test("then it should abandon once both voids are used", () => {
        const input = decisionInput({ independentHaltAttestations: toCount(2), voidsSoFar: toCount(2) });
        assert.equal(decideBeaconAction(input), "abandon");
    });
});

describe("Using decideBeaconAction, when an endpoint has served the round and two parties attest a halt", () => {
    for (const status of ["single-endpoint", "endpoints-disagree"] as const) {
        test(`then it should keep waiting on ${status}, because the vendor may have seen the outcome`, () => {
            const input = decisionInput({ readingSummary: summary(status), independentHaltAttestations: toCount(2) });
            assert.equal(decideBeaconAction(input), "wait");
        });
    }
});

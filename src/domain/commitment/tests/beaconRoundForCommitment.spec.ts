import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import { millisecondsPerHour } from "#domain/shared/time/consts/millisecondsPerHour.const.ts";
import { beaconRoundForCommitment } from "../functions/beaconRoundForCommitment.function.ts";

describe("Using beaconRoundForCommitment, with the default anchor horizon", () => {
    test("then it should name the first round six hours after the commitment", () => {
        const committedAt = beaconRoundTime(1_000_000);
        assert.equal(beaconRoundTime(beaconRoundForCommitment(committedAt)), committedAt + 6 * millisecondsPerHour);
    });
});

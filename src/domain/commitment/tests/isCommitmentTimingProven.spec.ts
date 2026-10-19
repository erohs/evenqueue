import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { commitmentInputForTests } from "#tests/support/functions/commitmentInputForTests.function.ts";
import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import { createCommitment } from "../functions/createCommitment.function.ts";
import { isCommitmentTimingProven } from "../functions/isCommitmentTimingProven.function.ts";

const commitment = await createCommitment(commitmentInputForTests());
const roundTime = beaconRoundTime(commitment.beaconRound);

describe("Using isCommitmentTimingProven, when the root was timestamped before the round existed", () => {
    test("then it should count the timing as proven", () => {
        assert.equal(isCommitmentTimingProven(commitment, roundTime - 1), true);
    });
});

describe("Using isCommitmentTimingProven, when the timestamp is from after the round", () => {
    test("then it should mark the timing unproven, as for a backdated commitment", () => {
        assert.equal(isCommitmentTimingProven(commitment, roundTime), false);
    });
});

describe("Using isCommitmentTimingProven, when there is no timestamp", () => {
    test("then it should mark the timing unproven", () => {
        assert.equal(isCommitmentTimingProven(commitment, null), false);
    });
});

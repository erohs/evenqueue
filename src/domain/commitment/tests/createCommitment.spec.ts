import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { commitmentInputForTests } from "#tests/support/functions/commitmentInputForTests.function.ts";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import { createCommitment } from "../functions/createCommitment.function.ts";

describe("Using createCommitment, when the named round is well after the commitment", () => {
    test("then it should commit the waitlist root and the place counts", async () => {
        const commitment = await createCommitment(commitmentInputForTests());
        assert.deepEqual(
            [commitment.committedWaitlistRoot, commitment.placeCount, commitment.replacesBeaconRound],
            [vectors.committedWaitlistRoot, vectors.leaves.length, null],
        );
    });
});

describe("Using createCommitment, when the named round is less than ten minutes away", () => {
    test("then it should refuse it", async () => {
        const committedAt = beaconRoundTime(1_000_000) - 9 * 60_000;
        await assert.rejects(createCommitment(commitmentInputForTests({ committedAt })), RangeError);
    });
});

describe("Using createCommitment, when the named round has already passed", () => {
    test("then it should refuse it, so no draw is committed after its randomness is known", async () => {
        const committedAt = beaconRoundTime(1_000_000) + 1;
        await assert.rejects(createCommitment(commitmentInputForTests({ committedAt })), RangeError);
    });
});

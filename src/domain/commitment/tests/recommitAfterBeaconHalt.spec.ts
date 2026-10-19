import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { commitmentInputForTests } from "#tests/support/functions/commitmentInputForTests.function.ts";
import { beaconRoundTime } from "#domain/beacon/functions/beaconRoundTime.function.ts";
import { createCommitment } from "../functions/createCommitment.function.ts";
import { recommitAfterBeaconHalt } from "../functions/recommitAfterBeaconHalt.function.ts";
import type { IRecommitmentInput } from "../interfaces/IRecommitmentInput.ts";

const previous = await createCommitment(commitmentInputForTests());
const newBeaconRound = 1_010_000;

const recommitmentInput = (overrides: Partial<IRecommitmentInput>): IRecommitmentInput => ({
    previous,
    voidsSoFar: 0,
    newBeaconRound,
    recommittedAt: beaconRoundTime(newBeaconRound) - 6 * 3_600_000,
    reason: "the beacon chain halted",
    attestedBy: ["first witness", "second witness"],
    ...overrides,
});

describe("Using recommitAfterBeaconHalt, when two independent parties attest a halt", () => {
    test("then it should name the later round and keep the root frozen", () => {
        const { commitment } = recommitAfterBeaconHalt(recommitmentInput({}));
        assert.deepEqual(
            [commitment.beaconRound, commitment.replacesBeaconRound, commitment.committedWaitlistRoot],
            [newBeaconRound, previous.beaconRound, previous.committedWaitlistRoot],
        );
    });

    test("then it should publish a void naming the voided round and who attested", () => {
        const { drawVoid } = recommitAfterBeaconHalt(recommitmentInput({}));
        assert.deepEqual(
            [drawVoid.voidedBeaconRound, drawVoid.attestedBy],
            [previous.beaconRound, ["first witness", "second witness"]],
        );
    });
});

describe("Using recommitAfterBeaconHalt, when the same party attests twice", () => {
    test("then it should refuse the void", () => {
        const input = recommitmentInput({ attestedBy: ["first witness", "first witness"] });
        assert.throws(() => recommitAfterBeaconHalt(input), RangeError);
    });
});

describe("Using recommitAfterBeaconHalt, when both voids are used", () => {
    test("then it should refuse another", () => {
        assert.throws(() => recommitAfterBeaconHalt(recommitmentInput({ voidsSoFar: 2 })), RangeError);
    });
});

describe("Using recommitAfterBeaconHalt, when the new round is not later than the voided one", () => {
    test("then it should refuse it", () => {
        const input = recommitmentInput({ newBeaconRound: previous.beaconRound });
        assert.throws(() => recommitAfterBeaconHalt(input), RangeError);
    });
});

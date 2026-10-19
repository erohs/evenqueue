import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { publicDrawInputsFor } from "#tests/support/functions/publicDrawInputsFor.function.ts";
import vectors from "#tests/vectors/randomTiebreakKey.json" with { type: "json" };
import { computeRandomTiebreakKey } from "../functions/computeRandomTiebreakKey.function.ts";

const inputs = publicDrawInputsFor("base");
const id = deterministicBytes32Hex("id");

describe("Using computeRandomTiebreakKey, when given the shared cross-implementation vectors", () => {
    for (const [caseNumber, vector] of vectors.cases.entries()) {
        test(`then it should produce the expected key for case ${caseNumber + 1}`, async () => {
            const { beaconRandomness, committedWaitlistRoot, publicDrawId, expectedKey } = vector;
            const key = await computeRandomTiebreakKey({ beaconRandomness, committedWaitlistRoot }, publicDrawId);
            assert.equal(key, expectedKey);
        });
    }
});

describe("Using computeRandomTiebreakKey, when one input changes", () => {
    test("then it should change with the beacon randomness", async () => {
        const changed = { ...inputs, beaconRandomness: deterministicBytes32Hex("other-randomness") };
        assert.notEqual(await computeRandomTiebreakKey(changed, id), await computeRandomTiebreakKey(inputs, id));
    });

    test("then it should change with the committed waitlist root", async () => {
        const changed = { ...inputs, committedWaitlistRoot: deterministicBytes32Hex("other-root") };
        assert.notEqual(await computeRandomTiebreakKey(changed, id), await computeRandomTiebreakKey(inputs, id));
    });

    test("then it should change with the public draw id", async () => {
        const otherId = deterministicBytes32Hex("other-id");
        assert.notEqual(await computeRandomTiebreakKey(inputs, otherId), await computeRandomTiebreakKey(inputs, id));
    });
});

describe("Using computeRandomTiebreakKey, when an input is malformed", () => {
    test("then it should refuse randomness that is not hex", async () => {
        await assert.rejects(computeRandomTiebreakKey({ ...inputs, beaconRandomness: "ABC" }, id), TypeError);
    });

    test("then it should refuse upper-case hex", async () => {
        await assert.rejects(computeRandomTiebreakKey(inputs, id.toUpperCase()), TypeError);
    });

    test("then it should refuse an id of the wrong length", async () => {
        await assert.rejects(computeRandomTiebreakKey(inputs, id.slice(2)), TypeError);
    });
});

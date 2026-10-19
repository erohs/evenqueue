import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { waitlistCommitmentVectors } from "#tests/support/functions/waitlistCommitmentVectors.function.ts";
import { computePublicDrawId } from "../functions/computePublicDrawId.function.ts";

const vectors = waitlistCommitmentVectors();

describe("Using computePublicDrawId, when given the shared cross-implementation vectors", () => {
    for (const [placeNumber, place] of vectors.places.entries()) {
        test(`then it should produce the expected id for place ${placeNumber + 1}`, async () => {
            assert.equal(await computePublicDrawId(place.placeTag, vectors.drawId), place.publicDrawId);
        });
    }
});

describe("Using computePublicDrawId, when the same place enters another draw", () => {
    test("then it should publish an unrelated id", async () => {
        const place = vectors.places[0] ?? assert.fail();
        const otherDraw = await computePublicDrawId(place.placeTag, deterministicBytes32Hex("draw/second"));
        assert.notEqual(otherDraw, place.publicDrawId);
    });
});

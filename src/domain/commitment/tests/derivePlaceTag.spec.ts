import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/waitlistCommitment.json" with { type: "json" };
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { derivePlaceTag } from "../functions/derivePlaceTag.function.ts";

describe("Using derivePlaceTag, when given the shared cross-implementation vectors", () => {
    for (const [placeNumber, place] of vectors.places.entries()) {
        test(`then it should produce the expected tag for place ${placeNumber + 1}`, async () => {
            assert.equal(await derivePlaceTag(decodeHex(place.viewKey)), place.placeTag);
        });
    }
});

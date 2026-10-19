import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toServerKey } from "../functions/toServerKey.function.ts";

describe("Using toServerKey, when the key is shorter than 256 bits", () => {
    test("then it should refuse it", () => {
        assert.throws(() => toServerKey(new Uint8Array(31)), RangeError);
    });
});

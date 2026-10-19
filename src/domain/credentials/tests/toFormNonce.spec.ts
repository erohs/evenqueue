import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toFormNonce } from "../functions/toFormNonce.function.ts";

describe("Using toFormNonce, when the nonce is too short to be unguessable", () => {
    test("then it should refuse it", () => {
        assert.throws(() => toFormNonce(new Uint8Array(15)), RangeError);
    });
});

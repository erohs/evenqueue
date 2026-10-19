import assert from "node:assert/strict";
import { describe, test } from "node:test";
import vectors from "#tests/vectors/publicLog.json" with { type: "json" };
import type { JsonValue } from "../types/JsonValue.type.ts";
import { canonicalJson } from "../functions/canonicalJson.function.ts";

describe("Using canonicalJson, when given the shared cross-implementation vectors", () => {
    for (const [position, vector] of vectors.entries.entries()) {
        test(`then it should match the expected text for entry ${position}`, () => {
            const { sequenceNumber, recordedAt, entryType, body, previousHash } = vector;
            const value = { sequenceNumber, recordedAt, entryType, body, previousHash } as JsonValue;
            assert.equal(canonicalJson(value), vector.canonicalText);
        });
    }
});

describe("Using canonicalJson, when the same object is built in a different key order", () => {
    test("then it should give the same text", () => {
        assert.equal(
            canonicalJson({ second: [2, { inner: 1, alpha: 0 }], first: null }),
            canonicalJson({ first: null, second: [2, { alpha: 0, inner: 1 }] }),
        );
    });
});

describe("Using canonicalJson, when a number is not a safe integer", () => {
    test("then it should refuse a fraction", () => {
        assert.throws(() => canonicalJson({ price: 1.5 }), RangeError);
    });

    test("then it should refuse a number too large to be exact", () => {
        assert.throws(() => canonicalJson({ count: 2 ** 53 }), RangeError);
    });
});

describe("Using canonicalJson, when a string holds a lone surrogate", () => {
    test("then it should refuse it", () => {
        assert.throws(() => canonicalJson({ note: "\uD800" }), TypeError);
    });
});

describe("Using canonicalJson, when a key is not a plain ASCII name", () => {
    test("then it should refuse it", () => {
        assert.throws(() => canonicalJson({ "two words": 1 }), TypeError);
    });
});

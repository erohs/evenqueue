import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { publicLogEntriesFromVectors } from "#tests/support/functions/publicLogEntriesFromVectors.function.ts";
import { checkpointOfLog } from "../functions/checkpointOfLog.function.ts";

const entries = publicLogEntriesFromVectors();

describe("Using checkpointOfLog, for the whole log", () => {
    test("then it should name the entry count and the latest hash", () => {
        assert.deepEqual(checkpointOfLog(entries), { entryCount: 3, headHash: entries[2]?.entryHash });
    });
});

describe("Using checkpointOfLog, for an empty log", () => {
    test("then it should use the zero hash", () => {
        assert.deepEqual(checkpointOfLog([]), { entryCount: 0, headHash: "0".repeat(64) });
    });
});

describe("Using checkpointOfLog, for more entries than the log holds", () => {
    test("then it should refuse", () => {
        assert.throws(() => checkpointOfLog(entries, toCount(4)), RangeError);
    });
});

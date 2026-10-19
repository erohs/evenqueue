import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { publicLogEntriesFromVectors } from "#tests/support/functions/publicLogEntriesFromVectors.function.ts";
import { appendLogEntry } from "../functions/appendLogEntry.function.ts";
import { checkpointOfLog } from "../functions/checkpointOfLog.function.ts";
import { doesLogExtendCheckpoint } from "../functions/doesLogExtendCheckpoint.function.ts";

const entries = publicLogEntriesFromVectors();
const savedAfterTwo = checkpointOfLog(entries, toCount(2));

describe("Using doesLogExtendCheckpoint, when the log has grown since the buyer saved a checkpoint", () => {
    test("then it should confirm the history was kept", () => {
        assert.equal(doesLogExtendCheckpoint(entries, savedAfterTwo), true);
    });
});

describe("Using doesLogExtendCheckpoint, when the history before the checkpoint was rewritten", () => {
    test("then it should report it", async () => {
        const first = entries[0] ?? assert.fail();
        const rewritten = await appendLogEntry(first, "service-gap", { startsAt: 0 }, first.recordedAt);
        assert.equal(doesLogExtendCheckpoint([first, rewritten], savedAfterTwo), false);
    });
});

describe("Using doesLogExtendCheckpoint, when the log is now shorter than the checkpoint", () => {
    test("then it should report it", () => {
        assert.equal(doesLogExtendCheckpoint(entries.slice(0, 1), savedAfterTwo), false);
    });
});

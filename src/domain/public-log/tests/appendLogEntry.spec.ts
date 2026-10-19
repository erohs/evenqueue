import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { publicLogEntriesFromVectors } from "#tests/support/functions/publicLogEntriesFromVectors.function.ts";
import { appendLogEntry } from "../functions/appendLogEntry.function.ts";
import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";

const expected = publicLogEntriesFromVectors();

describe("Using appendLogEntry, when rebuilding the shared vector log entry by entry", () => {
    test("then it should produce exactly the expected entries", async () => {
        let latest: IPublicLogEntry | null = null;
        const rebuilt: IPublicLogEntry[] = [];
        for (const entry of expected) {
            latest = await appendLogEntry(latest, entry.entryType, entry.body, entry.recordedAt);
            rebuilt.push(latest);
        }
        assert.deepEqual(rebuilt, expected);
    });
});

describe("Using appendLogEntry, when the new entry is dated before the latest one", () => {
    test("then it should refuse it", async () => {
        const latest = expected.at(-1) ?? assert.fail();
        await assert.rejects(
            appendLogEntry(latest, "unit-counts", {}, toEpochMilliseconds(latest.recordedAt - 1)),
            RangeError,
        );
    });
});

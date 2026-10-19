import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { publicLogEntriesFromVectors } from "#tests/support/functions/publicLogEntriesFromVectors.function.ts";
import { appendLogEntry } from "../functions/appendLogEntry.function.ts";
import { findLogProblems } from "../functions/findLogProblems.function.ts";

const entries = publicLogEntriesFromVectors();
const first = entries[0] ?? assert.fail();
const second = entries[1] ?? assert.fail();
const third = entries[2] ?? assert.fail();

describe("Using findLogProblems, when the log is intact", () => {
    test("then it should find nothing", async () => {
        assert.deepEqual(await findLogProblems(entries), []);
    });
});

describe("Using findLogProblems, when an entry's body is edited", () => {
    test("then it should report that entry as altered", async () => {
        const edited = [first, { ...second, body: { startsAt: 0 } }, third];
        assert.deepEqual(await findLogProblems(edited), [{ position: 1, kind: "altered" }]);
    });
});

describe("Using findLogProblems, when an entry is removed", () => {
    test("then it should report the gap at the next entry", async () => {
        assert.deepEqual(await findLogProblems([first, third]), [
            { position: 1, kind: "out-of-sequence" },
            { position: 1, kind: "broken-link" },
        ]);
    });
});

describe("Using findLogProblems, when an entry is rewritten with its hash recomputed", () => {
    test("then it should report the broken link at the entry after it", async () => {
        const rewritten = await appendLogEntry(first, "service-gap", { startsAt: 0 }, second.recordedAt);
        assert.deepEqual(await findLogProblems([first, rewritten, third]), [{ position: 2, kind: "broken-link" }]);
    });
});

describe("Using findLogProblems, when two entries swap places", () => {
    test("then it should report both as out of sequence", async () => {
        const problems = await findLogProblems([first, third, second]);
        const outOfSequence = problems.filter((problem) => problem.kind === "out-of-sequence");
        assert.deepEqual(
            outOfSequence.map((problem) => problem.position),
            [1, 2],
        );
    });
});

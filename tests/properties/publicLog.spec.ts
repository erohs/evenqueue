import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandom } from "#tests/support/functions/createSeededRandom.function.ts";
import { randomWholeNumber } from "#tests/support/functions/randomWholeNumber.function.ts";
import { appendLogEntry } from "#domain/public-log/functions/appendLogEntry.function.ts";
import { checkpointOfLog } from "#domain/public-log/functions/checkpointOfLog.function.ts";
import { doesLogExtendCheckpoint } from "#domain/public-log/functions/doesLogExtendCheckpoint.function.ts";
import { findLogProblems } from "#domain/public-log/functions/findLogProblems.function.ts";
import type { IPublicLogEntry } from "#domain/public-log/interfaces/IPublicLogEntry.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";

const random = createSeededRandom(3);

const randomLog = async (length: number): Promise<IPublicLogEntry[]> => {
    const entries: IPublicLogEntry[] = [];
    let recordedAt = 1_760_000_000_000;
    for (let i = 0; i < length; i++) {
        recordedAt += randomWholeNumber(random, 0, 60_000);
        const body = { sold: randomWholeNumber(random, 0, 100), note: `entry ${i}` };
        entries.push(
            await appendLogEntry(entries.at(-1) ?? null, "unit-counts", body, toEpochMilliseconds(recordedAt)),
        );
    }
    return entries;
};

const entryAt = (log: readonly IPublicLogEntry[], at: number): IPublicLogEntry => log[at] ?? assert.fail();
const tamperings: readonly (readonly [string, (log: IPublicLogEntry[], at: number) => IPublicLogEntry[]])[] = [
    ["an edited body", (log, at) => log.with(at, { ...entryAt(log, at), body: { sold: -1 } })],
    ["an edited time", (log, at) => log.with(at, { ...entryAt(log, at), recordedAt: toEpochMilliseconds(0) })],
    ["a removed entry before the last", (log, at) => log.toSpliced(Math.min(at, log.length - 2), 1)],
    ["a duplicated entry", (log, at) => log.toSpliced(at, 0, entryAt(log, at))],
    [
        "a swapped pair",
        (log, at) => (at > 0 ? log.with(at, entryAt(log, at - 1)).with(at - 1, entryAt(log, at)) : log.toReversed()),
    ],
];

describe("Using findLogProblems, for 30 random logs of 2 to 31 entries", () => {
    for (const [name, tamper] of tamperings) {
        test(`then it should always detect ${name}`, async () => {
            for (let length = 2; length < 32; length++) {
                const log = await randomLog(length);
                assert.deepEqual(await findLogProblems(log), []);
                const tampered = tamper(log, randomWholeNumber(random, 0, length - 1));
                assert.notDeepEqual(await findLogProblems(tampered), [], `${name} in a log of ${length}`);
            }
        });
    }
});

describe("Using the public log, when entries are cut from the end", () => {
    test("then replay alone should not notice, but a checkpoint a buyer saved earlier always should", async () => {
        for (let length = 2; length < 32; length++) {
            const log = await randomLog(length);
            const truncated = log.slice(0, randomWholeNumber(random, 0, length - 1));
            assert.deepEqual(await findLogProblems(truncated), []);
            assert.equal(doesLogExtendCheckpoint(truncated, checkpointOfLog(log)), false);
        }
    });
});

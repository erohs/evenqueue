import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { isPinnedBeaconChain } from "#domain/beacon/functions/isPinnedBeaconChain.function.ts";
import { parseBeaconRound } from "#domain/beacon/functions/parseBeaconRound.function.ts";
import { toBeaconRound } from "#domain/beacon/functions/toBeaconRound.function.ts";
import { parseInclusionProof } from "#domain/commitment/functions/parseInclusionProof.function.ts";
import { parsePublishedLeaves } from "#domain/commitment/functions/parsePublishedLeaves.function.ts";
import { readWaitlistSnapshot } from "#domain/continuity/functions/readWaitlistSnapshot.function.ts";
import { parsePlaceCredentials } from "#domain/credentials/functions/parsePlaceCredentials.function.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { parseLogCheckpoint } from "#domain/public-log/functions/parseLogCheckpoint.function.ts";
import { parsePublicLog } from "#domain/public-log/functions/parsePublicLog.function.ts";
import { parseServiceGap } from "#domain/schedule/functions/parseServiceGap.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { parseWaitlistPlace } from "#domain/waitlist/functions/parseWaitlistPlace.function.ts";

/** What a hostile server, a corrupt backup or a tampered row might hold. An empty list is left out: it is a valid log, proof or list of leaves. */
const junk: readonly unknown[] = [
    null,
    undefined,
    42,
    "text",
    {},
    [null],
    { placeId: "0".repeat(64), drawsEntered: Number.NaN },
    { entryCount: -1, headHash: "0".repeat(64) },
    { current: {}, pendingRecovery: { requestedAt: 0, takesEffectAt: Number.POSITIVE_INFINITY } },
    [{ sequenceNumber: 0, recordedAt: 0, entryType: "\ud800", body: 0.5, previousHash: "", entryHash: "" }],
    [{ publicDrawId: "A".repeat(64), priority: 2 ** 40 }],
    Array.from({ length: 65 }, () => ({ siblingHash: "0".repeat(64), isSiblingOnLeft: false })),
];

const parsers: readonly (readonly [
    string,
    (value: unknown) => ParseResult<unknown> | Promise<ParseResult<unknown>>,
])[] = [
    ["parseWaitlistPlace", parseWaitlistPlace],
    ["parsePlaceCredentials", parsePlaceCredentials],
    ["parseServiceGap", parseServiceGap],
    ["parsePublicLog", parsePublicLog],
    ["parseLogCheckpoint", parseLogCheckpoint],
    ["parsePublishedLeaves", parsePublishedLeaves],
    ["parseInclusionProof", parseInclusionProof],
    ["readWaitlistSnapshot", readWaitlistSnapshot],
];

for (const [name, parse] of parsers) {
    describe(`Using ${name}, when fed junk`, () => {
        test("then it should answer invalid every time and never throw", async () => {
            for (const value of junk) assert.equal((await parse(value)).isValid, false, JSON.stringify(value));
        });
    });
}

describe("Using parseBeaconRound and isPinnedBeaconChain, when an endpoint sends junk", () => {
    test("then they should refuse every body", async () => {
        for (const body of junk) {
            assert.deepEqual(
                [await parseBeaconRound(body, toBeaconRound(1)), isPinnedBeaconChain(body)],
                [null, false],
            );
        }
    });
});

describe("Using readTypedCode, when the input is far longer than any code", () => {
    test("then it should refuse it before doing any work", () => {
        assert.equal(readTypedCode("0".repeat(1_000_000), 16), null);
    });
});

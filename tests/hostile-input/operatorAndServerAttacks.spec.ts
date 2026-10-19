import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { distinctAttesters } from "#domain/commitment/functions/distinctAttesters.function.ts";
import { parsePublicLog } from "#domain/public-log/functions/parsePublicLog.function.ts";
import { readWaitlistSnapshot } from "#domain/continuity/functions/readWaitlistSnapshot.function.ts";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { waitlistSnapshotForTests } from "#tests/support/functions/waitlistSnapshotForTests.function.ts";
import vectors from "#tests/vectors/publicLog.json" with { type: "json" };

describe("Using distinctAttesters, when one party spells its name with invisible or full-width characters", () => {
    test("then it should count the party once", () => {
        assert.deepEqual(
            distinctAttesters(["cloudflare", "cloudflare\u200b", "ｃｌｏｕｄｆｌａｒｅ", " Cloudflare "]),
            ["cloudflare"],
        );
    });
});

describe("Using parsePublicLog, when a hostile server sends a log no honest engine could write", () => {
    test("then it should refuse an unknown entry type", () => {
        const [entry] = vectors.entries;
        assert.equal(parsePublicLog([{ ...entry, entryType: "\ud800" }]).isValid, false);
    });

    test("then it should refuse a log that is not a list", () => {
        assert.equal(parsePublicLog({ length: 1 }).isValid, false);
    });
});

const snapshotWith = (
    change: (snapshot: Record<string, unknown> & { places: Record<string, unknown>[] }) => void,
): unknown => {
    const snapshot = JSON.parse(JSON.stringify(waitlistSnapshotForTests()));
    change(snapshot);
    return snapshot;
};
const credentialsLike = (field: string) => (snapshot: { places: Record<string, unknown>[] }) => {
    const firstCurrent = (snapshot.places[0]?.["credentials"] as { current: Record<string, unknown> }).current;
    snapshot.places[1] = {
        ...snapshot.places[1],
        credentials: {
            current: { ...storedCredentialsForTests("second"), [field]: firstCurrent[field] },
            pendingRecovery: null,
        },
    };
};
const snapshotAttacks: readonly (readonly [string, unknown, string])[] = [
    ["a shared place tag", snapshotWith(credentialsLike("placeTag")), "duplicate placeTag"],
    ["a shared recovery code", snapshotWith(credentialsLike("recoveryCodeCheck")), "duplicate recoveryCodeCheck"],
    [
        "a missing pending recovery",
        snapshotWith((snapshot) => {
            snapshot.places[1] = {
                ...snapshot.places[1],
                credentials: { current: storedCredentialsForTests("second") },
            };
        }),
        "place 1: credentials: pendingRecovery: not an object",
    ],
];

describe("Using readWaitlistSnapshot, when a snapshot has been tampered with", () => {
    for (const [name, tampered, problem] of snapshotAttacks) {
        test(`then it should refuse ${name}`, async () => {
            const result = await readWaitlistSnapshot(tampered);
            assert.ok(!result.isValid && result.problems.includes(problem), JSON.stringify(result));
        });
    }
});

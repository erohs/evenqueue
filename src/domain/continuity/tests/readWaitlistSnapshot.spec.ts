import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { waitlistSnapshotForTests } from "#tests/support/functions/waitlistSnapshotForTests.function.ts";
import { readWaitlistSnapshot } from "../functions/readWaitlistSnapshot.function.ts";

/** Snapshots arrive as JSON from a file or another host, so every case is tampered with as plain data. */
const asJson = (): Record<string, unknown> & {
    places: Record<string, unknown>[];
    publicLog: Record<string, unknown>[];
} => JSON.parse(JSON.stringify(waitlistSnapshotForTests()));
const problemsOf = async (value: unknown): Promise<readonly string[]> => {
    const result = await readWaitlistSnapshot(value);
    return result.isValid ? [] : result.problems;
};

describe("Using readWaitlistSnapshot, when the snapshot went through JSON on its way to a new host", () => {
    test("then it should read it back exactly", async () => {
        assert.deepEqual(await readWaitlistSnapshot(asJson()), { isValid: true, value: waitlistSnapshotForTests() });
    });
});

describe("Using readWaitlistSnapshot, when two places share an entry code", () => {
    test("then it should refuse the snapshot", async () => {
        const snapshot = asJson();
        snapshot.places[1] = { ...snapshot.places[1], credentials: snapshot.places[0]?.["credentials"] };
        assert.ok((await problemsOf(snapshot)).includes("duplicate entrySecretLookup"));
    });
});

describe("Using readWaitlistSnapshot, when a pending recovery would hand one place another's code", () => {
    test("then it should refuse the snapshot", async () => {
        const snapshot = asJson();
        const pendingRecovery = { requestedAt: 1, takesEffectAt: 2, replacement: storedCredentialsForTests("first") };
        snapshot.places[1] = {
            ...snapshot.places[1],
            credentials: { current: storedCredentialsForTests("second"), pendingRecovery },
        };
        assert.ok((await problemsOf(snapshot)).includes("duplicate entrySecretLookup"));
    });
});

describe("Using readWaitlistSnapshot, when a place's counters are corrupt", () => {
    test("then it should name the place and the field", async () => {
        const snapshot = asJson();
        snapshot.places[0] = {
            ...snapshot.places[0],
            place: { ...(snapshot.places[0]?.["place"] as object), offersReceived: "x" },
        };
        assert.deepEqual(await problemsOf(snapshot), ["place 0: place: offersReceived is missing or invalid"]);
    });
});

describe("Using readWaitlistSnapshot, when the public log was edited", () => {
    test("then it should refuse the snapshot", async () => {
        const snapshot = asJson();
        snapshot.publicLog[0] = { ...snapshot.publicLog[0], body: { edited: true } };
        assert.deepEqual(await problemsOf(snapshot), ["the public log is damaged at entry 0"]);
    });
});

describe("Using readWaitlistSnapshot, when the format version or rule is unknown", () => {
    test("then it should name both", async () => {
        const problems = await problemsOf({ ...asJson(), formatVersion: 2, allocationRuleId: "vip-first" });
        assert.deepEqual(problems, ["unknown snapshot format version", "unknown allocation rule"]);
    });
});

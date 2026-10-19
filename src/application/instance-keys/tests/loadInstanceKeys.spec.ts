import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createSeededRandomSource } from "#tests/support/functions/createSeededRandomSource.function.ts";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { createInMemoryKeyStore } from "#adapters/in-memory/functions/createInMemoryKeyStore.function.ts";
import { createWaitlistKeySalt } from "../functions/createWaitlistKeySalt.function.ts";
import { loadInstanceKeys } from "../functions/loadInstanceKeys.function.ts";

const waitlistId = deterministicBytes32Hex("waitlist");

describe("Using loadInstanceKeys, on the first start", () => {
    test("then it should make a 256-bit root key and keep it in the key store", async () => {
        const keyStore = createInMemoryKeyStore();
        await loadInstanceKeys(keyStore, createSeededRandomSource(1));
        assert.equal((await keyStore.readRootKey())?.length, 32);
    });
});

describe("Using loadInstanceKeys, on a later start with the same key store", () => {
    test("then it should derive the same keys, whatever the random source gives", async () => {
        const keyStore = createInMemoryKeyStore();
        const first = await loadInstanceKeys(keyStore, createSeededRandomSource(1));
        const later = await loadInstanceKeys(keyStore, createSeededRandomSource(2));
        assert.deepEqual([later.entryCodesKey, later.formGuardKey], [first.entryCodesKey, first.formGuardKey]);
    });
});

describe("Using loadInstanceKeys, for keys with different purposes", () => {
    test("then it should derive different keys", async () => {
        const keys = await loadInstanceKeys(createInMemoryKeyStore(), createSeededRandomSource(1));
        assert.notDeepEqual(keys.entryCodesKey, keys.formGuardKey);
    });
});

describe("Using loadInstanceKeys, for two waitlists", () => {
    test("then each should get its own key from its own salt", async () => {
        const keyStore = createInMemoryKeyStore();
        const random = createSeededRandomSource(1);
        const otherId = deterministicBytes32Hex("other waitlist");
        await createWaitlistKeySalt(keyStore, random, waitlistId);
        await createWaitlistKeySalt(keyStore, random, otherId);
        const keys = await loadInstanceKeys(keyStore, random);
        assert.notDeepEqual(await keys.waitlistKey(waitlistId), await keys.waitlistKey(otherId));
    });
});

describe("Using loadInstanceKeys, for a waitlist whose salt is missing", () => {
    test("then it should refuse to make up a key", async () => {
        const keys = await loadInstanceKeys(createInMemoryKeyStore(), createSeededRandomSource(1));
        await assert.rejects(keys.waitlistKey(waitlistId), /no key salt/u);
    });
});

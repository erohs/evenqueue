import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { storedCredentialsForTests } from "#tests/support/functions/storedCredentialsForTests.function.ts";
import { createInMemoryPlaceStore } from "#adapters/in-memory/functions/createInMemoryPlaceStore.function.ts";
import type { IPlaceStore } from "#application/ports/interfaces/IPlaceStore.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";

/** Every place store must pass these; step 3 adds the D1 and SQLite stores to the list. */
const placeStores: readonly (readonly [string, () => IPlaceStore])[] = [["in memory", createInMemoryPlaceStore]];

const waitlistId = deterministicBytes32Hex("waitlist");
const otherWaitlistId = deterministicBytes32Hex("other waitlist");
const cap = toCount(2);
const recordFor = (name: string): IPlaceRecord => ({
    place: createWaitlistPlace(deterministicBytes32Hex(`place ${name}`), toCount(0)),
    credentials: { current: storedCredentialsForTests(name), pendingRecovery: null },
});
const first = recordFor("first");
const recovering: IPlaceRecord = {
    ...first,
    credentials: {
        current: first.credentials.current,
        pendingRecovery: {
            requestedAt: toEpochMilliseconds(1),
            takesEffectAt: toEpochMilliseconds(2),
            replacement: storedCredentialsForTests("replacement"),
        },
    },
};

for (const [name, createStore] of placeStores) {
    describe(`Using the ${name} place store, when the same place is added twice`, () => {
        test("then it should keep one and answer already-on-waitlist", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, first, cap);
            assert.equal(await store.addPlace(waitlistId, first, cap), "already-on-waitlist");
        });
    });

    describe(`Using the ${name} place store, when the waitlist is at its cap`, () => {
        test("then it should refuse a new place but still recognise a repeated one", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, first, cap);
            await store.addPlace(waitlistId, recordFor("second"), cap);
            const outcomes = [
                await store.addPlace(waitlistId, recordFor("third"), cap),
                await store.addPlace(waitlistId, first, cap),
            ];
            assert.deepEqual(outcomes, ["waitlist-full", "already-on-waitlist"]);
        });
    });

    describe(`Using the ${name} place store, when two waitlists are kept`, () => {
        test("then a lookup in one should never find a place in the other", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, first, cap);
            const lookup = first.credentials.current.entrySecretLookup;
            assert.equal(await store.findPlaceByEntryCode(otherWaitlistId, lookup), null);
        });
    });

    describe(`Using the ${name} place store, when a recovery is pending`, () => {
        test("then each finder should match the replacement codes as well as the current ones", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, recovering, cap);
            const replacement = storedCredentialsForTests("replacement");
            const found = [
                await store.findPlaceByEntryCode(waitlistId, replacement.entrySecretLookup),
                await store.findPlaceByViewKey(waitlistId, replacement.viewKeyLookup),
                await store.findPlaceByRecoveryCode(waitlistId, replacement.recoveryCodeCheck),
                await store.findPlaceByTypedPhrase(waitlistId, replacement.typedPhraseCheck),
            ];
            assert.deepEqual(found, [recovering, recovering, recovering, recovering]);
        });
    });

    describe(`Using the ${name} place store, when credentials are saved`, () => {
        test("then the place should be found by the saved credentials", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, recovering, cap);
            await store.saveCredentials(waitlistId, first.place.placeId, first.credentials);
            assert.deepEqual(
                await store.findPlaceByEntryCode(waitlistId, first.credentials.current.entrySecretLookup),
                first,
            );
        });
    });

    describe(`Using the ${name} place store, when a place is removed`, () => {
        test("then nothing should find it, and its slot under the cap should be free", async () => {
            const store = createStore();
            await store.addPlace(waitlistId, first, toCount(1));
            await store.removePlace(waitlistId, first.place.placeId);
            assert.equal(await store.addPlace(waitlistId, recordFor("second"), toCount(1)), "added");
        });
    });
}

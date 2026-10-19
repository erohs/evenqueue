import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { deterministicBytes32Hex } from "#tests/support/functions/deterministicBytes32Hex.function.ts";
import { publishedDrawForTests } from "#tests/support/functions/publishedDrawForTests.function.ts";
import { availableAllocationRules } from "#domain/allocation-rules/consts/availableAllocationRules.const.ts";
import { readWaitlistSnapshot } from "#domain/continuity/functions/readWaitlistSnapshot.function.ts";
import { restorePlaceFromPublishedDraw } from "#domain/continuity/functions/restorePlaceFromPublishedDraw.function.ts";
import type { IWaitlistSnapshot } from "#domain/continuity/interfaces/IWaitlistSnapshot.ts";
import { entrySecretLookup } from "#domain/credentials/functions/entrySecretLookup.function.ts";
import { recoveryCodeCheck } from "#domain/credentials/functions/recoveryCodeCheck.function.ts";
import { storedFormOfCredentials } from "#domain/credentials/functions/storedFormOfCredentials.function.ts";
import { toServerKey } from "#domain/credentials/functions/toServerKey.function.ts";
import { viewKeyLookup } from "#domain/credentials/functions/viewKeyLookup.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { toEpochMilliseconds } from "#domain/shared/time/functions/toEpochMilliseconds.function.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";

const draw = await publishedDrawForTests([2, 2, 1, 0]);
const oldSeriesKey = toServerKey(decodeHex(deterministicBytes32Hex("old-series-key")));
const newSeriesKey = toServerKey(decodeHex(deterministicBytes32Hex("new-series-key")));
const storedOnOldHost = await Promise.all(draw.buyers.map((buyer) => storedFormOfCredentials(buyer, oldSeriesKey)));
const snapshot: IWaitlistSnapshot = {
    formatVersion: 1,
    allocationRuleId: "priority-after-losses",
    exportedAt: toEpochMilliseconds(1_760_000_000_000),
    places: storedOnOldHost.map((current, i) => ({
        place: { ...createWaitlistPlace(deterministicBytes32Hex(`place-${i}`), toCount(0)), drawsEntered: toCount(2) },
        credentials: { current, pendingRecovery: null },
    })),
    publicLog: [],
};
const movedSnapshot = await readWaitlistSnapshot(JSON.parse(JSON.stringify(snapshot)));

describe("Using the engine, when a vendor moves to a new host and domain with a snapshot", () => {
    test("then the snapshot should survive the move intact", () => {
        assert.deepEqual(movedSnapshot, { isValid: true, value: snapshot });
    });

    test("then every buyer's existing entry code and view key should still find their place", async () => {
        const places = movedSnapshot.isValid ? movedSnapshot.value.places : assert.fail();
        for (const [i, buyer] of draw.buyers.entries()) {
            const current = places[i]?.credentials.current ?? assert.fail();
            assert.equal(await entrySecretLookup(buyer.entrySecret), current.entrySecretLookup);
            assert.equal(await viewKeyLookup(buyer.viewKey), current.viewKeyLookup);
        }
    });
});

describe("Using the engine, when a vendor loses its keys as well as its host", () => {
    test("then recovery codes should stop matching, which is why the series key needs its own backup", async () => {
        const buyer = draw.buyers[0] ?? assert.fail();
        assert.notEqual(
            await recoveryCodeCheck(newSeriesKey, buyer.recoveryCode),
            storedOnOldHost[0]?.recoveryCodeCheck,
        );
    });
});

describe("Using the engine, when a vendor's site is taken down and the database is lost with no snapshot", () => {
    test("then every buyer should get their place back, with the same priority, from their code", async () => {
        const rule = availableAllocationRules["priority-after-losses"];
        for (const [i, buyer] of draw.buyers.entries()) {
            const result = await restorePlaceFromPublishedDraw({
                entrySecret: buyer.entrySecret,
                drawId: draw.drawId,
                publishedLeaves: draw.leaves,
                recoveriesSinceCommit: [],
                hasDrawRun: false,
                offeredPublicDrawIds: new Set(),
                rule,
                newPlaceId: deterministicBytes32Hex(`rebuilt-${i}`),
            });
            if (result.status !== "restored") return assert.fail(result.status);
            assert.equal(rule.priorityOf(result.place), draw.leaves[i]?.priority);
        }
    });
});

describe("Using the engine, when a vendor's payment provider is pulled mid-drop", () => {
    for (const rule of Object.values(availableAllocationRules)) {
        test(`then ${rule.id} should never leave a buyer worse off for the withdrawn offer`, () => {
            const place = {
                ...createWaitlistPlace(deterministicBytes32Hex("paying"), toCount(0)),
                drawsEntered: toCount(1),
            };
            assert.deepEqual(
                rule.placeAfterDrop(place, "offer-withdrawn", toCount(1)),
                rule.placeAfterDrop(place, "not-offered", toCount(1)),
            );
        });
    }
});

describe("Using the engine, for continuity work in later steps", () => {
    test.todo("step 2: the form token is sent no-store with a fresh nonce, so a cached page cannot share codes");
    test.todo("step 2: a vendor can mark payments unavailable, which pauses offers and logs a public notice");
    test.todo(
        "step 2: lapsed offers are settled with outcomeOfLapsedOffer, so long outages never count against buyers",
    );
    test.todo("step 2: the draw-order log entry lists the offered public draw ids, so restores can hold places back");
    test.todo("step 2: a place restored from a published draw is issued a new recovery code at once");
    test.todo("step 2: applying a recovery appends its published recovery to the log in the same write");
    test.todo(
        "step 2: the commitment time comes from the server clock, and the drop page shows timing unproven plainly",
    );
    test.todo("step 3: every stored row is read back through its parser, never cast");
    test.todo("step 3: beacon endpoints are keyed by URL origin, so one endpoint can never count twice");
    test.todo("step 3: a nightly snapshot can be downloaded by the vendor and holds no codes and no keys");
    test.todo("step 3: a snapshot exported from Workers with D1 imports into Node with SQLite, and back");
    test.todo("step 3: the store refuses a second place with the same entry code, so a code cannot restore twice");
    test.todo("step 3: the series key backup restores recovery codes on a new host");
    test.todo("step 4: the WooCommerce connector re-pairs after a domain change and old signed links stop working");
    test.todo("step 5: the verifier checks halt-attestation signatures before it accepts a void");
    test.todo("step 6: the old domain can show a plain notice of where the waitlist moved, with no code in any URL");
});

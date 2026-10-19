import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import { cancelPlaceRecovery } from "#application/cancel-recovery/functions/cancelPlaceRecovery.function.ts";
import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { joinWaitlist } from "#application/join-waitlist/functions/joinWaitlist.function.ts";
import { requestPlaceRecovery } from "#application/request-recovery/functions/requestPlaceRecovery.function.ts";
import { withdrawPlace } from "#application/withdraw-place/functions/withdrawPlace.function.ts";

/** What a script, a fuzzer or a broken client might put in a form field. */
const hostileFields: readonly unknown[] = [
    undefined,
    null,
    0,
    Number.NaN,
    true,
    {},
    [],
    ["0000-0000"],
    { toString: () => "0000" },
    "",
    " ",
    "\u0000",
    "\ud800",
    "ＡＢＣＤ",
    "0".repeat(26),
    "x".repeat(1_000_000),
    "a.b.c",
    `${"0".repeat(32)}.1760000000000.${"0".repeat(64)}`,
];

const services = await createTestServices();
await joinWaitlistForTests(services);
services.clock.advanceBy(60_000);
const dropId = services.openDrop.dropId;

describe("Using every buyer request, when each field holds hostile values", () => {
    test("then the code requests should find nothing and never throw", async () => {
        for (const typedCode of hostileFields) {
            const outcomes = [
                (await checkStatus(services, { dropId, typedCode })).kind,
                await withdrawPlace(services, { dropId, typedCode }),
                await cancelPlaceRecovery(services, { dropId, typedCode }),
            ];
            assert.deepEqual(outcomes, ["code-not-recognised", "code-not-recognised", "code-not-recognised"]);
        }
    });

    test("then the forms should ask to confirm and never throw", async () => {
        for (const field of hostileFields) {
            const joined = await joinWaitlist(services, { dropId, formToken: field, honeypot: field });
            const recovery = await requestPlaceRecovery(services, {
                dropId,
                formToken: field,
                honeypot: field,
                typedRecoveryCode: field,
            });
            assert.deepEqual([joined.kind, recovery.kind], ["confirm-again", "confirm-again"]);
        }
    });
});

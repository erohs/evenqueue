import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import { withdrawPlace } from "../functions/withdrawPlace.function.ts";

const withdrawn = async () => {
    const services = await createTestServices();
    const typedCode = formatCodeForDisplay((await joinWaitlistForTests(services)).entrySecret);
    const dropId = services.openDrop.dropId;
    const outcome = await withdrawPlace(services, { dropId, typedCode });
    return { outcome, status: await checkStatus(services, { dropId, typedCode }) };
};

describe("Using withdrawPlace, given a buyer on the waitlist, when they withdraw with their entry code", () => {
    test("then it should confirm the withdrawal", async () => {
        assert.equal((await withdrawn()).outcome, "withdrawn");
    });

    test("then their codes should find nothing afterwards", async () => {
        assert.equal((await withdrawn()).status.kind, "code-not-recognised");
    });
});

describe("Using withdrawPlace, given a buyer on the waitlist, when a helper tries with the view key", () => {
    test("then it should refuse, because a view key only reads", async () => {
        const services = await createTestServices();
        const typedCode = formatCodeForDisplay((await joinWaitlistForTests(services)).viewKey);
        assert.equal(
            await withdrawPlace(services, { dropId: services.openDrop.dropId, typedCode }),
            "needs-entry-code",
        );
    });
});

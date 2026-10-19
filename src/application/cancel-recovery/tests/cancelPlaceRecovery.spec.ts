import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import { requestPlaceRecovery } from "#application/request-recovery/functions/requestPlaceRecovery.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import { cancelPlaceRecovery } from "../functions/cancelPlaceRecovery.function.ts";

const hour = 3_600_000;
const withRecoveryRequested = async () => {
    const services = await createTestServices();
    const codes = await joinWaitlistForTests(services);
    const dropId = services.openDrop.dropId;
    const formToken = await issueFormToken(services, "request-recovery", services.openDrop.waitlistId);
    services.clock.advanceBy(5_000);
    const typedRecoveryCode = formatCodeForDisplay(codes.recoveryCode);
    const outcome = await requestPlaceRecovery(services, { dropId, formToken, honeypot: "", typedRecoveryCode });
    const newCodes = outcome.kind === "recovery-requested" ? outcome.codes : assert.fail(outcome.kind);
    return { services, dropId, codes, newCodes };
};

describe("Using cancelPlaceRecovery, given a recovery someone else asked for, when the owner cancels with their entry code", () => {
    test("then the recovery's new codes should never start working", async () => {
        const { services, dropId, codes, newCodes } = await withRecoveryRequested();
        assert.equal(
            await cancelPlaceRecovery(services, { dropId, typedCode: formatCodeForDisplay(codes.entrySecret) }),
            "cancelled",
        );
        services.clock.advanceBy(24 * hour);
        const status = await checkStatus(services, { dropId, typedCode: formatCodeForDisplay(newCodes.entrySecret) });
        assert.equal(status.kind, "code-not-recognised");
    });
});

describe("Using cancelPlaceRecovery, given a recovery requested, when the view key is used to cancel", () => {
    test("then it should refuse, because a view key only reads", async () => {
        const { services, dropId, codes } = await withRecoveryRequested();
        const outcome = await cancelPlaceRecovery(services, { dropId, typedCode: formatCodeForDisplay(codes.viewKey) });
        assert.equal(outcome, "needs-entry-code");
    });
});

describe("Using cancelPlaceRecovery, given a recovery that has already taken effect", () => {
    test("then the old entry code should no longer be recognised", async () => {
        const { services, dropId, codes } = await withRecoveryRequested();
        services.clock.advanceBy(12 * hour);
        const outcome = await cancelPlaceRecovery(services, {
            dropId,
            typedCode: formatCodeForDisplay(codes.entrySecret),
        });
        assert.equal(outcome, "code-not-recognised");
    });
});

describe("Using cancelPlaceRecovery, given no recovery pending", () => {
    test("then it should say there is nothing to cancel", async () => {
        const services = await createTestServices();
        const typedCode = formatCodeForDisplay((await joinWaitlistForTests(services)).entrySecret);
        assert.equal(
            await cancelPlaceRecovery(services, { dropId: services.openDrop.dropId, typedCode }),
            "nothing-to-cancel",
        );
    });
});

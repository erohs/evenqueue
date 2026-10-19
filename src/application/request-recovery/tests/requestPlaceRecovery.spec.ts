import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import type { ITestServices } from "#tests/support/interfaces/ITestServices.ts";
import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import { requestPlaceRecovery } from "../functions/requestPlaceRecovery.function.ts";
import type { IRequestRecoveryRequest } from "../interfaces/IRequestRecoveryRequest.ts";

const hour = 3_600_000;
const recoveryForm = async (services: ITestServices, codes: IIssuedCredentials): Promise<IRequestRecoveryRequest> => {
    const formToken = await issueFormToken(services, "request-recovery", services.openDrop.waitlistId);
    services.clock.advanceBy(5_000);
    return {
        dropId: services.openDrop.dropId,
        formToken,
        honeypot: "",
        typedRecoveryCode: formatCodeForDisplay(codes.recoveryCode),
    };
};
const recovered = async () => {
    const services = await createTestServices();
    const codes = await joinWaitlistForTests(services);
    const outcome = await requestPlaceRecovery(services, await recoveryForm(services, codes));
    const requested = outcome.kind === "recovery-requested" ? outcome : assert.fail(outcome.kind);
    const statusFor = (code: Uint8Array) =>
        checkStatus(services, { dropId: services.openDrop.dropId, typedCode: formatCodeForDisplay(code) });
    return { services, codes, requested, statusFor };
};

describe("Using requestPlaceRecovery, given a buyer with their printed recovery code, when they ask for new codes", () => {
    test("then the new codes should start working twelve hours later", async () => {
        const { services, requested } = await recovered();
        assert.equal(requested.takesEffectAt, services.clock.now() + 12 * hour);
    });

    test("then the old entry code should keep working until then, and show the recovery", async () => {
        const { services, codes, statusFor } = await recovered();
        services.clock.advanceBy(12 * hour - 1);
        const status = await statusFor(codes.entrySecret);
        assert.equal(status.kind === "status" && status.recoveryTakesEffectAt !== null, true);
    });

    test("then the new entry code should not work before then", async () => {
        const { requested, statusFor } = await recovered();
        assert.equal((await statusFor(requested.codes.entrySecret)).kind, "code-not-recognised");
    });
});

describe("Using requestPlaceRecovery, given a recovery requested, once the delay has passed", () => {
    test("then the new entry code should find the place", async () => {
        const { services, requested, statusFor } = await recovered();
        services.clock.advanceBy(12 * hour);
        assert.equal((await statusFor(requested.codes.entrySecret)).kind, "status");
    });

    test("then the old entry code should stop working", async () => {
        const { services, codes, statusFor } = await recovered();
        services.clock.advanceBy(12 * hour);
        assert.equal((await statusFor(codes.entrySecret)).kind, "code-not-recognised");
    });
});

describe("Using requestPlaceRecovery, given a buyer, when the same recovery form is sent twice", () => {
    test("then it should show the same new codes both times", async () => {
        const services = await createTestServices();
        const request = await recoveryForm(services, await joinWaitlistForTests(services));
        const first = await requestPlaceRecovery(services, request);
        assert.deepEqual(await requestPlaceRecovery(services, request), first);
    });
});

describe("Using requestPlaceRecovery, given a buyer, when the recovery code is wrong", () => {
    test("then it should say the code is not recognised", async () => {
        const services = await createTestServices();
        const request = await recoveryForm(services, await joinWaitlistForTests(services));
        const outcome = await requestPlaceRecovery(services, { ...request, typedRecoveryCode: "0000-0000-0000-0000" });
        assert.equal(outcome.kind, "code-not-recognised");
    });
});

describe("Using requestPlaceRecovery, given a buyer, when the entry form's token is sent with the recovery form", () => {
    test("then it should ask to confirm, because each token is for one form", async () => {
        const services = await createTestServices();
        const request = await recoveryForm(services, await joinWaitlistForTests(services));
        const formToken = await issueFormToken(services, "join-waitlist", services.openDrop.waitlistId);
        services.clock.advanceBy(5_000);
        assert.equal((await requestPlaceRecovery(services, { ...request, formToken })).kind, "confirm-again");
    });
});

test.todo("step 3: a recovery takes effect at the next checkpoint when that is later than the delay");

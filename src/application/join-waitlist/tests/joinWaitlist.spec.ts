import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import type { ITestServices } from "#tests/support/interfaces/ITestServices.ts";
import { checkStatus } from "#application/check-status/functions/checkStatus.function.ts";
import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import { requestPlaceRecovery } from "#application/request-recovery/functions/requestPlaceRecovery.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import { toCount } from "#domain/shared/counting/functions/toCount.function.ts";
import { joinWaitlist } from "../functions/joinWaitlist.function.ts";
import type { JoinWaitlistOutcome } from "../types/JoinWaitlistOutcome.type.ts";

const sendForm = async (
    services: ITestServices,
    waitMilliseconds: number,
    honeypot: unknown = "",
): Promise<JoinWaitlistOutcome> => {
    const formToken = await issueFormToken(services, "join-waitlist", services.openDrop.waitlistId);
    services.clock.advanceBy(waitMilliseconds);
    return joinWaitlist(services, { dropId: services.openDrop.dropId, formToken, honeypot });
};

describe("Using joinWaitlist, given a buyer whose codes a recovery has replaced, when they resend their old entry form", () => {
    test("then it should neither show the replaced codes nor add a second place", async () => {
        const services = await createTestServices();
        const formToken = await issueFormToken(services, "join-waitlist", services.openDrop.waitlistId);
        services.clock.advanceBy(5_000);
        const request = { dropId: services.openDrop.dropId, formToken, honeypot: "" };
        const joined = await joinWaitlist(services, request);
        const codes = joined.kind === "joined" ? joined.codes : assert.fail(joined.kind);
        const recoveryToken = await issueFormToken(services, "request-recovery", services.openDrop.waitlistId);
        services.clock.advanceBy(5_000);
        const typedRecoveryCode = formatCodeForDisplay(codes.recoveryCode);
        await requestPlaceRecovery(services, { ...request, formToken: recoveryToken, typedRecoveryCode });
        services.clock.advanceBy(12 * 3_600_000);
        assert.equal((await joinWaitlist(services, request)).kind, "codes-already-replaced");
    });
});

describe("Using joinWaitlist, given an open drop, when a buyer sends the entry form", () => {
    test("then their entry code should find their place", async () => {
        const services = await createTestServices();
        const codes = await joinWaitlistForTests(services);
        const typedCode = formatCodeForDisplay(codes.entrySecret);
        const status = await checkStatus(services, { dropId: services.openDrop.dropId, typedCode });
        assert.equal(status.kind, "status");
    });

    test("then the place should take the drop's entry window number", async () => {
        const services = await createTestServices();
        const typedCode = formatCodeForDisplay((await joinWaitlistForTests(services)).viewKey);
        const status = await checkStatus(services, { dropId: services.openDrop.dropId, typedCode });
        assert.equal(status.kind === "status" && status.place.entryWindowNumber, services.openDrop.entryWindowNumber);
    });
});

describe("Using joinWaitlist, given an open drop, when the same form is sent twice", () => {
    test("then it should show the same codes and add only one place", async () => {
        const services = await createTestServices({ entrantCap: toCount(1) });
        const formToken = await issueFormToken(services, "join-waitlist", services.openDrop.waitlistId);
        services.clock.advanceBy(5_000);
        const request = { dropId: services.openDrop.dropId, formToken, honeypot: "" };
        const [first, retried] = [await joinWaitlist(services, request), await joinWaitlist(services, request)];
        assert.deepEqual(retried, first);
    });
});

describe("Using joinWaitlist, given an open drop, when the form comes back within three seconds", () => {
    test("then it should ask the buyer to confirm rather than turn them away", async () => {
        const services = await createTestServices();
        const outcome = await sendForm(services, 1_000);
        assert.deepEqual(
            [outcome.kind, outcome.kind === "confirm-again" && outcome.reason],
            ["confirm-again", "too-quick"],
        );
    });
});

describe("Using joinWaitlist, given an open drop, when the hidden field has been filled in", () => {
    test("then it should ask the buyer to confirm", async () => {
        const services = await createTestServices();
        const outcome = await sendForm(services, 5_000, "https://spam.example");
        assert.equal(outcome.kind === "confirm-again" && outcome.reason, "honeypot-filled");
    });
});

describe("Using joinWaitlist, given an open drop, when a plain form from the vendor's site arrives with no token", () => {
    test("then it should ask the buyer to confirm on the drop's own form", async () => {
        const services = await createTestServices();
        const outcome = await joinWaitlist(services, {
            dropId: services.openDrop.dropId,
            formToken: undefined,
            honeypot: undefined,
        });
        assert.equal(outcome.kind === "confirm-again" && outcome.reason, "not-genuine");
    });
});

describe("Using joinWaitlist, given a drop that is still a draft", () => {
    test("then it should treat it as not found, because buyers never see a draft", async () => {
        const services = await createTestServices();
        const formToken = await issueFormToken(services, "join-waitlist", services.draftDrop.waitlistId);
        services.clock.advanceBy(5_000);
        const outcome = await joinWaitlist(services, { dropId: services.draftDrop.dropId, formToken, honeypot: "" });
        assert.equal(outcome.kind, "drop-not-found");
    });
});

describe("Using joinWaitlist, given an open drop, when the form is sent after the entry window", () => {
    test("then it should say entry is closed", async () => {
        const services = await createTestServices();
        assert.equal((await sendForm(services, 73 * 3_600_000)).kind, "entry-closed");
    });
});

describe("Using joinWaitlist, given a waitlist at its entrant cap", () => {
    test("then it should say the waitlist is full", async () => {
        const services = await createTestServices({ entrantCap: toCount(1) });
        await joinWaitlistForTests(services);
        assert.equal((await sendForm(services, 5_000)).kind, "waitlist-full");
    });
});

describe("Using joinWaitlist, for a drop that does not exist", () => {
    test("then it should say so", async () => {
        const services = await createTestServices();
        const outcome = await joinWaitlist(services, {
            dropId: services.openDrop.waitlistId,
            formToken: "",
            honeypot: "",
        });
        assert.equal(outcome.kind, "drop-not-found");
    });
});

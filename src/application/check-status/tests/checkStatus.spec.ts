import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { joinWaitlistForTests } from "#tests/support/functions/joinWaitlistForTests.function.ts";
import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import { checkStatus } from "../functions/checkStatus.function.ts";

const services = await createTestServices();
const codes = await joinWaitlistForTests(services);
const dropId = services.openDrop.dropId;
const statusFor = (typedCode: unknown) => checkStatus(services, { dropId, typedCode });

describe("Using checkStatus, given a buyer on the waitlist, when they type their entry code", () => {
    test("then it should show their status with full access", async () => {
        const status = await statusFor(formatCodeForDisplay(codes.entrySecret));
        assert.equal(status.kind === "status" && status.access, "entry-code");
    });
});

describe("Using checkStatus, given a buyer on the waitlist, when a helper types the view key", () => {
    test("then it should show the status read-only", async () => {
        const status = await statusFor(formatCodeForDisplay(codes.viewKey));
        assert.equal(status.kind === "status" && status.access, "view-key");
    });
});

describe("Using checkStatus, given a buyer on the waitlist, when the code is typed loosely", () => {
    test("then it should accept lower case, spaces and look-alike letters", async () => {
        const loose = formatCodeForDisplay(codes.entrySecret).toLowerCase().replaceAll("-", " ").replaceAll("0", "o");
        assert.equal((await statusFor(` ${loose} `)).kind, "status");
    });
});

describe("Using checkStatus, given a buyer on the waitlist, when the code is wrong", () => {
    test("then it should say the code is not recognised", async () => {
        assert.equal((await statusFor("0000-0000-0000-0000-0000-0000-00")).kind, "code-not-recognised");
    });
});

describe("Using checkStatus, given a buyer on the waitlist, when the recovery code is typed instead", () => {
    test("then it should not let it read the status", async () => {
        assert.equal((await statusFor(formatCodeForDisplay(codes.recoveryCode))).kind, "code-not-recognised");
    });
});

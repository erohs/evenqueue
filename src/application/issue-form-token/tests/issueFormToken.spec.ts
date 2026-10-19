import assert from "node:assert/strict";
import { describe, test } from "node:test";
import { createTestServices } from "#tests/support/functions/createTestServices.function.ts";
import { issueFormToken } from "../functions/issueFormToken.function.ts";

describe("Using issueFormToken, when the same form is served twice", () => {
    test("then each copy should carry its own token, so two buyers never share codes", async () => {
        const services = await createTestServices();
        const waitlistId = services.openDrop.waitlistId;
        assert.notEqual(
            await issueFormToken(services, "join-waitlist", waitlistId),
            await issueFormToken(services, "join-waitlist", waitlistId),
        );
    });
});

import assert from "node:assert/strict";
import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import { joinWaitlist } from "#application/join-waitlist/functions/joinWaitlist.function.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import type { ITestServices } from "../interfaces/ITestServices.ts";

/** Serves the entry form, waits as long as a person would, sends it, and returns the codes shown. */
export const joinWaitlistForTests = async (services: ITestServices): Promise<IIssuedCredentials> => {
    const formToken = await issueFormToken(services, "join-waitlist", services.openDrop.waitlistId);
    services.clock.advanceBy(5_000);
    const outcome = await joinWaitlist(services, { dropId: services.openDrop.dropId, formToken, honeypot: "" });
    return outcome.kind === "joined" ? outcome.codes : assert.fail(`expected to join, got ${outcome.kind}`);
};

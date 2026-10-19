import { issueFormToken } from "#application/issue-form-token/functions/issueFormToken.function.ts";
import type { JoinWaitlistOutcome } from "#application/join-waitlist/types/JoinWaitlistOutcome.type.ts";
import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderConfirmJoinPage } from "#web/views/functions/renderConfirmJoinPage.function.ts";

/** A fresh form to press again; the reason is not shown, so a script learns nothing from it. */
export const confirmJoinResponse = async (
    services: IApplicationServices,
    { drop, waitlist }: Extract<JoinWaitlistOutcome, { kind: "confirm-again" }>,
): Promise<Response> => {
    const formToken = await issueFormToken(services, "join-waitlist", waitlist.waitlistId);
    const page = renderConfirmJoinPage(drop.dropId, waitlist.label, formToken);
    return pageResponse(page, { embedOrigins: drop.settings.embedOrigins });
};

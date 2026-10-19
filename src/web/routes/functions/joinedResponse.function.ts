import type { JoinWaitlistOutcome } from "#application/join-waitlist/types/JoinWaitlistOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderCodesPage } from "#web/views/functions/renderCodesPage.function.ts";
import { codesForDisplay } from "./codesForDisplay.function.ts";

/** Framable like the drop page, because a form shown in a vendor's frame lands here. */
export const joinedResponse = ({ codes, drop, waitlist }: Extract<JoinWaitlistOutcome, { kind: "joined" }>): Response =>
    pageResponse(
        renderCodesPage({
            dropId: drop.dropId,
            waitlistLabel: waitlist.label,
            heading: "You're on the waitlist",
            introduction: html`<p>Your place is saved. These codes are the only link to it.</p>`,
            codes: codesForDisplay(codes),
        }),
        { embedOrigins: drop.settings.embedOrigins },
    );

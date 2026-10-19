import type { CheckStatusOutcome } from "#application/check-status/types/CheckStatusOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderCodeActionForm } from "./renderCodeActionForm.function.ts";
import { renderDocument } from "./renderDocument.function.ts";
import { renderPendingRecovery } from "./renderPendingRecovery.function.ts";
import { renderPlaceSummary } from "./renderPlaceSummary.function.ts";

/** Nothing on it identifies the buyer. A view key sees the same page without the buttons that change the place. */
export const renderStatusPage = (
    status: Extract<CheckStatusOutcome, { kind: "status" }>,
    typedCode: string,
): ISafeHtml => {
    const { drop, waitlist } = status;
    const isEntryCode = status.access === "entry-code";
    return renderDocument({
        title: "Your place",
        waitlistLabel: waitlist.label,
        main: html`<h1>Your place</h1>
            <p>You're on the waitlist for ${waitlist.label}.</p>
            ${!isEntryCode && html`<p class="notice">You're using the view key. It can check this place, but can't take up an offer or leave.</p>`}
            ${renderPendingRecovery(status, typedCode)} ${renderPlaceSummary(status)}
            ${
                isEntryCode &&
                html`<h2>Leave the waitlist</h2>
                    ${renderCodeActionForm(dropPath(drop.dropId, "/leave"), typedCode, "Leave the waitlist")}`
            }
            <form method="post" action="${dropPath(drop.dropId, "/finish")}" class="stack">
                <button type="submit" class="button">Finish</button>
            </form>`,
    });
};

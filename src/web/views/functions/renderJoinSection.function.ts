import type { ShowDropOutcome } from "#application/show-drop/types/ShowDropOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { renderJoinForm } from "./renderJoinForm.function.ts";
import { renderTime } from "./renderTime.function.ts";

export const renderJoinSection = (shown: Extract<ShowDropOutcome, { kind: "drop" }>): ISafeHtml => {
    if (shown.joinFormToken === null) {
        return html`<section aria-labelledby="join-heading" class="panel">
            <h2 id="join-heading">Joining is closed</h2>
            <p>New places can't be added to this drop. Anyone already on the waitlist keeps their place.</p>
        </section>`;
    }
    return html`<section aria-labelledby="join-heading" class="panel">
        <h2 id="join-heading">Join the waitlist</h2>
        <p>You don't need to give your name, e-mail address or phone number. You'll get codes to keep instead.</p>
        ${shown.entryClosesAt !== null && html`<p>Joining closes ${renderTime(shown.entryClosesAt)}. Joining early gives no advantage.</p>`}
        ${renderJoinForm(shown.drop.dropId, shown.joinFormToken, "Join the waitlist")}
    </section>`;
};

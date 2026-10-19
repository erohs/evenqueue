import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { renderDocument } from "./renderDocument.function.ts";
import { renderJoinForm } from "./renderJoinForm.function.ts";

/** Shown when a form came back too fast, too late, from another site or with the hidden field filled. */
export const renderConfirmJoinPage = (dropId: Bytes32Hex, waitlistLabel: string, formToken: string): ISafeHtml =>
    renderDocument({
        title: "Confirm you want to join",
        waitlistLabel,
        main: html`<h1>Confirm you want to join</h1>
            <p>Please press the button to join the waitlist for ${waitlistLabel}. You haven't joined yet.</p>
            ${renderJoinForm(dropId, formToken, "Yes, join the waitlist")}`,
    });

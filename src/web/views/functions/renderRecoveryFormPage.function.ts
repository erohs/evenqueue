import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { IRecoveryFormPage } from "../interfaces/IRecoveryFormPage.ts";
import { renderDocument } from "./renderDocument.function.ts";
import { renderRecoveryForm } from "./renderRecoveryForm.function.ts";

export const renderRecoveryFormPage = (page: IRecoveryFormPage): ISafeHtml =>
    renderDocument({
        title: page.error === null ? "Replace a lost entry code" : "Error: replace a lost entry code",
        waitlistLabel: page.waitlistLabel,
        main: html`<h1>Replace a lost entry code</h1>
            <p>
                Type the recovery code you kept when you joined. You'll get new codes for the same place. They start
                working after 12 hours, and until then your old entry code still works.
            </p>
            <p>
                Whoever holds the old entry code can cancel the change in that time, so a stolen recovery code can't
                quietly take your place.
            </p>
            ${page.shouldAskToConfirm && html`<p class="notice">Please check the code and press the button again.</p>`}
            ${renderRecoveryForm(page)}`,
    });

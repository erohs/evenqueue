import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodesPage } from "../interfaces/ICodesPage.ts";
import { renderCodeCards } from "./renderCodeCards.function.ts";
import { renderDocument } from "./renderDocument.function.ts";
import { renderSaveCodesForms } from "./renderSaveCodesForms.function.ts";

/** Codes are shown once and never stored, so this page says plainly that they cannot be shown again. */
export const renderCodesPage = (page: ICodesPage): ISafeHtml =>
    renderDocument({
        title: page.heading,
        waitlistLabel: page.waitlistLabel,
        main: html`<h1>${page.heading}</h1>
            ${page.introduction}
            <p class="notice">
                Save these codes now. They are shown only once, and nobody can look them up for you later.
            </p>
            ${renderCodeCards(page.codes)}
            <h2>Ways to keep them</h2>
            <ul>
                <li>Print this page, or save it as a PDF.</li>
                <li>
                    Write them down. Letters and numbers that look alike are read the same, so small slips don't matter.
                </li>
                <li>Save the entry code in a password manager, or scan its QR code with your phone.</li>
            </ul>
            <p>On a shared or public computer, don't let the browser save them, and finish when you're done.</p>
            ${renderSaveCodesForms(page.dropId, page.waitlistLabel, page.codes.entryCode)}`,
    });

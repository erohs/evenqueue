import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodesPage } from "../interfaces/ICodesPage.ts";
import { renderCodeCard } from "./renderCodeCard.function.ts";
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
            <dl class="codes">
                ${renderCodeCard("Entry code", page.codes.entryCode, "Checks your place, takes up an offer and lets you leave. Keep it private.")}
                ${renderCodeCard("View key", page.codes.viewKey, "Only checks your place. Give this one to anyone helping you.")}
                ${renderCodeCard("Recovery code", page.codes.recoveryCode, "Replaces a lost entry code, after a delay. Print it or write it down, and keep it safe.")}
            </dl>
            <h2>Ways to keep them</h2>
            <ul>
                <li>Print this page, or save it as a PDF.</li>
                <li>
                    Write them down. Letters and numbers that look alike are read the same, so small slips don't matter.
                </li>
                <li>Save the entry code in a password manager.</li>
            </ul>
            <p>On a shared or public computer, don't let the browser save them, and finish when you're done.</p>
            ${renderSaveCodesForms(page.dropId, page.waitlistLabel, page.codes.entryCode)}`,
    });

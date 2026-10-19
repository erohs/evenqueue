import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodeFormPage } from "../interfaces/ICodeFormPage.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderCodeField } from "./renderCodeField.function.ts";
import { renderDocument } from "./renderDocument.function.ts";

export const renderStatusFormPage = (page: ICodeFormPage): ISafeHtml =>
    renderDocument({
        title: page.error === null ? "Check your place" : "Error: check your place",
        waitlistLabel: page.waitlistLabel,
        main: html`<h1>Check your place</h1>
            <form method="post" action="${dropPath(page.dropId, "/status")}" class="stack">
                <input type="text" name="waitlist" value="${page.waitlistLabel}" autocomplete="username" hidden />
                ${renderCodeField({
                    name: "code",
                    label: "Entry code, phrase or view key",
                    hint: "The 26 letters and numbers, or the seven words. Spaces, dashes and capitals don't matter.",
                    error: page.error,
                    typed: page.typed,
                    autocomplete: "current-password",
                })}
                <button type="submit" class="button">Check my place</button>
            </form>
            <p><a href="${dropPath(page.dropId, "/recover")}">Lost your entry code?</a></p>`,
    });

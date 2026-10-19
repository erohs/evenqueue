import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { IRecoveryFormPage } from "../interfaces/IRecoveryFormPage.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderCodeField } from "./renderCodeField.function.ts";
import { renderGuardFields } from "./renderGuardFields.function.ts";

export const renderRecoveryForm = (page: IRecoveryFormPage): ISafeHtml =>
    html`<form method="post" action="${dropPath(page.dropId, "/recover")}" class="stack">
        ${renderGuardFields(page.formToken)}
        ${renderCodeField({
            name: "recoveryCode",
            label: "Recovery code",
            hint: "16 letters and numbers. Spaces, dashes and capitals don't matter.",
            error: page.error,
            typed: page.typed,
            autocomplete: null,
        })}
        <button type="submit" class="button">Get new codes</button>
    </form>`;

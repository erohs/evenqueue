import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodeFieldOptions } from "../interfaces/ICodeFieldOptions.ts";

/**
 * Pasting and password managers always work (WCAG 2.2 SC 3.3.8), and case, spaces, dashes and look-alike letters do
 * not matter, so nobody has to copy a code character by character.
 */
export const renderCodeField = (field: ICodeFieldOptions): ISafeHtml => {
    const describedBy = field.error === null ? `${field.name}-hint` : `${field.name}-hint ${field.name}-error`;
    return html`<div class="field">
        <label for="${field.name}">${field.label}</label>
        <p id="${field.name}-hint" class="field-hint">${field.hint}</p>
        ${field.error !== null && html`<p id="${field.name}-error" class="field-error">${field.error}</p>`}
        <input
            id="${field.name}"
            name="${field.name}"
            type="text"
            class="code-input"
            required
            spellcheck="false"
            autocapitalize="characters"
            autocorrect="off"
            ${field.autocomplete === null ? "" : html` autocomplete="${field.autocomplete}"`}
            aria-describedby="${describedBy}"
            ${field.error === null ? "" : html` aria-invalid="true"`}
            value="${field.typed}" />
    </div>`;
};

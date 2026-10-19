import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";

/**
 * A button that sends the code the buyer already typed, in the form body, so they need not type it again. The page
 * carrying it is never cached.
 */
export const renderCodeActionForm = (
    action: string,
    typedCode: string,
    buttonText: string,
    extraField = "",
): ISafeHtml =>
    html`<form method="post" action="${action}" class="stack">
        <input type="hidden" name="code" value="${typedCode}" />
        ${extraField !== "" && html`<input type="hidden" name="${extraField}" value="yes" />`}
        <button type="submit" class="button button--secondary">${buttonText}</button>
    </form>`;

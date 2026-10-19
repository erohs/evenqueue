import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { honeypotFieldName } from "../consts/honeypotFieldName.const.ts";

/**
 * The signed token and the hidden field. The field is hidden by the stylesheet, which also hides it from screen
 * readers; without styles its label tells people to leave it empty.
 */
export const renderGuardFields = (formToken: string): ISafeHtml =>
    html`<input type="hidden" name="formToken" value="${formToken}" />
        <div class="trap-field">
            <label for="${honeypotFieldName}">Leave this field empty</label>
            <input id="${honeypotFieldName}" name="${honeypotFieldName}" type="text" tabindex="-1" autocomplete="off" />
        </div>`;

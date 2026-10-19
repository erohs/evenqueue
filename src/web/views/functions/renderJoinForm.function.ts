import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderGuardFields } from "./renderGuardFields.function.ts";

/** One button and nothing to fill in: joining asks for no detail about the buyer at all. */
export const renderJoinForm = (dropId: Bytes32Hex, formToken: string, buttonText: string): ISafeHtml =>
    html`<form method="post" action="${dropPath(dropId, "/enter")}" class="stack">
        ${renderGuardFields(formToken)}
        <button type="submit" class="button">${buttonText}</button>
    </form>`;

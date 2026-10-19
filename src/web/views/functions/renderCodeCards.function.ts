import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { codeCardDescriptions } from "../consts/codeCardDescriptions.const.ts";
import type { ICodesForDisplay } from "../interfaces/ICodesForDisplay.ts";
import { renderCodeCard } from "./renderCodeCard.function.ts";

export const renderCodeCards = (codes: ICodesForDisplay): ISafeHtml =>
    html`<dl class="codes">
        ${codeCardDescriptions.map((description) => renderCodeCard({ ...description, code: codes[description.codeShown] }))}
    </dl>`;

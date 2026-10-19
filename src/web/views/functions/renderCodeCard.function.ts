import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { ICodeCard } from "../interfaces/ICodeCard.ts";
import { renderQrCode } from "./renderQrCode.function.ts";

export const renderCodeCard = (card: ICodeCard): ISafeHtml =>
    html`<div class="code-card">
        <dt>${card.name}</dt>
        <dd><code class="${card.isWords ? "code code--words" : "code"}">${card.code}</code></dd>
        <dd class="code-purpose">${card.purpose}</dd>
        ${card.hasQrCode && html`<dd>${renderQrCode(card.code, card.name)}</dd>`}
    </div>`;

import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";

export const renderCodeCard = (name: string, code: string, purpose: string): ISafeHtml =>
    html`<div class="code-card">
        <dt>${name}</dt>
        <dd><code class="code">${code}</code></dd>
        <dd class="code-purpose">${purpose}</dd>
    </div>`;

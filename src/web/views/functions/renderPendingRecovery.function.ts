import type { CheckStatusOutcome } from "#application/check-status/types/CheckStatusOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderCodeActionForm } from "./renderCodeActionForm.function.ts";
import { renderTime } from "./renderTime.function.ts";

/** The old code's holder sees a pending recovery and can stop it, so a stolen recovery code cannot quietly take a place. */
export const renderPendingRecovery = (
    status: Extract<CheckStatusOutcome, { kind: "status" }>,
    typedCode: string,
): ISafeHtml => {
    if (status.recoveryTakesEffectAt === null) return html``;
    return html`<section aria-labelledby="recovery-heading" class="panel panel--warning">
        <h2 id="recovery-heading">New codes were requested for this place</h2>
        <p>
            They start working ${renderTime(status.recoveryTakesEffectAt)}, and this entry code stops working then. If
            you didn't ask for new codes, cancel them now.
        </p>
        ${status.access === "entry-code" && renderCodeActionForm(dropPath(status.drop.dropId, "/recover/cancel"), typedCode, "Cancel the new codes")}
    </section>`;
};

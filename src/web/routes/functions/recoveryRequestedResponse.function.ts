import type { RequestRecoveryOutcome } from "#application/request-recovery/types/RequestRecoveryOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderCodesPage } from "#web/views/functions/renderCodesPage.function.ts";
import { renderTime } from "#web/views/functions/renderTime.function.ts";
import { codesForDisplay } from "./codesForDisplay.function.ts";

export const recoveryRequestedResponse = (
    requested: Extract<RequestRecoveryOutcome, { kind: "recovery-requested" }>,
): Response =>
    pageResponse(
        renderCodesPage({
            dropId: requested.drop.dropId,
            waitlistLabel: requested.waitlist.label,
            heading: "Your new codes",
            introduction: html`<p>
                These start working ${renderTime(requested.takesEffectAt)}. Until then your old entry code still works,
                and whoever holds it can cancel the change.
            </p>`,
            codes: codesForDisplay(requested.codes),
        }),
    );

import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderCodeActionForm } from "./renderCodeActionForm.function.ts";
import { renderDocument } from "./renderDocument.function.ts";

export const renderLeaveConfirmPage = (dropId: Bytes32Hex, waitlistLabel: string, typedCode: string): ISafeHtml =>
    renderDocument({
        title: "Leave the waitlist?",
        waitlistLabel,
        main: html`<h1>Leave the waitlist?</h1>
            <p>
                Your place is deleted straight away and can't be restored. Your codes stop working. You could join again
                later, as a new place.
            </p>
            ${renderCodeActionForm(dropPath(dropId, "/leave"), typedCode, "Yes, leave the waitlist", "confirm")}
            <p><a href="${dropPath(dropId)}">Keep my place</a></p>`,
    });

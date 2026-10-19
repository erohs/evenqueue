import type { CheckStatusOutcome } from "#application/check-status/types/CheckStatusOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { renderTime } from "./renderTime.function.ts";

/** The place's own counts and what comes next; offers join this in the redemption step. */
export const renderPlaceSummary = ({
    place,
    drop,
    entryClosesAt,
}: Extract<CheckStatusOutcome, { kind: "status" }>): ISafeHtml =>
    html`<dl class="facts">
            <div>
                <dt>Drops entered</dt>
                <dd>${place.drawsEntered}</dd>
            </div>
            <div>
                <dt>Offers received</dt>
                <dd>${place.offersReceived}</dd>
            </div>
        </dl>
        <h2>What happens next</h2>
        ${
            entryClosesAt !== null && drop.state === "open"
                ? html`<p>
                      Joining closes ${renderTime(entryClosesAt)}. Then the order is fixed in public, and offers appear
                      on this page.
                  </p>`
                : html`<p>Any offer for you will appear on this page. Check back at the times the vendor announces.</p>`
        }`;

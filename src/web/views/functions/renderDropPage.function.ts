import type { ShowDropOutcome } from "#application/show-drop/types/ShowDropOutcome.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { allocationRuleExplanations } from "../consts/allocationRuleExplanations.const.ts";
import { renderDocument } from "./renderDocument.function.ts";
import { renderDropGuidance } from "./renderDropGuidance.function.ts";
import { renderJoinSection } from "./renderJoinSection.function.ts";
import { renderParagraphs } from "./renderParagraphs.function.ts";

export const renderDropPage = (shown: Extract<ShowDropOutcome, { kind: "drop" }>): ISafeHtml =>
    renderDocument({
        title: "Waitlist",
        waitlistLabel: shown.waitlist.label,
        main: html`<h1>${shown.waitlist.label}</h1>
            ${renderParagraphs(shown.drop.settings.pageText)} ${renderJoinSection(shown)}
            <section aria-labelledby="how-heading">
                <h2 id="how-heading">How places are offered</h2>
                <p>${allocationRuleExplanations[shown.waitlist.allocationRuleId]}</p>
                <p>Being quick makes no difference, so there's nothing to gain by refreshing or using tools.</p>
            </section>
            ${renderDropGuidance(shown.drop.dropId)}`,
    });

import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { IMessagePage } from "../interfaces/IMessagePage.ts";
import { dropPath } from "./dropPath.function.ts";
import { renderDocument } from "./renderDocument.function.ts";

export const renderMessagePage = (page: IMessagePage): ISafeHtml =>
    renderDocument({
        title: page.heading,
        waitlistLabel: page.waitlistLabel,
        main: html`<h1>${page.heading}</h1>
            ${page.message}
            ${page.dropId !== null && html`<p><a href="${dropPath(page.dropId)}">Back to the waitlist page</a></p>`}`,
    });

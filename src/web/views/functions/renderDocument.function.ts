import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import type { IDocumentOptions } from "../interfaces/IDocumentOptions.ts";

/** Every buyer page: one main landmark, no script, and the stylesheets served beside the pages. */
export const renderDocument = ({ title, waitlistLabel, main }: IDocumentOptions): ISafeHtml =>
    html`<!doctype html>
        <html lang="en">
            <head>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <meta name="color-scheme" content="light dark" />
                <meta name="robots" content="noindex" />
                <title>${waitlistLabel === null ? title : `${title} – ${waitlistLabel}`}</title>
                <link rel="stylesheet" href="/styles/tokens.css" />
                <link rel="stylesheet" href="/styles/buyer.css" />
            </head>
            <body>
                <a class="skip-link" href="#main">Skip to content</a>
                <main id="main" class="page">${main}</main>
                <footer class="page-footer">
                    <p>This waitlist never asks for your name, e-mail address, phone number or home address.</p>
                </footer>
            </body>
        </html> `;

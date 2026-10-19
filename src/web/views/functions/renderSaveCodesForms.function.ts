import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";

/**
 * Checking the place right away also lets a password manager offer to save the entry code, with the waitlist's label as
 * the user name. Finishing asks the browser to forget its cached copies of this page.
 */
export const renderSaveCodesForms = (dropId: Bytes32Hex, waitlistLabel: string, entryCode: string): ISafeHtml =>
    html`<form method="post" action="${dropPath(dropId, "/status")}" class="stack">
            <input type="text" name="waitlist" value="${waitlistLabel}" autocomplete="username" hidden />
            <input type="password" name="code" value="${entryCode}" autocomplete="current-password" hidden />
            <button type="submit" class="button button--secondary">Check my place now</button>
        </form>
        <form method="post" action="${dropPath(dropId, "/finish")}" class="stack">
            <button type="submit" class="button">I've saved my codes</button>
        </form>`;

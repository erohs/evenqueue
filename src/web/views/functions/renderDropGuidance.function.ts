import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { ISafeHtml } from "#web/html/interfaces/ISafeHtml.ts";
import { dropPath } from "./dropPath.function.ts";

export const renderDropGuidance = (dropId: Bytes32Hex): ISafeHtml =>
    html`<section aria-labelledby="joined-heading">
            <h2 id="joined-heading">Already joined?</h2>
            <ul>
                <li><a href="${dropPath(dropId, "/status")}">Check your place</a> with your entry code or view key.</li>
                <li><a href="${dropPath(dropId, "/recover")}">Lost your entry code?</a> Use your recovery code.</li>
            </ul>
        </section>
        <section aria-labelledby="private-heading">
            <h2 id="private-heading">Keeping this private</h2>
            <p>
                Your codes are the only link to your place. Keep them somewhere private. If someone helps you, give them
                the view key: it can check your place but can't do anything else.
            </p>
        </section>`;

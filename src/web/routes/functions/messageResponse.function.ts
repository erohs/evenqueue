import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { html } from "#web/html/functions/html.function.ts";
import type { IPageResponseOptions } from "#web/http/interfaces/IPageResponseOptions.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderMessagePage } from "#web/views/functions/renderMessagePage.function.ts";

/** A short page with a heading and one paragraph. */
export const messageResponse = (
    heading: string,
    message: string,
    dropId: Bytes32Hex | null,
    options: IPageResponseOptions = {},
): Response =>
    pageResponse(
        renderMessagePage({ heading, message: html`<p>${message}</p>`, waitlistLabel: null, dropId }),
        options,
    );

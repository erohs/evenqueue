import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderStatusFormPage } from "#web/views/functions/renderStatusFormPage.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";

/** The status form again, with what was typed and a message linked to the field. */
export const codeNotRecognisedResponse = async (
    services: IApplicationServices,
    dropId: Bytes32Hex,
    typed: string,
): Promise<Response> => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return commonResponses.notFound();
    const error = "That code isn't recognised for this waitlist. Check it and try again.";
    const page = renderStatusFormPage({ dropId, waitlistLabel: found.waitlist.label, typed, error });
    return pageResponse(page, { status: 422 });
};

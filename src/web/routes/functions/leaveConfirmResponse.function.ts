import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { findDropWithWaitlist } from "#application/shared/place-lookup/functions/findDropWithWaitlist.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderLeaveConfirmPage } from "#web/views/functions/renderLeaveConfirmPage.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";

export const leaveConfirmResponse = async (
    services: IApplicationServices,
    dropId: Bytes32Hex,
    typedCode: string,
): Promise<Response> => {
    const found = await findDropWithWaitlist(services, dropId);
    if (found === null) return commonResponses.notFound();
    return pageResponse(renderLeaveConfirmPage(dropId, found.waitlist.label, typedCode));
};

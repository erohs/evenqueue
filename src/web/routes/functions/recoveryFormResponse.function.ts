import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { showRecoveryForm } from "#application/show-recovery-form/functions/showRecoveryForm.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { pageResponse } from "#web/http/functions/pageResponse.function.ts";
import { renderRecoveryFormPage } from "#web/views/functions/renderRecoveryFormPage.function.ts";
import { commonResponses } from "../consts/commonResponses.const.ts";

/** The recovery form with a fresh token: empty at first, or again after a code was not recognised or must be confirmed. */
export const recoveryFormResponse = async (
    services: IApplicationServices,
    dropId: Bytes32Hex,
    previous: { readonly typed: string; readonly error: string | null; readonly shouldAskToConfirm: boolean },
): Promise<Response> => {
    const shown = await showRecoveryForm(services, dropId);
    if (shown.kind === "drop-not-found") return commonResponses.notFound();
    const page = renderRecoveryFormPage({
        dropId,
        waitlistLabel: shown.waitlist.label,
        formToken: shown.formToken,
        ...previous,
    });
    return pageResponse(page, { status: previous.error === null ? 200 : 422 });
};

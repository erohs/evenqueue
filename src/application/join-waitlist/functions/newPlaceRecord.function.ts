import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import type { IDropWithWaitlist } from "#application/shared/place-lookup/interfaces/IDropWithWaitlist.ts";
import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import { placeIdForForm } from "#domain/credentials/functions/placeIdForForm.function.ts";
import { storedFormOfCredentials } from "#domain/credentials/functions/storedFormOfCredentials.function.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import type { FormNonce } from "#domain/credentials/types/FormNonce.type.ts";
import { createWaitlistPlace } from "#domain/waitlist/functions/createWaitlistPlace.function.ts";

export const newPlaceRecord = async (
    services: Pick<IApplicationServices, "keys">,
    { drop, waitlist }: IDropWithWaitlist,
    formNonce: FormNonce,
    codes: IIssuedCredentials,
): Promise<IPlaceRecord> => ({
    place: createWaitlistPlace(await placeIdForForm(services.keys.entryCodesKey, formNonce), drop.entryWindowNumber),
    credentials: {
        current: await storedFormOfCredentials(codes, await services.keys.waitlistKey(waitlist.waitlistId)),
        pendingRecovery: null,
    },
});

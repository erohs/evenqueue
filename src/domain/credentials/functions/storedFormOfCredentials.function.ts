import { derivePlaceTag } from "#domain/commitment/functions/derivePlaceTag.function.ts";
import type { IIssuedCredentials } from "../interfaces/IIssuedCredentials.ts";
import type { IStoredCredentials } from "../interfaces/IStoredCredentials.ts";
import type { ServerKey } from "../types/ServerKey.type.ts";
import { entrySecretLookup } from "./entrySecretLookup.function.ts";
import { recoveryCodeCheck } from "./recoveryCodeCheck.function.ts";
import { viewKeyLookup } from "./viewKeyLookup.function.ts";

export const storedFormOfCredentials = async (
    issued: IIssuedCredentials,
    waitlistKey: ServerKey,
): Promise<IStoredCredentials> => ({
    entrySecretLookup: await entrySecretLookup(issued.entrySecret),
    viewKeyLookup: await viewKeyLookup(issued.viewKey),
    recoveryCodeCheck: await recoveryCodeCheck(waitlistKey, issued.recoveryCode),
    placeTag: await derivePlaceTag(issued.viewKey),
});

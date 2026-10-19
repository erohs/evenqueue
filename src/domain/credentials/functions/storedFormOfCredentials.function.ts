import type { ByteArray } from "#domain/shared/bytes/types/ByteArray.type.ts";
import type { IIssuedCredentials } from "../interfaces/IIssuedCredentials.ts";
import type { IStoredCredentials } from "../interfaces/IStoredCredentials.ts";
import { entrySecretLookup } from "./entrySecretLookup.function.ts";
import { recoveryCodeCheck } from "./recoveryCodeCheck.function.ts";
import { viewKeyLookup } from "./viewKeyLookup.function.ts";

export const storedFormOfCredentials = async (
    issued: IIssuedCredentials,
    seriesKey: ByteArray,
): Promise<IStoredCredentials> => ({
    entrySecretLookup: await entrySecretLookup(issued.entrySecret),
    viewKeyLookup: await viewKeyLookup(issued.viewKey),
    recoveryCodeCheck: await recoveryCodeCheck(seriesKey, issued.recoveryCode),
});

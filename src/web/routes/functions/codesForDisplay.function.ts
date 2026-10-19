import { formatCodeForDisplay } from "#domain/credentials/functions/formatCodeForDisplay.function.ts";
import type { IIssuedCredentials } from "#domain/credentials/interfaces/IIssuedCredentials.ts";
import type { ICodesForDisplay } from "#web/views/interfaces/ICodesForDisplay.ts";

export const codesForDisplay = (codes: IIssuedCredentials): ICodesForDisplay => ({
    entryCode: formatCodeForDisplay(codes.entrySecret),
    typedPhrase: codes.typedPhrase.join(" "),
    viewKey: formatCodeForDisplay(codes.viewKey),
    recoveryCode: formatCodeForDisplay(codes.recoveryCode),
});

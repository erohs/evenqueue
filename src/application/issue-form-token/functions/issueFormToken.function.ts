import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { minimumFormNonceByteLength } from "#domain/credentials/consts/minimumFormNonceByteLength.const.ts";
import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import { signFormToken } from "#domain/form-guard/functions/signFormToken.function.ts";
import type { FormPurpose } from "#domain/form-guard/types/FormPurpose.type.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";

/** A fresh token for every form served: two buyers sent the same token would be given the same codes. */
export const issueFormToken = (
    services: Pick<IApplicationServices, "keys" | "clock" | "random">,
    purpose: FormPurpose,
    waitlistId: Bytes32Hex,
): Promise<string> => {
    const nonce = toFormNonce(services.random.bytes(minimumFormNonceByteLength));
    return signFormToken(services.keys.formGuardKey, purpose, waitlistId, nonce, services.clock.now());
};

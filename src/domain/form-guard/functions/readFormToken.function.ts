import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import type { ServerKey } from "#domain/credentials/types/ServerKey.type.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import { verifyHmacSha256 } from "#domain/shared/bytes/functions/verifyHmacSha256.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import type { EpochMilliseconds } from "#domain/shared/time/types/EpochMilliseconds.type.ts";
import { formFillTimeLimits } from "../consts/formFillTimeLimits.const.ts";
import { formTokenPattern } from "../consts/formTokenPattern.const.ts";
import type { FormPurpose } from "../types/FormPurpose.type.ts";
import type { FormTokenReading } from "../types/FormTokenReading.type.ts";
import { formTokenSignedParts } from "./formTokenSignedParts.function.ts";

/** Reads the hidden token of a submitted form. Never throws, whatever the field holds. */
export const readFormToken = async (
    formGuardKey: ServerKey,
    purpose: FormPurpose,
    waitlistId: Bytes32Hex,
    token: unknown,
    now: EpochMilliseconds,
): Promise<FormTokenReading> => {
    const [, nonceHex, issuedText, signatureHex] = (typeof token === "string" && formTokenPattern.exec(token)) || [];
    const issuedAt = Number(issuedText);
    if (nonceHex === undefined || signatureHex === undefined || !isEpochMilliseconds(issuedAt)) {
        return { kind: "not-genuine" };
    }
    const nonce = toFormNonce(decodeHex(nonceHex));
    const parts = formTokenSignedParts(purpose, waitlistId, nonce, issuedAt);
    if (!(await verifyHmacSha256(formGuardKey, decodeHex(signatureHex), ...parts))) return { kind: "not-genuine" };
    if (now - issuedAt < formFillTimeLimits.shortest) return { kind: "too-quick" };
    if (now - issuedAt > formFillTimeLimits.longest) return { kind: "expired" };
    return { kind: "accepted", nonce };
};

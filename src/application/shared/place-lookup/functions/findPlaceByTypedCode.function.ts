import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { buyerCodeByteLengths } from "#domain/credentials/consts/buyerCodeByteLengths.const.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import { readTypedPhrase } from "#domain/credentials/functions/readTypedPhrase.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPlaceFoundByCode } from "../interfaces/IPlaceFoundByCode.ts";
import { findPlaceByEntryCode } from "./findPlaceByEntryCode.function.ts";
import { findPlaceByTypedPhrase } from "./findPlaceByTypedPhrase.function.ts";
import { findPlaceByViewKey } from "./findPlaceByViewKey.function.ts";

const placeByCodeBytes = async (
    services: Pick<IApplicationServices, "places" | "clock">,
    waitlistId: Bytes32Hex,
    code: Uint8Array<ArrayBuffer>,
): Promise<IPlaceFoundByCode | null> => {
    const byEntryCode = await findPlaceByEntryCode(services, waitlistId, code);
    if (byEntryCode !== null) return { access: "entry-code", record: byEntryCode };
    const byViewKey = await findPlaceByViewKey(services, waitlistId, code);
    return byViewKey === null ? null : { access: "view-key", record: byViewKey };
};

/**
 * One field takes the entry code, the view key or the seven-word phrase. Codes and phrases cannot be confused: a
 * phrase holds letters a code never uses. The phrase does everything the entry code does.
 */
export const findPlaceByTypedCode = async (
    services: Pick<IApplicationServices, "places" | "clock" | "keys">,
    waitlistId: Bytes32Hex,
    typedCode: unknown,
): Promise<IPlaceFoundByCode | null> => {
    if (typeof typedCode !== "string") return null;
    const code = readTypedCode(typedCode, buyerCodeByteLengths.entrySecret);
    if (code !== null) return placeByCodeBytes(services, waitlistId, code);
    const words = readTypedPhrase(typedCode);
    const byPhrase = words === null ? null : await findPlaceByTypedPhrase(services, waitlistId, words);
    return byPhrase === null ? null : { access: "entry-code", record: byPhrase };
};

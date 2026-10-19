import type { IApplicationServices } from "#application/ports/interfaces/IApplicationServices.ts";
import { buyerCodeByteLengths } from "#domain/credentials/consts/buyerCodeByteLengths.const.ts";
import { readTypedCode } from "#domain/credentials/functions/readTypedCode.function.ts";
import type { Bytes32Hex } from "#domain/shared/bytes/types/Bytes32Hex.type.ts";
import type { IPlaceFoundByCode } from "../interfaces/IPlaceFoundByCode.ts";
import { findPlaceByEntryCode } from "./findPlaceByEntryCode.function.ts";
import { findPlaceByViewKey } from "./findPlaceByViewKey.function.ts";

/** Entry codes and view keys have the same length, so one field takes either; the place says which it was. */
export const findPlaceByTypedCode = async (
    services: Pick<IApplicationServices, "places" | "clock">,
    waitlistId: Bytes32Hex,
    typedCode: unknown,
): Promise<IPlaceFoundByCode | null> => {
    const code = typeof typedCode === "string" ? readTypedCode(typedCode, buyerCodeByteLengths.entrySecret) : null;
    if (code === null) return null;
    const byEntryCode = await findPlaceByEntryCode(services, waitlistId, code);
    if (byEntryCode !== null) return { access: "entry-code", record: byEntryCode };
    const byViewKey = await findPlaceByViewKey(services, waitlistId, code);
    return byViewKey === null ? null : { access: "view-key", record: byViewKey };
};

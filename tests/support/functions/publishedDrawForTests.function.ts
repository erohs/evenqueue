import { toPriority } from "#domain/allocation-rules/functions/toPriority.function.ts";
import { computePublicDrawId } from "#domain/commitment/functions/computePublicDrawId.function.ts";
import { derivePlaceTag } from "#domain/commitment/functions/derivePlaceTag.function.ts";
import { issueBuyerCredentials } from "#domain/credentials/functions/issueBuyerCredentials.function.ts";
import { toFormNonce } from "#domain/credentials/functions/toFormNonce.function.ts";
import { toServerKey } from "#domain/credentials/functions/toServerKey.function.ts";
import { decodeHex } from "#domain/shared/bytes/functions/decodeHex.function.ts";
import type { IPublishedDrawForTests } from "../interfaces/IPublishedDrawForTests.ts";
import { deterministicBytes32Hex } from "./deterministicBytes32Hex.function.ts";

/** Buyers with real codes, published in one draw with the given priorities, as a lost database would leave them. */
export const publishedDrawForTests = async (priorities: readonly number[]): Promise<IPublishedDrawForTests> => {
    const drawId = deterministicBytes32Hex("published-draw");
    const entryKey = toServerKey(decodeHex(deterministicBytes32Hex("entry-key")));
    const nonce = (i: number) => toFormNonce(decodeHex(deterministicBytes32Hex(`nonce-${i}`).slice(0, 32)));
    const buyers = await Promise.all(priorities.map((_, i) => issueBuyerCredentials(entryKey, nonce(i))));
    const leaves = await Promise.all(
        buyers.map(async (buyer, i) => ({
            publicDrawId: await computePublicDrawId(await derivePlaceTag(buyer.viewKey), drawId),
            priority: toPriority(priorities[i] ?? 0),
        })),
    );
    return { drawId, buyers, leaves };
};

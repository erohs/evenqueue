import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import type { IRankedLeaf } from "../interfaces/IRankedLeaf.ts";
import { compareRankedLeaves } from "./compareRankedLeaves.function.ts";
import { rankLeaf } from "./rankLeaf.function.ts";

/**
 * Best first. Orders the committed leaves themselves, so the engine and the public verifier rank exactly the same
 * published data.
 */
export const orderLeavesForDraw = async (
    leaves: readonly IWaitlistLeaf[],
    publicDrawInputs: IPublicDrawInputs,
): Promise<IRankedLeaf[]> =>
    (await Promise.all(leaves.map((leaf) => rankLeaf(leaf, publicDrawInputs)))).toSorted(compareRankedLeaves);

import type { IWaitlistLeaf } from "#domain/commitment/interfaces/IWaitlistLeaf.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import type { IRankedLeaf } from "../interfaces/IRankedLeaf.ts";
import { computeRandomTiebreakKey } from "./computeRandomTiebreakKey.function.ts";

export const rankLeaf = async (leaf: IWaitlistLeaf, publicDrawInputs: IPublicDrawInputs): Promise<IRankedLeaf> => ({
    ...leaf,
    randomTiebreakKey: await computeRandomTiebreakKey(publicDrawInputs, leaf.publicDrawId),
});

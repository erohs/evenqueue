import type { IAllocationRule } from "#domain/allocation-rules/interfaces/IAllocationRule.ts";
import { assertWholeNumber } from "#domain/shared/validation/functions/assertWholeNumber.function.ts";
import type { IDrawEntrant } from "../interfaces/IDrawEntrant.ts";
import type { IPublicDrawInputs } from "../interfaces/IPublicDrawInputs.ts";
import type { IRankedEntrant } from "../interfaces/IRankedEntrant.ts";
import { computeRandomTiebreakKey } from "./computeRandomTiebreakKey.function.ts";

export const rankEntrant = async (
    rule: IAllocationRule,
    entrant: IDrawEntrant,
    publicDrawInputs: IPublicDrawInputs,
): Promise<IRankedEntrant> => {
    const priority = rule.priorityOf(entrant.place);
    assertWholeNumber(priority, "an allocation rule's priority");
    return {
        ...entrant,
        priority,
        randomTiebreakKey: await computeRandomTiebreakKey(publicDrawInputs, entrant.publicDrawId),
    };
};

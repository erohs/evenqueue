import { parsedList } from "#domain/shared/parsing/functions/parsedList.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IWaitlistLeaf } from "../interfaces/IWaitlistLeaf.ts";
import { parseWaitlistLeaf } from "./parseWaitlistLeaf.function.ts";

/** A draw's leaves as downloaded by the verifier. Two leaves with one id would let one place count twice. */
export const parsePublishedLeaves = (value: unknown): ParseResult<IWaitlistLeaf[]> => {
    const leaves = parsedList(value, parseWaitlistLeaf, "leaf");
    if (!leaves.isValid) return leaves;
    const ids = new Set(leaves.value.map((leaf) => leaf.publicDrawId));
    return ids.size === leaves.value.length
        ? leaves
        : { isValid: false, problems: ["two leaves share a public draw id"] };
};

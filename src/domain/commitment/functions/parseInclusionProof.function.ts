import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import { parsedList } from "#domain/shared/parsing/functions/parsedList.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { maximumInclusionProofSteps } from "../consts/maximumInclusionProofSteps.const.ts";
import type { IMerkleProofStep } from "../interfaces/IMerkleProofStep.ts";

const isBoolean = (value: unknown): boolean => typeof value === "boolean";
const parseStep = (value: unknown): ParseResult<IMerkleProofStep> =>
    parsedFields<IMerkleProofStep>(value, { siblingHash: isBytes32Hex, isSiblingOnLeft: isBoolean });

/** A proof sent by a server the verifier does not trust. Refused before any hashing if it is too long to be real. */
export const parseInclusionProof = (value: unknown): ParseResult<IMerkleProofStep[]> => {
    if (Array.isArray(value) && value.length > maximumInclusionProofSteps) {
        return { isValid: false, problems: ["the proof is too long"] };
    }
    return parsedList(value, parseStep, "step");
};

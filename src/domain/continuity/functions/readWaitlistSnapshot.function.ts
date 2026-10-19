import { findLogProblems } from "#domain/public-log/functions/findLogProblems.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import type { IWaitlistSnapshot } from "../interfaces/IWaitlistSnapshot.ts";
import { duplicateValueProblems } from "./duplicateValueProblems.function.ts";
import { parseWaitlistSnapshotShape } from "./parseWaitlistSnapshotShape.function.ts";

/**
 * Reads a backup before it is imported anywhere: its shape, then that no two places share an id or a code, then
 * that its public log is intact. A snapshot is only ever loaded through here.
 */
export const readWaitlistSnapshot = async (value: unknown): Promise<ParseResult<IWaitlistSnapshot>> => {
    const shape = parseWaitlistSnapshotShape(value);
    if (!shape.isValid) return shape;
    const duplicates = duplicateValueProblems(shape.value.places);
    if (duplicates.length > 0) return { isValid: false, problems: duplicates };
    const [firstLogProblem] = await findLogProblems(shape.value.publicLog);
    if (firstLogProblem !== undefined) {
        return { isValid: false, problems: [`the public log is damaged at entry ${firstLogProblem.position}`] };
    }
    return shape;
};

import { isAllocationRuleId } from "#domain/allocation-rules/functions/isAllocationRuleId.function.ts";
import { parsePublicLog } from "#domain/public-log/functions/parsePublicLog.function.ts";
import { isRecord } from "#domain/shared/parsing/functions/isRecord.function.ts";
import { parsedList } from "#domain/shared/parsing/functions/parsedList.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { isEpochMilliseconds } from "#domain/shared/time/functions/isEpochMilliseconds.function.ts";
import { waitlistSnapshotFormatVersion } from "../consts/waitlistSnapshotFormatVersion.const.ts";
import type { IWaitlistSnapshot } from "../interfaces/IWaitlistSnapshot.ts";
import { parsePlaceRecord } from "./parsePlaceRecord.function.ts";

const headerProblems = (value: Readonly<Record<string, unknown>>): string[] => [
    ...(value["formatVersion"] === waitlistSnapshotFormatVersion ? [] : ["unknown snapshot format version"]),
    ...(isAllocationRuleId(value["allocationRuleId"]) ? [] : ["unknown allocation rule"]),
    ...(isEpochMilliseconds(value["exportedAt"]) ? [] : ["exportedAt is missing or invalid"]),
];

/** Every field of a snapshot in the right form. readWaitlistSnapshot then checks the rules across places. */
export const parseWaitlistSnapshotShape = (value: unknown): ParseResult<IWaitlistSnapshot> => {
    if (!isRecord(value)) return { isValid: false, problems: ["not a snapshot"] };
    const { formatVersion, allocationRuleId, exportedAt } = value;
    const places = parsedList(value["places"], parsePlaceRecord, "place");
    const publicLog = parsePublicLog(value["publicLog"]);
    const isKnownFormat = formatVersion === waitlistSnapshotFormatVersion;
    if (isKnownFormat && isAllocationRuleId(allocationRuleId) && isEpochMilliseconds(exportedAt)) {
        if (places.isValid && publicLog.isValid) {
            const snapshot = {
                formatVersion,
                allocationRuleId,
                exportedAt,
                places: places.value,
                publicLog: publicLog.value,
            };
            return { isValid: true, value: snapshot };
        }
    }
    const listProblems = [...(places.isValid ? [] : places.problems), ...(publicLog.isValid ? [] : publicLog.problems)];
    return { isValid: false, problems: [...headerProblems(value), ...listProblems] };
};

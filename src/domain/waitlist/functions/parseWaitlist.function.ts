import { isAllocationRuleId } from "#domain/allocation-rules/functions/isAllocationRuleId.function.ts";
import { isBytes32Hex } from "#domain/shared/bytes/functions/isBytes32Hex.function.ts";
import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { buyerFacingTextProblems } from "#domain/shared/text/functions/buyerFacingTextProblems.function.ts";
import { longestWaitlistLabel } from "../consts/longestWaitlistLabel.const.ts";
import type { IWaitlist } from "../interfaces/IWaitlist.ts";

const ruleProblems = (waitlist: IWaitlist): string[] => [
    ...(waitlist.shouldForgetPlacesAfterEachDrop && waitlist.allocationRuleId !== "equal-chance-each-drop"
        ? ["places can be forgotten after each drop only under equal-chance-each-drop"]
        : []),
    ...(waitlist.label.trim() === "" ? ["label is empty"] : []),
    ...buyerFacingTextProblems("label", waitlist.label, longestWaitlistLabel, false),
];

/** A waitlist as the vendor set it up, or as read back from storage. */
export const parseWaitlist = (value: unknown): ParseResult<IWaitlist> =>
    parsedFields<IWaitlist>(
        value,
        {
            waitlistId: isBytes32Hex,
            allocationRuleId: isAllocationRuleId,
            shouldForgetPlacesAfterEachDrop: (field) => typeof field === "boolean",
            label: (field) => typeof field === "string",
        },
        ruleProblems,
    );

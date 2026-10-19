import { parsedFields } from "#domain/shared/parsing/functions/parsedFields.function.ts";
import type { ParseResult } from "#domain/shared/parsing/types/ParseResult.type.ts";
import { buyerFacingTextProblems } from "#domain/shared/text/functions/buyerFacingTextProblems.function.ts";
import { dropSettingLimits } from "../consts/dropSettingLimits.const.ts";
import type { IDropSettings } from "../interfaces/IDropSettings.ts";
import { createCountRangeGuard } from "./createCountRangeGuard.function.ts";
import { createDurationRangeGuard } from "./createDurationRangeGuard.function.ts";
import { isAnnouncementWebhookUrl } from "./isAnnouncementWebhookUrl.function.ts";
import { isEmbedOriginList } from "./isEmbedOriginList.function.ts";

const { unitCount, entrantCap, entryWindow, offerWindow, checkpointInterval, resultsRetentionDays } = dropSettingLimits;

const ruleProblems = (settings: IDropSettings): string[] => [
    ...(settings.checkpointInterval > settings.offerWindow
        ? [
              "the checkpoint interval is longer than the offer window, so an offer could lapse before the next checkpoint",
          ]
        : []),
    ...buyerFacingTextProblems("pageText", settings.pageText, dropSettingLimits.pageTextCharacters.most, true),
];

/** Settings as a vendor submitted them, or as read back from storage. */
export const parseDropSettings = (value: unknown): ParseResult<IDropSettings> =>
    parsedFields<IDropSettings>(
        value,
        {
            unitCount: createCountRangeGuard(unitCount.least, unitCount.most),
            entrantCap: createCountRangeGuard(entrantCap.least, entrantCap.most),
            entryWindow: createDurationRangeGuard(entryWindow.least, entryWindow.most),
            offerWindow: createDurationRangeGuard(offerWindow.least, offerWindow.most),
            checkpointInterval: createDurationRangeGuard(checkpointInterval.least, checkpointInterval.most),
            embedOrigins: isEmbedOriginList,
            pageText: (field) => typeof field === "string",
            announcementWebhookUrl: isAnnouncementWebhookUrl,
            resultsRetentionDays: createCountRangeGuard(resultsRetentionDays.least, resultsRetentionDays.most),
        },
        ruleProblems,
    );

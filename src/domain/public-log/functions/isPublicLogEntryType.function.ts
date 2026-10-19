import { publicLogEntryTypes } from "../consts/publicLogEntryTypes.const.ts";
import type { PublicLogEntryType } from "../types/PublicLogEntryType.type.ts";

export const isPublicLogEntryType = (value: unknown): value is PublicLogEntryType =>
    publicLogEntryTypes.includes(value as PublicLogEntryType);

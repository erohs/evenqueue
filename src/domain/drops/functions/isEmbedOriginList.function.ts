import { dropSettingLimits } from "../consts/dropSettingLimits.const.ts";
import { isEmbedOrigin } from "./isEmbedOrigin.function.ts";

export const isEmbedOriginList = (value: unknown): value is readonly string[] =>
    Array.isArray(value) &&
    value.length <= dropSettingLimits.embedOrigins.most &&
    value.every(isEmbedOrigin) &&
    new Set(value).size === value.length;

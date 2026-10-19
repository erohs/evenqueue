import { displayedCodeGroupLength } from "../consts/displayedCodeGroupLength.const.ts";
import { encodeCrockfordBase32 } from "./encodeCrockfordBase32.function.ts";

/** Groups of four joined by hyphens, which typing and pasting both ignore. */
export const formatCodeForDisplay = (code: Uint8Array): string =>
    (encodeCrockfordBase32(code).match(new RegExp(`.{1,${displayedCodeGroupLength}}`, "gu")) ?? []).join("-");

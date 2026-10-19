import { displayedCodeGroupLength } from "../consts/displayedCodeGroupLength.const.ts";
import { encodeCrockfordBase32 } from "./encodeCrockfordBase32.function.ts";

/** Groups of four joined by hyphens, which typing and pasting both ignore. */
export const formatCodeForDisplay = (code: Uint8Array): string => {
    const text = encodeCrockfordBase32(code);
    const groupCount = Math.ceil(text.length / displayedCodeGroupLength);
    return Array.from({ length: groupCount }, (_, i) =>
        text.slice(i * displayedCodeGroupLength, (i + 1) * displayedCodeGroupLength),
    ).join("-");
};

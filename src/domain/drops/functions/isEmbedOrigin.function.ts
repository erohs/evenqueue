import { longestWebAddress } from "../consts/longestWebAddress.const.ts";

/** Written exactly as a browser reports the origin, so it can be compared as text in a frame-ancestors header. */
export const isEmbedOrigin = (value: unknown): value is string => {
    if (typeof value !== "string" || value.length > longestWebAddress || !URL.canParse(value)) return false;
    const address = new URL(value);
    return address.protocol === "https:" && address.origin === value;
};

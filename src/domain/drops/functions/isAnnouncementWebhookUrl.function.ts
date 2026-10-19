import { longestWebAddress } from "../consts/longestWebAddress.const.ts";

/** An `https://` address with no user name or password in it; null means no webhook. */
export const isAnnouncementWebhookUrl = (value: unknown): value is string | null => {
    if (value === null) return true;
    if (typeof value !== "string" || value.length > longestWebAddress || !URL.canParse(value)) return false;
    const address = new URL(value);
    return address.protocol === "https:" && address.username === "" && address.password === "";
};

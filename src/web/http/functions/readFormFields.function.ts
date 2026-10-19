import { longestFormBodyBytes } from "../consts/longestFormBodyBytes.const.ts";
import { readBytesUpTo } from "./readBytesUpTo.function.ts";

/** A submitted HTML form's fields, or null for any other kind of body or one too large. An empty form has no fields. */
export const readFormFields = async (request: Request): Promise<URLSearchParams | null> => {
    const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
    if (request.body === null) return new URLSearchParams();
    if (!contentType.startsWith("application/x-www-form-urlencoded")) return null;
    const bytes = await readBytesUpTo(request.body, longestFormBodyBytes);
    return bytes === null ? null : new URLSearchParams(new TextDecoder().decode(bytes));
};

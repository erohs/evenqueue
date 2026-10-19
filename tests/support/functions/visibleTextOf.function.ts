/** A page's text as a reader meets it: tags removed and the common entities decoded. */
export const visibleTextOf = (body: string): string =>
    body
        .replace(/<(script|style)[\s\S]*?<\/\1>/gu, " ")
        .replace(/<[^>]+>/gu, " ")
        .replaceAll("&lt;", "<")
        .replaceAll("&gt;", ">")
        .replaceAll("&quot;", '"')
        .replaceAll("&#39;", "'")
        .replaceAll("&amp;", "&");

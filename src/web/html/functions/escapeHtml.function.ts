const replacements: Readonly<Record<string, string>> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
};

/** Safe in element content and in quoted attribute values; never put a value in a script, style or unquoted attribute. */
export const escapeHtml = (text: string): string =>
    text.replace(/[&<>"']/gu, (character) => replacements[character] ?? "");

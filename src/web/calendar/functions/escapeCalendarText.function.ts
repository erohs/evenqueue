/** RFC 5545 section 3.3.11: backslash, semicolon and comma are escaped, and line breaks become `\n`. */
export const escapeCalendarText = (text: string): string =>
    text.replace(/[\\;,]/gu, (character) => `\\${character}`).replace(/\r?\n/gu, "\\n");

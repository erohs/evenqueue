const longestLineOctets = 75;

/**
 * RFC 5545 section 3.1: lines longer than 75 octets continue on the next line after a space. Splits only between
 * characters, so a multi-byte character is never cut in half.
 */
export const foldCalendarLine = (line: string): string => {
    const encoder = new TextEncoder();
    const parts: string[] = [];
    let current = "";
    for (const character of line) {
        const limit = parts.length === 0 ? longestLineOctets : longestLineOctets - 1;
        if (encoder.encode(current + character).length > limit) {
            parts.push(current);
            current = "";
        }
        current += character;
    }
    return [...parts, current].join("\r\n ");
};

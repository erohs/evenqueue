/** The seven-word phrase shown on a codes page, or an empty string if there is none. */
export const phraseOnPage = (body: string): string =>
    /<code class="code code--words">([^<]*)<\/code>/u.exec(body)?.[1] ?? "";

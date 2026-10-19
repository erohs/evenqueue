/** The codes shown on a codes page, in order: entry code, view key, recovery code. */
export const codesOnPage = (body: string): string[] =>
    [...body.matchAll(/<code class="code">([^<]*)<\/code>/gu)].map((match) => match[1] ?? "");

/** What a parser of outside data returns: the typed value, or every reason it was refused, for people to read. */
export type ParseResult<T> =
    { readonly isValid: true; readonly value: T } | { readonly isValid: false; readonly problems: readonly string[] };

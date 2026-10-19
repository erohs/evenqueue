const invisibleCharacters = /\p{Default_Ignorable_Code_Point}/gu;
const whitespaceRuns = /\s+/gu;

/**
 * One spelling per name, so a party cannot be counted twice by writing its name differently: compatibility forms
 * folded (NFKC), invisible characters removed, case folded and spaces collapsed.
 */
export const normaliseIdentifier = (name: string): string =>
    name.normalize("NFKC").replace(invisibleCharacters, "").toLowerCase().replace(whitespaceRuns, " ").trim();

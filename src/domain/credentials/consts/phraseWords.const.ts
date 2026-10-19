import words from "../data/phraseWords.json" with { type: "json" };

/**
 * 7,760 short, distinct English words, adapted from the EFF Large Wordlist (CC BY 3.0 US; see NOTICE.md). Its order
 * is part of the phrase's derivation, so changing the list means a new version tag and new vectors.
 */
export const phraseWords: readonly string[] = words;

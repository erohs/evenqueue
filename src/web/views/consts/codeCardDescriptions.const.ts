import type { ICodeCardDescription } from "../interfaces/ICodeCardDescription.ts";

/** In the order a buyer needs them: what to keep private, what to share, what to put away. */
export const codeCardDescriptions: readonly ICodeCardDescription[] = [
    {
        codeShown: "entryCode",
        name: "Entry code",
        purpose: "Checks your place, takes up an offer and lets you leave. Keep it private.",
        hasQrCode: true,
        isWords: false,
    },
    {
        codeShown: "typedPhrase",
        name: "Phrase",
        purpose: "Does everything the entry code does. Use whichever you find easier to keep.",
        hasQrCode: false,
        isWords: true,
    },
    {
        codeShown: "viewKey",
        name: "View key",
        purpose: "Only checks your place. Give this one to anyone helping you.",
        hasQrCode: true,
        isWords: false,
    },
    {
        codeShown: "recoveryCode",
        name: "Recovery code",
        purpose: "Replaces a lost entry code and phrase, after a delay. Print it or write it down, and keep it safe.",
        hasQrCode: false,
        isWords: false,
    },
];

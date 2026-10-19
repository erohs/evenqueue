import type { IFileKindRule } from "../interfaces/IFileKindRule.ts";

/** Enums are `as const` objects, because Node's type stripping does not support TypeScript's `enum`. */
export const fileKindRules: readonly IFileKindRule[] = [
    {
        folder: "functions",
        fileNamePattern: /^[a-z][A-Za-z0-9]*\.function\.ts$/,
        fileNameExample: "formatTime.function.ts",
        exportKeyword: "const",
    },
    {
        folder: "consts",
        fileNamePattern: /^[a-z][A-Za-z0-9]*\.const\.ts$/,
        fileNameExample: "defaultRule.const.ts",
        exportKeyword: "const",
    },
    {
        folder: "interfaces",
        fileNamePattern: /^I[A-Z][A-Za-z0-9]*\.ts$/,
        fileNameExample: "IWaitlistPlace.ts",
        exportKeyword: "interface",
    },
    {
        folder: "types",
        fileNamePattern: /^[A-Z][A-Za-z0-9]*\.type\.ts$/,
        fileNameExample: "RuleId.type.ts",
        exportKeyword: "type",
    },
    {
        folder: "enums",
        fileNamePattern: /^[A-Z][A-Za-z0-9]*\.enum\.ts$/,
        fileNameExample: "OfferState.enum.ts",
        exportKeyword: "const",
    },
    {
        folder: "tests",
        fileNamePattern: /^[a-zA-Z][A-Za-z0-9]*\.spec\.ts$/,
        fileNameExample: "createRule.spec.ts",
        exportKeyword: null,
    },
];

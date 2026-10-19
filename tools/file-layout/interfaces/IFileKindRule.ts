export interface IFileKindRule {
    /** The folder every file of this kind lives in. */
    readonly folder: string;
    readonly fileNamePattern: RegExp;
    readonly fileNameExample: string;
    /** The declaration the file's single export must use, named after the file; null for test files. */
    readonly exportKeyword: "const" | "interface" | "type" | null;
}

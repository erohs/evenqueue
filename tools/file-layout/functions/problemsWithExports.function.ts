import type { IFileKindRule } from "../interfaces/IFileKindRule.ts";

/** A kind file has exactly one export, declared with the kind's keyword and named after the file. */
export const problemsWithExports = (filePath: string, source: string, rule: IFileKindRule): string[] => {
    if (rule.exportKeyword === null) return [];
    const exportedName = filePath.split("/").at(-1)?.split(".")[0] ?? "";
    const exportCount = (source.match(/^export /gm) ?? []).length;
    const expectedDeclaration = new RegExp(`^export ${rule.exportKeyword} ${exportedName}\\b`, "m");
    const problems: string[] = [];
    if (exportCount !== 1) problems.push(`${filePath}: must have exactly one export, found ${exportCount}`);
    if (!expectedDeclaration.test(source)) {
        problems.push(`${filePath}: must export ${rule.exportKeyword} ${exportedName}`);
    }
    return problems;
};

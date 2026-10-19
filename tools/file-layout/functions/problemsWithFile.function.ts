import { fileKindRules } from "../consts/fileKindRules.const.ts";
import { isEntryPoint } from "./isEntryPoint.function.ts";
import { kindFolderOf } from "./kindFolderOf.function.ts";
import { problemsWithExports } from "./problemsWithExports.function.ts";
import { problemsWithFolderNames } from "./problemsWithFolderNames.function.ts";

/** Every file lives in the folder for its kind, except entry points. */
export const problemsWithFile = (filePath: string, source: string): string[] => {
    const fileName = filePath.split("/").at(-1) ?? "";
    const folderProblems = problemsWithFolderNames(filePath);
    if (isEntryPoint(filePath)) return folderProblems;
    const rule = fileKindRules.find((candidate) => candidate.folder === kindFolderOf(filePath));
    if (!rule) {
        const folders = fileKindRules.map((candidate) => candidate.folder).join(", ");
        return [...folderProblems, `${filePath}: must sit in a kind folder (${folders})`];
    }
    if (!rule.fileNamePattern.test(fileName)) {
        return [...folderProblems, `${filePath}: name must look like ${rule.fileNameExample}`];
    }
    return [...folderProblems, ...problemsWithExports(filePath, source, rule)];
};

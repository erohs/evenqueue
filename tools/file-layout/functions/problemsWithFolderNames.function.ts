import { kebabCaseFolderPattern } from "../consts/kebabCaseFolderPattern.const.ts";

export const problemsWithFolderNames = (filePath: string): string[] =>
    filePath
        .split("/")
        .slice(0, -1)
        .filter((folder) => !kebabCaseFolderPattern.test(folder))
        .map((folder) => `${filePath}: folder "${folder}" must be kebab-case`);

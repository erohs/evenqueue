import { rootTestFolders } from "../consts/rootTestFolders.const.ts";

/** The kind folder a file belongs to; specs in a root test folder count as `tests`. */
export const kindFolderOf = (filePath: string): string => {
    const segments = filePath.split("/");
    const parentFolder = segments.slice(0, -1).join("/");
    if (rootTestFolders.includes(parentFolder)) return "tests";
    return segments.at(-2) ?? "";
};

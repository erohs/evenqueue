import { readdirSync } from "node:fs";
import { join, relative } from "node:path";

/** Paths relative to `repositoryRoot`, with forward slashes. */
export const listTypeScriptFiles = (repositoryRoot: string, rootFolder: string): string[] =>
    readdirSync(join(repositoryRoot, rootFolder), { recursive: true, withFileTypes: true })
        .filter((entry) => entry.isFile() && entry.name.endsWith(".ts"))
        .map((entry) => relative(repositoryRoot, join(entry.parentPath, entry.name)).replaceAll("\\", "/"));

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { checkedRootFolders } from "./consts/checkedRootFolders.const.ts";
import { listTypeScriptFiles } from "./functions/listTypeScriptFiles.function.ts";
import { problemsWithFile } from "./functions/problemsWithFile.function.ts";

const repositoryRoot = process.cwd();
const problems = checkedRootFolders
    .flatMap((rootFolder) => listTypeScriptFiles(repositoryRoot, rootFolder))
    .flatMap((filePath) => problemsWithFile(filePath, readFileSync(join(repositoryRoot, filePath), "utf8")));

for (const problem of problems) console.error(problem);
console.log(`file layout: ${problems.length} problem(s)`);
process.exitCode = problems.length > 0 ? 1 : 0;

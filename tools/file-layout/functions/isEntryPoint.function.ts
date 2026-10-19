/** A `main.ts` directly inside a tool's folder or an entry point's folder. */
export const isEntryPoint = (filePath: string): boolean => {
    const segments = filePath.split("/");
    if (segments.at(-1) !== "main.ts") return false;
    const isToolEntry = segments[0] === "tools" && segments.length === 3;
    const isRuntimeEntry = segments[0] === "src" && segments[1] === "entry-points" && segments.length === 4;
    return isToolEntry || isRuntimeEntry;
};

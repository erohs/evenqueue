import { readFile } from "node:fs/promises";
import { join } from "node:path";

const stylesheetNames = new Set(["tokens.css", "buyer.css"]);
const stylesFolder = join(import.meta.dirname, "..", "..", "..", "web", "styles");

/** The two stylesheets, read fresh on every request so edits show on reload; null for any other name. */
export const stylesheetResponse = async (pathname: string): Promise<Response | null> => {
    const name = pathname.slice("/styles/".length);
    if (!pathname.startsWith("/styles/") || !stylesheetNames.has(name)) return null;
    const stylesheet = await readFile(join(stylesFolder, name), "utf8");
    return new Response(stylesheet, {
        headers: {
            "content-type": "text/css; charset=utf-8",
            "cache-control": "no-cache",
            "x-content-type-options": "nosniff",
        },
    });
};

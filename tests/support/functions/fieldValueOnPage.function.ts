import assert from "node:assert/strict";

/** The value of the first input with this name, as the browser would send it back. */
export const fieldValueOnPage = (body: string, name: string): string => {
    const match = new RegExp(`name="${name}"[^>]*?value="([^"]*)"`, "u").exec(body);
    return match?.[1] ?? assert.fail(`no field named ${name} on the page`);
};

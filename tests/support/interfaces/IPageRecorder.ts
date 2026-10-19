import type { IPageVisit } from "./IPageVisit.ts";

export interface IPageRecorder {
    readonly pages: ReadonlyMap<string, IPageVisit>;
    /** Visits a path under the drop, keeps the page under `name` and returns its body. */
    visit: (
        name: string,
        method: "GET" | "POST",
        subpath: string,
        fields?: Readonly<Record<string, string>>,
    ) => Promise<string>;
}

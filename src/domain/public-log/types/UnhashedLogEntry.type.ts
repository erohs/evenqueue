import type { IPublicLogEntry } from "../interfaces/IPublicLogEntry.ts";

export type UnhashedLogEntry = Omit<IPublicLogEntry, "entryHash">;

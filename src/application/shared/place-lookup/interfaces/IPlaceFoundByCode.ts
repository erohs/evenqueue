import type { IPlaceRecord } from "#domain/continuity/interfaces/IPlaceRecord.ts";
import type { CodeAccess } from "../types/CodeAccess.type.ts";

export interface IPlaceFoundByCode {
    readonly access: CodeAccess;
    readonly record: IPlaceRecord;
}

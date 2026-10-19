import type { Priority } from "#domain/allocation-rules/types/Priority.type.ts";
import type { Count } from "#domain/shared/counting/types/Count.type.ts";

export interface IPriorityCount {
    readonly priority: Priority;
    readonly placeCount: Count;
}

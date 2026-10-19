import type { IClock } from "./IClock.ts";
import type { IInstanceKeys } from "./IInstanceKeys.ts";
import type { IPlaceStore } from "./IPlaceStore.ts";
import type { IRandomSource } from "./IRandomSource.ts";
import type { IWaitlistStore } from "./IWaitlistStore.ts";

/** Everything an entry point wires up. Each use case takes only the services it uses, picked from these. */
export interface IApplicationServices {
    readonly waitlists: IWaitlistStore;
    readonly places: IPlaceStore;
    readonly clock: IClock;
    readonly random: IRandomSource;
    readonly keys: IInstanceKeys;
}

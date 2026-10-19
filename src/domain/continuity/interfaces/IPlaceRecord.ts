import type { IPlaceCredentials } from "#domain/credentials/interfaces/IPlaceCredentials.ts";
import type { IWaitlistPlace } from "#domain/waitlist/interfaces/IWaitlistPlace.ts";

export interface IPlaceRecord {
    readonly place: IWaitlistPlace;
    readonly credentials: IPlaceCredentials;
}

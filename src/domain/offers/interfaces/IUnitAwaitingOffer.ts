/** A free unit at a checkpoint, with how many times it has already been offered in this drop. */
export interface IUnitAwaitingOffer {
    readonly unitNumber: number;
    readonly offersMade: number;
}

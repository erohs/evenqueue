/** A drand round number, counted from 1 at the chain's genesis. Made only by toBeaconRound. */
export type BeaconRound = number & { readonly brand: "BeaconRound" };

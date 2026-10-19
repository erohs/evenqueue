# Progress

Build steps for the first beta. Each stage ends with `pnpm check` green; then the maintainer reviews and commits.

| Step                                                   | Stage                                                                       | Status                |
| ------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------- |
| 1. Engine core                                         | 1a. Scaffold, conventions, allocation rules, tiebreak key, ordering, slices | Done                  |
|                                                        | 1b. Entry and offer windows, checkpoints, offers and backfill               | Done, awaiting review |
|                                                        | 1c. Buyer codes and delayed recovery                                        | Next                  |
|                                                        | 1d. Commitment (waitlist root, public draw ids) and beacon handling         |                       |
|                                                        | 1e. Hash-chained public log                                                 |                       |
| 2. Buyer pages and vendor admin                        |                                                                             |                       |
| 3. Targets: Workers with D1, Node with SQLite          |                                                                             |                       |
| 4. Redemption: WooCommerce connector, signed links     |                                                                             |                       |
| 5. Public verifier                                     |                                                                             |                       |
| 6. Docs and demo on workers.dev                        |                                                                             |                       |
| 7. Release checks, security maintenance bot, then beta |                                                                             |                       |

## Stage 1a notes

- Priority under the priority-after-losses rule is draws entered minus offers received, capped, so an unclaimed offer
  leaves it unchanged.
- The random tiebreak key is taken over the public draw id, which changes every draw, not over the place id.
- The join-order line breaks ties inside an entry window with the tiebreak key, and moves a place to the back on its
  third unclaimed offer.

## Stage 1b notes

- A window promises a length of uptime, not two clock times: outages found from missed heartbeats (more than three
  at one a minute) push its close later, by at most its own length.
- Default windows: 72 h to join and to claim under equal-chance-each-drop and priority-after-losses, 36 h under the
  join-order line. Offers go out at the draw and then every 12 h.
- Each unit is offered to the next place in draw order not yet offered one; after a lapse it is offered once more
  (one backfill offer by default), then stays free. A draw keeps `units × (1 + backfill offers)` places.
- The unit state table covers offers, claims, expiry, cancellation, payment and withdrawal. A sold unit never moves.
  Late payments, holds, refunds and chargebacks arrive with redemption in step 4.

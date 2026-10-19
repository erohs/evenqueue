# Progress

Build steps for the first beta. Each stage ends with `pnpm check` green; then the maintainer reviews and commits.

| Step                                                   | Stage                                                                       | Status                |
| ------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------- |
| 1. Engine core                                         | 1a. Scaffold, conventions, allocation rules, tiebreak key, ordering, slices | Done                  |
|                                                        | 1b. Entry and offer windows, checkpoints, offers and backfill               | Done                  |
|                                                        | 1c. Buyer codes and delayed recovery                                        | Done, awaiting review |
|                                                        | 1d. Commitment (waitlist root, public draw ids) and beacon handling         | Next                  |
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

## Stage 1c notes

- Each place gets three codes, shown once and never stored: an entry code (128 bits, 26 characters), a view key
  (128 bits, status only) and a printed recovery code (80 bits, 16 characters). All are Crockford base 32 and shown
  in groups of four.
- Codes are derived from the entry key and the signed form's nonce, so a retried form shows the same codes.
- The store keeps only lookups: a tagged SHA-256 of the entry code and of the view key, and an HMAC of the recovery
  code under the series key, which never sits in the database.
- Typing accepts any case, spaces, any dash, and O, I or L for 0 and 1. Every code has exactly one spelling.
- Recovery takes effect after the delay (12 h by default, at least 6 h) or at the next checkpoint, whichever is later.
  The old code works and can cancel until then. A repeated request restarts the delay.
- `tests/vectors/buyerCodes.json` is computed independently with Python's standard library.
- The seven-word typed phrase moves to step 2: it needs a word list, and is tested against the code on the buyer
  pages.

# Progress

Build steps for the first beta. Each stage ends with `pnpm check` green; then the maintainer reviews and commits.

| Step                                                   | Stage                                                                       | Status                |
| ------------------------------------------------------ | --------------------------------------------------------------------------- | --------------------- |
| 1. Engine core                                         | 1a. Scaffold, conventions, allocation rules, tiebreak key, ordering, slices | Done                  |
|                                                        | 1b. Entry and offer windows, checkpoints, offers and backfill               | Done                  |
|                                                        | 1c. Buyer codes and delayed recovery                                        | Done                  |
|                                                        | 1d. Commitment (waitlist root, public draw ids) and beacon handling         | Done                  |
|                                                        | 1e. Hash-chained public log                                                 | Done                  |
|                                                        | 1f. Engine audit: hardening, continuity, hostile and property tests         | Done, awaiting review |
| 2. Buyer pages and vendor admin                        |                                                                             | Next                  |
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

## Stage 1d notes

- Each place has a tag from its current view key (replaced on recovery since stage 1f), and a new public draw id every
  draw, so published lists cannot be linked across draws while the entry code or view key can still find the place.
- The commitment holds the root of a Merkle tree over `(public draw id, priority)` leaves, the counts by priority,
  the settings digest, the protocol version and a quicknet round named at least 10 minutes ahead (by default the
  first round six hours after commit, to leave time for a public timestamp of the root).
- Beacon rounds are read by number only, from the pinned quicknet chain, and accepted only when the randomness is the
  SHA-256 of the signature and at least two endpoints agree. A late round is waited for, with a delay notice after an
  hour; a draw is voided only on a halt attested by two independent parties, at most twice, with the root frozen.
- A draw counts as timing-proven only if the root was timestamped before the round existed.
- `tests/vectors/waitlistCommitment.json` is computed independently with Python; `drandQuicknetRound1000000.json`
  holds real responses from two drand endpoints.
- Fetching from endpoints and timestamping the root are adapter work in step 3; the BLS signature check is in the
  public verifier, step 5.

## Stage 1e notes

- Each public event is an entry `(sequenceNumber, recordedAt, entryType, body, previousHash, entryHash)`; the hash
  covers the canonical JSON of the other five fields, so changing, removing, inserting or reordering any entry shows.
- Canonical JSON sorts keys at every level and allows only safe integers, well-formed strings and plain ASCII field
  names, so any language can reproduce it. `tests/vectors/publicLog.json` is computed independently with Python and
  includes escaped and non-ASCII text.
- A checkpoint is the entry count and the latest hash. A buyer's saved checkpoint can be checked against a later log,
  and two checkpoints of one size with different hashes prove a split view.
- Witness cosigning waits until witnesses exist; reposted checkpoints cover split views until then.
- This completes step 1: the engine core is pure domain code with no I/O.

## Stage 1f notes: engine audit

- Every time, count and duration is checked as a safe whole number, so NaN, infinities, fractions and unsafe
  integers are refused everywhere. Guards fail closed: a corrupt recovery time keeps the current codes.
- Fixed: duplicate entrants, units or places in draws and offers; a slice re-run, or one place under two ids across
  slices; negative-zero priorities; short entry and series keys; oversized typed codes; full-width characters in
  codes; duplicate or differently spelled beacon endpoints and attesters; a void while an endpoint had served the
  round; a repeated recovery request bringing the swap forward or skipping the six-hour minimum; malformed log
  entries, proofs and leaves from a hostile server crashing the verifier.
- Vendor continuity: withdrawn offers and offers lapsed through long outages never count against buyers; snapshots
  are validated before import (shape, times, rule, duplicates on every stored value, log chain); with no snapshot, a
  buyer's current entry code restores their place from the last published draw, following published recoveries,
  and replaced codes are refused.
- Performance (`pnpm bench`, Node on this machine): joining 0.45 ms, reading a code 0.002 ms, a proof from stored
  tree levels 0.05 ms for 50,000 places. Rebuilding the tree per proof took 514 ms and is now verifier-only.
- Rebuilt on typed values: branded times, durations, counts, priorities, rounds, hashes and keys made only by
  constructors, and parsers for every outside record. The scattered checks are gone; engine functions hold only
  domain rules. The draw now orders the committed leaves, as the verifier does.
- Tests: hostile numbers for every value constructor, junk for every parser, fail-closed checks, seeded property tests, vendor-continuity
  scenarios with `test.todo` markers for later steps, and a regression test for each finding of an independent
  adversarial audit.
- Priority-after-losses now drops a place back to the lowest priority after two offers in a row go unclaimed, so an
  abandoned or bot place stops taking the first offer every drop; withdrawn offers never count.
- Trade-offs left open: the void count and
  commitment time come from the caller, so the verifier counts voids from the log and "timing unproven" must be shown
  plainly; the verifier should reject duplicate JSON keys in a downloaded log.

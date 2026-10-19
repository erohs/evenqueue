# Decisions

Only decisions whose reasoning cannot be recovered from the code, and that someone might otherwise undo by mistake.
Versions live in `pnpm-lock.yaml`.

## Evenqueue serves DIY and community vendors only

There is no paid tier, no hosted service and no mainstream feature set. Each vendor deploys their own copy; the project
runs only a demo. Research before the build found no profitable route without outreach, and found that the controls
that stop bot farms (ID, phone, card checks) exclude the buyers this exists for. So the product reduces the speed
advantage of bots and stock monitors without collecting any personal data, and says plainly that it does not stop a
determined bot farm.

## Three allocation rules, with priority-after-losses as the default

In a simulation of repeated small restocks, a random draw where priority rises after each miss, capped at two levels,
had the smallest worst-case shortfall for any group of buyers, including people with intermittent internet access.
An uncapped version lets old places build an unbounded lead; a plain line starves newcomers and suits only a closed
group. Equal-chance-each-drop is kept for vendors who need newcomers to have fully equal odds.

One unclaimed offer leaves a place's priority unchanged, as the simulation assumed, but two in a row drop it back
to the lowest priority (changed 2026-10-19, after the engine audit). Otherwise a place nobody claims for, abandoned or
run by a bot, keeps top priority and takes the first offer every drop. Offers the vendor withdrew never count. A
buyer who misses one offer loses nothing; one who misses two climbs back after two losses.

## The random tiebreak key has a fixed, versioned layout

`SHA-256("evenqueue/random-tiebreak-key/v1" 0x00 ‖ beaconRandomness ‖ committedWaitlistRoot ‖ publicDrawId)`. The public
verifier and the WooCommerce connector must reproduce it, so changing it means a new version tag and new test vectors,
never an edit in place.

## Public draw ids and the waitlist root have fixed, versioned layouts

A place's tag is `SHA-256("evenqueue/place-tag/v1" 0x00 ‖ viewKey)`, from its current view key, so the view key as
well as the entry code can find the place in a published draw. It is replaced with the codes on recovery, so whoever
holds the current codes can always find, and if the database is lost restore, their place; the public `recovery` log
entry links the old and new public draw ids for the draw in progress.

Its public draw id is `SHA-256("evenqueue/public-draw-id/v1" 0x00 ‖ placeTag ‖ drawId)`. Leaves are
`SHA-256(0x00 ‖ publicDrawId ‖ priority as int32 big-endian)`, sorted by public draw id; nodes are
`SHA-256(0x01 ‖ left ‖ right)`, and an odd last node moves up unchanged. The public verifier must reproduce all of it,
so a change means a new protocol version and new vectors.

## Values are typed where they enter, so the engine never re-checks them

"Parse, don't validate". Times, durations, counts, priorities, beacon rounds, 32-byte hashes and server keys are
distinct types (`EpochMilliseconds`, `DurationMilliseconds`, `Count`, `Priority`, `BeaconRound`, `Bytes32Hex`,
`ServerKey`), each made only by one `to…` constructor, or by arithmetic helpers such as `addDuration` that return
the type. Records from outside (storage, backups, downloaded logs and proofs, endpoint replies) enter only through a
`parse…` or `read…` function that returns the typed value or every problem, and never throws. So NaN, infinities,
fractions, inverted gaps, duplicate places and malformed hashes cannot reach an engine function, and engine functions
contain only domain rules, not defensive checks. A higher layer cannot call the engine with a raw number or string:
the compiler refuses it.

Bounds make arithmetic safe by construction: a time is within a JavaScript Date's range and a duration is at most a
century, so sums stay exact. Collections that must not repeat are typed as sets and maps (`placeIdsInDrawOrder`,
`offersMadeByUnitNumber`, beacon readings by endpoint origin).

## A draw orders the committed leaves, not live places

The allocation rule fixes each place's priority once, when the draw is committed (`leavesForCommitment`). The draw
then orders exactly the published leaves, which is what the public verifier does too, so the two can never disagree,
and a recovery during a sliced close cannot give one place two ids. Slices are numbered: a slice already added is a
no-op, and a skipped one is refused. The root of an empty waitlist is SHA-256 of nothing, as in RFC 6962.

## Buyers join a drop on the terms its page showed

Once a drop opens, its entrant cap and entry window are fixed, not only once it is committed: buyers decided whether
and when to join on those terms, and the settings digest in the commitment covers them. A vendor who needs different
terms cancels the drop before commitment, which is logged, and opens a new one; places stay on the waitlist. Settings
that change how long buyers have, or where the form may be embedded, change only after a published 24-hour notice and
a fresh sign-in, and the offer window can only grow. Every setting must be given a change class, so a new one cannot be
added without deciding this.

The settings digest is `SHA-256("evenqueue/settings-digest/v1" 0x00 ‖ canonical JSON of {allocationRuleId,
shouldForgetPlacesAfterEachDrop, entrantCap, entryWindowMilliseconds})`. The public verifier recomputes it, so a
change means a new version tag and new vectors.

The lower bounds on the windows (24 hours to join, 12 to claim) are there for buyers with intermittent internet
access, who lose out under short windows; the offer window's upper bound of five days is the shortest time a card
payment stays valid.

## Every key comes from one root key

A 256-bit root key is made on first start and kept outside the database; the entry-codes key, the form-guard key and
each waitlist's key are derived from it with HKDF-SHA-256 and the info `evenqueue/server-key/<purpose>/v1`, a
waitlist's key with its own random salt. So a vendor never types a key, a database export never holds one, and
backing up the root key and the salts backs up every key. Deleting a waitlist's salt makes its recovery checks
unmatchable for good. Changing the derivation would break every stored recovery check, so it is pinned by vectors.

## A form check that fails asks the buyer to confirm, never turns them away

A form sent too quickly, an expired or missing token, or a filled hidden field all show a fresh form to confirm.
Autofill, screen readers and fast hands can trip any of these, and the people this serves must never be locked out by
a bot check. The checks only cost scripts a second round trip; resistance to guessing rests on the codes' length.

## A form's nonce names the place as well as the codes

The place id is derived from the form's nonce under the entry key, like the codes. A resent form therefore names the
same place and can never add a second one, even after a recovery has replaced the codes it first showed; in that case
the buyer is told the codes were replaced rather than shown codes that no longer work.

## The buyer pages need no framework and no script

The web layer is one function from a web-standard `Request` to a `Response`, with a small route table, so the same
code runs on Workers and Node and no framework needs upkeep. Pages are written only through an escaping `html`
template, and every page sends a Content-Security-Policy with no script source, so a page that needed JavaScript
would visibly fail rather than half-work. Every page is `no-store`, because each carries either codes or a form token,
and a cached token would give two buyers the same codes.

## QR codes come from a small encoder of our own

Buyer codes need only alphanumeric mode, level M and versions 1 to 3, so the encoder is about 20 short functions
rather than a dependency, keeping the engine free of runtime dependencies. It is checked module for module against
codes made by the segno library. segno pads with a whole zero byte when the terminator ends on a byte boundary, which
ISO/IEC 18004 section 7.4.9 does not; every buyer code hits that case, so the encoder follows the standard and the
vectors avoid the case. Scanners read both.

## The seven-word phrase does everything the entry code does

Some people keep words more easily than a code, so the phrase is a second form of the entry code, not a weaker
credential. Its list drops hyphenated words, which are easy to mistype, and gambling words such as "casino" or "jackpot", which
would make a waitlist look like a game of chance.
At about 90.5 bits it is below the bound for a plain hash, so only an HMAC under the waitlist key is stored.

## Browser tests pin Playwright to the installed browsers

Playwright is pinned to the release whose browser builds are already installed, and a pnpm override keeps
`@axe-core/playwright` on the same `playwright-core`, so the browser checks need no separate browser download. Move
Playwright, the override and the browsers together.

## A vendor's failure never costs a buyer their place

- An offer the vendor withdraws, or that lapses because outages ran past the window's extension limit, counts as
  `offer-withdrawn`: the same as not being offered, under every rule.
- A snapshot holds places, stored lookups and the public log, but no codes and no keys. Entry codes and view keys are
  looked up by unkeyed hashes, so they keep working on any host or domain. Recovery codes need the waitlist key, which
  needs its own backup.
- With no snapshot, a buyer's entry code alone restores their place from the last published draw, at the published
  priority. A place offered a unit in that draw is held for the vendor to check against sales, because the public
  record cannot show whether it bought. The view key cannot restore a place, so a helper cannot take it.

## Proofs are served from stored tree levels

Rebuilding the Merkle tree for one buyer's proof took about 500 ms for 10,180 places, far over the 10 ms CPU budget
of a Workers Free request. The close pipeline builds the levels once and stores them; a proof is then one read per
level, about 0.05 ms for 50,000 places. `pnpm bench` measures this and the other hot paths.

## Node's built-in test runner

The engine keeps zero runtime dependencies and as few development ones as possible, to keep yearly upkeep low, so it
uses `node:test` and `node:assert` rather than a test framework.

## Imports keep their `.ts` extension

Node runs the TypeScript directly with type stripping and no bundler, so every import names the file exactly.

## TypeScript 6

TypeScript 7 exists, but the pinned typescript-eslint is verified against 6. Move both together.

## MIT licence

PolyForm Small Business would have excluded large companies while admitting small sellers; PolyForm Noncommercial
would have excluded DIY vendors, because selling products is commercial use. MIT was chosen for simplicity and
compatibility. The WooCommerce connector is GPL-2.0-or-later because WordPress requires it.

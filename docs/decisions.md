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

## The random tiebreak key has a fixed, versioned layout

`SHA-256("evenqueue/random-tiebreak-key/v1" 0x00 ‖ beaconRandomness ‖ committedWaitlistRoot ‖ publicDrawId)`. The public
verifier and the WooCommerce connector must reproduce it, so changing it means a new version tag and new test vectors,
never an edit in place.

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

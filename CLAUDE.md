# Evenqueue

A privacy-first fair waitlist engine for DIY and community vendors. TypeScript, pnpm, Node 24, Cloudflare Workers.
`docs/decisions.md` records why things are the way they are.

Build in the order of `PROGRESS.md` and record progress there and in `features.json`.

## Working rules

- **Never commit or push.** A deny rule enforces this. At the end of each stage, stop, summarise what changed and how
  it was checked, and suggest a Conventional Commit message; the maintainer reviews and commits. Keep stages small
  enough to review.
- **Names say what things mean** in the vendor's and buyer's world. No shorthand codes in code.
- **No personal data at entry, ever.** No option may add a name, e-mail, phone or address to entry.
- **Every buyer page works without JavaScript** and meets WCAG 2.2 AA.
- **Readability over cleverness.** Functions 25 lines, files 400, both enforced. One concept per file.
- **The domain is pure:** `src/domain/` never imports an adapter, a use case or a Node built-in (lint enforces it),
  so the same code runs on Workers and Node.
- **Crypto:** WebCrypto only. No hand-written primitives on the request path.
- **Check a tool's current docs before using it**; this stack moves faster than training data.
- **Copy:** never "lottery", "raffle", "draw", "prize" or "winner" on buyer pages.
- **Before ending a stage:** `pnpm check` passes.

## Layout

Folders marked _(later)_ arrive in the step shown.

```
src/
  domain/                  #domain: pure rules, no I/O, clock or randomness of its own; the verifier imports it
    shared/                only purpose-named helpers, moved here once a second area needs them
      bytes/  validation/  ordering/
    waitlist/              a buyer's place
    allocation-rules/      who is offered first, and what happens to a place after a drop
    draw/                  ordering a draw from public inputs: tiebreak key, ranking, slices
    schedule/  offers/     windows, check-in times, offers, backfill            (later, 1b)
    credentials/           buyer codes, delayed recovery                         (later, 1c)
    commitment/  beacon/   waitlist root, public draw ids, beacon rounds         (later, 1d)
    public-log/            hash chain                                            (later, 1e)
  application/             #application: one folder per thing a person or a timer does   (later, 2)
    ports/interfaces/      IWaitlistStore, IClock, IBeaconSource, IKeyStore, IRateLimiter
    join-waitlist/  check-status/  claim-offer/  run-draw/  ...
  adapters/                #adapters: one folder per outside system, implementing ports  (later, 3)
    cloudflare-d1/  cloudflare-kv/  node-sqlite/  drand-http/  in-memory/
  web/                     #web: routes/, views/, styles/                         (later, 2)
  entry-points/            cloudflare-worker/main.ts, node-server/main.ts, verifier-cli/main.ts  (later)
tests/                     #tests
  support/                 shared fixtures
  vectors/                 JSON vectors shared with the verifier and the WooCommerce connector
  contracts/  e2e/         one store contract run against every adapter; Playwright   (later)
tools/file-layout/         the layout check behind `pnpm lint:files`
docs/decisions.md          decisions the code cannot explain
```

**Dependency direction** (ESLint enforces it): entry points → web → application → domain. Adapters implement
application ports. Only entry points connect adapters to use cases. The domain and application never import Node
built-ins.

**Imports:** a relative import stays inside its own area (`../functions/x.function.ts`); anything that crosses areas
uses an alias (`#domain/draw/functions/orderEntrantsForDraw.function.ts`).

**Files:** inside each area, files sit in kind folders (`functions/`, `consts/`, `interfaces/`, `types/`, `enums/`,
`tests/`), one export per file, named `name.function.ts`, `name.const.ts`, `IName.ts`, `Name.type.ts`, `Name.enum.ts`
and `name.spec.ts`. `pnpm lint:files` enforces it.

## Commits

Conventional Commits: `feat: add the join-order-line rule`. Never commit `.env`, keys, `notes/`, or anything holding
personal details.

## Delegating work

A subagent writes its findings to `notes/<task>.md` as it goes, not only in its final report, so the work survives if it
runs out of context. `notes/` is git-ignored.

## Conventions

`.claude/rules/` holds the detail, each file scoped to what it covers: `typescript.md`, `testing.md`, `styles.md`.

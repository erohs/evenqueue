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
- **Values are typed where they enter.** Make times, counts, hashes and keys with their `to…` constructor, and read
  stored or downloaded records with their `parse…` function. Never cast to a branded type, and never re-check a
  typed value inside the engine.
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
      bytes/  counting/  time/  parsing/  ordering/  text/
    waitlist/              a vendor's waitlist and a buyer's place on it
    drops/                 one release of units: its states, settings and when each setting may change
    form-guard/            signed time-trap tokens for the entry and recovery forms
    allocation-rules/      who is offered first, and what happens to a place after a drop
    draw/                  ordering a draw from public inputs: tiebreak key, ranking, slices
    schedule/              windows measured in uptime, check-in times (checkpoints)
    offers/                unit states, offers and backfill
    credentials/           buyer codes, delayed recovery
    commitment/            public draw ids, waitlist root, inclusion proofs, voids
    beacon/                the pinned drand chain, round times, reading endpoints, waiting rules
    public-log/            canonical JSON, the hash-chained log, checkpoints
    continuity/            snapshots and restoring places after a move, outage or lost database
  application/             #application: one folder per thing a person or a timer does
    ports/                 what use cases need from outside: stores, clock, random source, keys
    shared/                purpose-named helpers for several use cases: place-lookup/  form-checks/
    instance-keys/         the root key and every key derived from it
    join-waitlist/  check-status/  withdraw-place/  request-recovery/  cancel-recovery/  ...
  adapters/                #adapters: one folder per outside system, implementing ports
    in-memory/  web-platform/        cloudflare-d1/  cloudflare-kv/  node-sqlite/  drand-http/  (later, 3)
  web/                     #web: the buyer pages as one Request-to-Response handler
    html/  http/           the escaping template; headers, form reading
    views/  routes/        pages; the route table and one handler per route
    styles/                tokens.css and buyer.css, served beside the pages
  entry-points/            dev-server/main.ts (`pnpm dev`, in memory); cloudflare-worker/, node-server/,
                           verifier-cli/ (later)
tests/                     #tests
  support/                 shared fixtures
  vectors/                 JSON vectors shared with the verifier and the WooCommerce connector
  hostile-input/  properties/  scenarios/
  contracts/               one store contract run against every adapter
  e2e/                     Playwright, JavaScript on and off                            (later, 2c)
tools/file-layout/         the layout check behind `pnpm lint:files`
tools/benchmarks/          `pnpm bench`: hot paths against the 10 ms request budget
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

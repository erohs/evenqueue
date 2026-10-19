---
paths:
    - "**/*.spec.ts"
    - "tests/**"
---

# Testing

The runner is Node's built-in `node:test` with
`node:assert/strict`, so the engine needs no test framework.

A test earns its place by checking something the code decides: an ordering, a priority, a calculation, a state change.

| Level            | Where                                  | Runs against                            |
| ---------------- | -------------------------------------- | --------------------------------------- |
| Unit             | `src/domain/<area>/tests/name.spec.ts` | pure domain functions                   |
| Use case         | `src/application/<use-case>/tests/`    | the use case with in-memory adapters    |
| Adapter contract | `tests/contracts/name.spec.ts`         | one contract, run against every adapter |
| End to end       | `tests/e2e/name.spec.ts`               | Playwright, JavaScript on and off       |

A spec is named after the function or use case it tests. Shared fixtures live in `tests/support/`, in the same kind
folders as the source, and are imported through `#tests/`. Cross-implementation vectors are JSON in `tests/vectors/`,
shared with the verifier and the WooCommerce connector.

## Wording

Always `test`, never `it`. One `describe` per scenario, its title one sentence: the subject, then any context, then the
action. No nested `describe` blocks. A pure function has no state, so it skips `given`.

```ts
describe("Using the priority-after-losses rule, when a buyer misses out on a drop", () => {
    test("then it should raise their priority by one", () => {});
});
```

Two outcomes are two `then it should` tests, not one test with two assertions.

Test behaviour, not implementation. Fixed vectors for anything another implementation must reproduce (the verifier,
the WooCommerce connector) are computed independently, never by the code under test.

# Evenqueue

A privacy-first fair waitlist for DIY and community vendors who sell scarce restocks.

- **Fair:** buyers join a waitlist instead of racing a "buy" button, so bots and stock monitors lose their speed advantage. The order is drawn from public randomness, and anyone can check it.
- **Private:** entry takes no account, name, e-mail, phone or address. A buyer holds a code; the vendor never learns who entered.
- **Works without JavaScript**, and meets WCAG 2.2 AA.
- **Self-hosted:** each vendor runs their own copy on a free Cloudflare account or their own server. Nobody runs a shared service.

It reduces bot advantage; it does not stop a determined bot farm. Anything that would (ID, phone, card checks) excludes the buyers this exists for.

**Status:** in development, not yet released. The first release will be labelled "beta, not independently audited".

## Develop

Requires Node 24.16 or later and pnpm.

```sh
pnpm install
pnpm check    # type check, lint, formatting and tests
```

## Licence

MIT. See [LICENSE](LICENSE). The WooCommerce connector, in its own repository, is GPL-2.0-or-later as WordPress requires.

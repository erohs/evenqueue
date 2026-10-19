---
paths:
    - "**/*.css"
    - "src/web/**"
---

# CSS

Buyer and vendor pages are server-rendered HTML with no client framework; they
must work fully without JavaScript.

## Names

Short kebab-case classes, a `--variant` suffix where one block has variants. Style state through ARIA and `data-*`
attributes, not classes. A block-scoped custom property leads with the block (`--status-card-radius`).

## Tokens

`src/web/styles/tokens.css` holds them all, named category first (`--space-between-content`, `--font-size-heading`).
Few and general on purpose: pick the one whose name fits the job, and add one only when nothing fits. Space and type
are in rem; borders and radii are in px. Colours are `light-dark()` pairs, so the theme follows the system setting with
no script. Vendors customise through these tokens only.

## Accessibility

- Every text and background pair meets WCAG 2.2 AA in both themes.
- `:focus-visible` is always visible and never removed without a replacement.
- Honour `prefers-reduced-motion`, `forced-colors` and `prefers-contrast`.
- Generated content is decoration: give it empty alternative text (`content: "/" / ""`).
- Never reorder meaningful content with CSS; source order is reading order.
- Code fields accept paste and password managers (WCAG 2.2 SC 3.3.8).

## Layout and features

Logical properties throughout. No `!important`. Use a feature only once Chromium, Firefox and Safari all ship it, and
check first.

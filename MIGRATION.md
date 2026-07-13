# Migrating from mine.css v10 to v11

mine.css v11 modernizes the package around a CSS-only public API, native CSS
nesting, browser-controlled color preferences, and namespaced optional
components. Most documents that only load the main stylesheet and use semantic
HTML need few changes. Sites that imported the old JavaScript entry point, used
class-based theme overrides, or copied the old top-bar markup need to migrate.

## Upgrade

Update the dependency and its lockfile:

```sh
npm install mine.css@^11
```

If you load mine.css from a CDN, pin the same major version:

```html
<link rel="stylesheet" href="https://unpkg.com/mine.css@^11">
```

Run the rest of this guide before releasing the upgrade. v11 includes
intentional visual changes, so a successful build alone is not enough
verification.

## Breaking changes at a glance

| v10 behavior | v11 replacement |
| --- | --- |
| The package root exported the JavaScript theme switcher | The package root is the main CSS stylesheet |
| `theme-switcher.js`, `toggleTheme()`, and light/dark classes | The browser's `prefers-color-scheme` value |
| `.top-bar*` selectors from `top-bar.css` | Namespaced `.mine-top-bar*` selectors from `mine.css/dist/top-bar.css` |
| Published source, site, and JavaScript files | The published package contains `dist` only |
| PostCSS-transpiled compatibility | Distributed CSS uses native CSS nesting |
| Viewport-dependent `--font-size-scale` | Bounded `--font-size-body` |

## Replace JavaScript imports with CSS imports

The package no longer has a JavaScript entry point. The root package entry now
points to `dist/mine.css`, which makes the common CSS import the shortest one.

Before:

```js
import { toggleTheme } from 'mine.css'
// or
import { toggleTheme } from 'mine.css/dist/theme-switcher.js'
```

After, in CSS handled by your bundler:

```css
@import 'mine.css';
```

Or load the stylesheet from HTML:

```html
<link rel="stylesheet" href="/node_modules/mine.css/dist/mine.css">
```

Remove references to `theme-switcher.js`; it is not shipped in v11. Do not
deep-import files from `src`, because only `dist` is part of the published
package.

The optional layout and top bar remain separate stylesheets:

```css
@import 'mine.css';
@import 'mine.css/dist/layout.css';
@import 'mine.css/dist/top-bar.css';
```

Import only the companions your site uses.

## Follow the browser color preference

v11 removes the site-level light/dark override. Delete calls to
`toggleTheme()`, persisted theme values, theme-toggle controls, and CSS rules
that depend on `.light-mode` or `.dark-mode`. mine.css now has one source of
truth: the user's operating-system or browser preference.

Tell the browser that the document supports both palettes before styles load:

```html
<meta name="color-scheme" content="light dark">
```

Write application-specific dark styles with the same media query:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --app-panel-background: #292929;
  }
}
```

Do not recreate the removed mode classes around mine.css variables. Users who
need a different preference can use their browser or operating-system
appearance setting. Dark Reader is a reasonable per-site fallback where a
browser does not expose one, although it transforms colors rather than changing
`prefers-color-scheme`.

### Update syntax highlighting

If Highlight.js currently uses one dark stylesheet in both modes, load a light
theme first and a dark theme conditionally:

```html
<link rel="stylesheet" href="/highlight.js/styles/github.css">
<link
  rel="stylesheet"
  href="/highlight.js/styles/github-dark-dimmed.css"
  media="(prefers-color-scheme: dark)"
>
```

The equivalent bundler imports are:

```css
@import url("highlight.js/styles/github.css");
@import url("highlight.js/styles/github-dark-dimmed.css") (prefers-color-scheme: dark);
```

### Keep named themes separate from light and dark mode

v11 theme sidecars may use `data-mine-theme` to select a named palette. This is
not a light/dark override: every named theme still supplies both palettes and
lets `prefers-color-scheme` choose between them.

For example, load and select the optional Tron theme with:

```html
<!doctype html>
<html lang="en" data-mine-theme="tron">
  <head>
    <link rel="stylesheet" href="https://unpkg.com/mine.css@^11">
    <link rel="stylesheet" href="https://unpkg.com/mine.css@^11/dist/themes/tron-legacy.css">
  </head>
  <body>...</body>
</html>
```

Remove the attribute to use mine.css's default palette. Matching Highlight.js
colors now live in a separate sidecar and use their own selector:

```html
<html lang="en" data-hljs-theme="tron">
  <head>
    <link rel="stylesheet" href="https://unpkg.com/mine.css@^11/dist/highlight.js/tron-legacy.css">
  </head>
</html>
```

The two themes can be selected independently. A site that changes both from
one menu should update both `data-mine-theme` and `data-hljs-theme`. If the site
also offers default Highlight.js colors, load those styles before the Tron
Highlight.js sidecar.

## Rename top-bar selectors

The optional top bar is now a small, namespaced reimplementation inspired by
`top-bar.css`. Replace the old selectors rather than mixing both versions.

| v10 selector | v11 selector |
| --- | --- |
| `.top-bar` | `.mine-top-bar` |
| `.top-bar-title` | `.mine-top-bar-title` |
| `.top-bar-link` | `.mine-top-bar-link` |
| `.top-bar-right` | `.mine-top-bar-right` |
| `.current-page` | `.mine-top-bar-link-current` |

Wrap each link's visible text in `.mine-top-bar-label`. The wrapper creates the
compact hover treatment without enlarging the link's layout or hit-area
spacing.

```html
<nav class="mine-top-bar" aria-label="Primary">
  <div class="mine-top-bar-title">
    <a href="/">
      <span class="mine-top-bar-label">mine.css</span>
    </a>
  </div>
  <a class="mine-top-bar-link mine-top-bar-link-current" href="/guide/" aria-current="page">
    <span class="mine-top-bar-label">Guide</span>
  </a>
  <div class="mine-top-bar-right">
    <a class="mine-top-bar-link" href="/about/">
      <span class="mine-top-bar-label">About</span>
    </a>
  </div>
</nav>
```

The top bar scrolls horizontally on narrow screens and deliberately hides its
scrollbar. Test keyboard access to every item and test the bar at the narrowest
viewport your site supports.

## Review custom properties

The body font size is now bounded so it cannot grow indefinitely with viewport
width:

```css
:root {
  --font-size-body: clamp(1rem, calc(0.95rem + 0.2vw), 1.125rem);
}
```

Remove overrides of the deleted `--font-size-scale` property. Override
`--font-size-body` directly if the new default does not suit the document.

v11 also adds separate control-border colors and a theme-agnostic alias:

```css
:root {
  --light-control-border: #949494;
  --dark-control-border: #6b6b6b;
  --control-border: var(--light-control-border);
}

@media (prefers-color-scheme: dark) {
  :root {
    --control-border: var(--dark-control-border);
  }
}
```

When overriding colors, define both the light and dark source variables. Use
the theme-agnostic variables such as `--text`, `--background`,
`--control-border`, and `--code-background` in component rules.

Raised fieldsets, code panels, and framed media now share one customizable
depth recipe. It uses translucent black and white, so it adapts without
separate light and dark values:

```css
:root {
  --surface-shadow: none;
}
```

Print automatically sets `--surface-shadow` to `none`.

## Account for layout and visual changes

The optional `.mine-layout` measure grows from `46em` to `56em`. It uses
logical sizing, includes padding in its width, and no longer clips overflowing
content. The `.safe-area-inset` utility now preserves its normal gutter when a
device safe-area inset is smaller.

Review pages that depend on the old line length or clipping behavior,
especially wide code blocks, tables, positioned descendants, and custom focus
rings.

Other intentional refinements include:

- accessible link colors and clearer focus treatment in both palettes;
- softer, depth-based borders for controls, code, fieldsets, keyboard keys, and
  framed media;
- native button appearance instead of custom button styling;
- consistent form-control and fieldset spacing;
- improved code-block rhythm and horizontal overflow behavior;
- complete light, dark, and print color assignments.

Avoid restoring v10's button styling or heavy high-contrast borders as part of
the migration. Prefer small site-specific overrides when the new defaults do
not fit a particular design.

## Check browser support

The distributed v11 stylesheet uses native CSS nesting. Its Browserslist
contract is:

```text
supports css-nesting
```

If your supported browser set does not satisfy that query, transpile a separate
application build with an appropriate CSS tool. Do not modify the installed
package or assume that v11 includes a legacy build.

The package's Node.js and npm engine requirements apply to developing and
building mine.css itself. Loading the published CSS does not require Node.js in
the browser.

## Verification checklist

Before completing the upgrade:

- Search for `theme-switcher`, `toggleTheme`, `.light-mode`, `.dark-mode`, and
  the old `.top-bar` selectors; remove or migrate every relevant match.
- Confirm the package root is consumed as CSS, not JavaScript.
- Confirm optional layout and top-bar stylesheets are imported explicitly.
- Run the consuming project's formatter, linter, build, and tests.
- Inspect representative pages in both light and dark system modes.
- Inspect print preview if the site prints articles, documentation, or forms.
- Navigate links and controls with the keyboard and confirm focus remains
  visible.
- Check forms, fieldsets, code blocks, tables, blockquotes, and framed figures.
- Check a narrow mobile viewport and a wide desktop viewport for unexpected
  overflow or line-length changes.
- Update screenshots or snapshots only after confirming that their visual
  differences are intentional.

The semantic, classless HTML API remains the same. A page that only loads
`mine.css` and uses ordinary document elements should generally migrate by
updating the dependency and visually verifying the result.

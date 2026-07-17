# Migrating from mine.css v10 to v11

mine.css v11 modernizes the package around a CSS-only public API, native CSS
nesting, a low-priority cascade layer, browser-controlled color preferences,
and namespaced optional components. Most documents that only load the main
stylesheet and use semantic HTML need few changes. Sites that imported the old
JavaScript entry point, used class-based theme overrides, or copied the old
top-bar markup need to migrate.

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
| Unlayered framework rules | The main stylesheet lives in the named `mine` cascade layer |
| Viewport-dependent `--font-size-scale` | Bounded `--font-size-body` |
| No declared Node.js or npm engines | Package metadata requires Node.js 22 or newer and npm 10 or newer |

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

## Review cascade layer order

v11 places the main stylesheet inside a named `mine` cascade layer, following
[Mayank's layered reset technique](https://mayank.co/blog/css-reset-layer/).
For normal declarations, every unlayered site rule now takes priority over
mine.css even when mine.css has the more specific selector or loads later. Most
sites need no changes; their existing unlayered overrides become more reliable.

If the application also uses cascade layers, declare `mine` before the layers
that should override it:

```css
@layer mine, app;

@import 'mine.css';

@layer app {
  :root { --font-size-body: 1rem; }
  h1 { font-weight: 700; }
}
```

Do not write `@import 'mine.css' layer(mine)`: the distributed stylesheet
already defines that layer, so wrapping the import would create unnecessary
layer nesting.

The optional layout and top-bar stylesheets remain unlayered to preserve their
existing standalone behavior. Sites using CSS imports can place optional
styles in a distinct layer between the framework defaults and application
styles:

```css
@layer mine, sidecar, app;

@import 'mine.css';
@import 'mine.css/dist/layout.css' layer(sidecar);
@import 'mine.css/dist/top-bar.css' layer(sidecar);
```

Use the same `layer(sidecar)` import syntax for named color or syntax themes.
If a Highlight.js base theme and a mine.css syntax sidecar compete for the same
selectors, layer both and order the syntax sidecar after the base theme.

Audit any rules that intentionally depended on mine.css overriding application
styles. Move those application rules into a layer ordered after `mine`, or
leave them unlayered. Test the resulting cascade in browser developer tools as
well as checking the final visual output.

## Review document behavior and motion

v11 makes the native `hidden` attribute authoritative even when another rule
assigns `display`. Remove `hidden` when content should be shown instead of
overriding its display. The searchable `hidden="until-found"` state remains
available to supporting browsers.

Use the new `.visually-hidden` helper when content should remain available to
assistive technology without being painted. Focusable content using the helper
becomes visible when focused or active, so it also works for skip links:

```html
<a class="visually-hidden" href="#main">Skip to main content</a>
```

Fragment destinations now reserve scroll space above themselves. When the
reader has not requested reduced motion, same-origin page navigations may use
view transitions and in-page links—including footnotes—scroll smoothly. The
browser still provides visible keyboard focus, while programmatically focused
fragment targets do not receive a page-wide block outline.

To disable the motion defaults for every reader, override them after mine.css:

```css
@import 'mine.css';

@view-transition { navigation: none; }

html {
  interpolate-size: numeric-only;
  scroll-behavior: auto;
}
```

Do not remove mine.css's `prefers-reduced-motion` handling when adding custom
motion. Test fragment navigation with both reduced-motion settings.

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
The [color-theme catalog](./README.md#color-themes) lists every maintained
family, selector, light/dark pairing, and upstream palette reference.

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

Remove the attribute to use mine.css's default palette.
Matching Highlight.js colors live in a separate, unscoped stylesheet using the standard Highlight.js selectors:

```html
<link
  data-mine-hljs-stylesheet
  rel="stylesheet"
  href="https://unpkg.com/mine.css@^11/dist/highlight.js/tron-legacy/index.css"
>
```

`tron-legacy/index.css` is the adaptive convenience entry point: it loads `light.css` normally and `dark.css` under `prefers-color-scheme: dark`.
Import either fixed file directly when the application needs to select syntax mode independently of the browser setting.

The document and syntax themes can also be selected independently.
A site that changes both from one menu should update `data-mine-theme` and the syntax stylesheet's `href`.
Load only one Highlight.js theme stylesheet at a time because upstream and Mine's custom themes intentionally share the same unscoped selectors.

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

If the top bar should extend to display cutout edges while keeping its controls
inside the safe area, allow the document viewport to cover those areas:

```html
<meta
  name="viewport"
  content="width=device-width, initial-scale=1, viewport-fit=cover"
>
```

The sidecar supplies the corresponding safe-area padding and uses
`--translucent-background` for its glass surface. Keep a normal viewport when
the application does not want content or surfaces to enter display cutouts.

## Review custom properties

The body font size is bounded so it cannot grow indefinitely with viewport
width. Supporting browsers snap the fluid value to whole CSS pixels:

```css
:root {
  --font-size-body: clamp(1rem, calc(0.95rem + 0.2vi), 1.25rem);

  @supports (font-size: round(1rem, 1px)) {
    --font-size-body: clamp(
      1rem,
      round(nearest, calc(0.95rem + 0.2vi), 1px),
      1.25rem
    );
  }
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

The v11 palette also exposes light, dark, and semantic validity colors, plus a
reusable translucent surface derived from the active background:

```css
:root {
  --light-valid: #238b5a;
  --light-invalid: #d02533;
  --dark-valid: #69d3a2;
  --dark-invalid: #ed6e78;

  --valid: var(--light-valid);
  --invalid: var(--light-invalid);
  --translucent-background: color-mix(
    in srgb,
    var(--background) 75%,
    transparent
  );
}

@media (prefers-color-scheme: dark) {
  :root {
    --valid: var(--dark-valid);
    --invalid: var(--dark-invalid);
  }
}
```

Override the light and dark source variables when customizing validation
colors. Use `--valid`, `--invalid`, and `--translucent-background` in
components so they continue to follow the active palette.

Raised fieldsets, code panels, and framed media now share one customizable
depth recipe. It uses translucent black and white, so it adapts without
separate light and dark values:

```css
:root {
  --surface-shadow: none;
}
```

Print automatically sets `--surface-shadow` to `none`.

The system stacks now prefer the standardized `ui-sans-serif`, `ui-serif`,
`ui-monospace`, and `ui-rounded` generic families before a smaller set of
durable platform fallbacks. Recheck typography if the site depended on one of
the old stack's intermediate faces; override `--system-*` or `--font-*` rather
than editing the distributed stylesheet.

## Audit form controls

v11 gives `select` the same recessed surface, typography, sizing, disabled
state, and focus treatment as textual inputs and textareas. It keeps native
picker indicators intact, including the datalist and select affordances. Remove
competing appearance resets or custom chevrons unless the application truly
owns the complete control.

The form defaults also:

- normalize placeholder color, opacity, and text fill in Safari;
- keep empty date, month, week, time, and local date-time controls the same
  height as populated controls, including on iOS Safari;
- show `:user-valid` and `:user-invalid` state colors only after user
  interaction, and only on relevant, editable controls;
- dim disabled image inputs;
- keep multiple-select rows spaced and use a quiet selected color;
- let a textarea without authored `rows` or `cols` grow with its content using
  `field-sizing: content` in supporting browsers.

Existing rules for `select`, `::placeholder`, validation pseudo-classes, or
control shadows may now overlap the framework. Keep intentional application
rules after mine.css and check them in both color schemes. Customize validation
through the `--light-valid`, `--dark-valid`, `--light-invalid`, and
`--dark-invalid` source variables rather than replacing the state selectors.

Text inputs remain fixed-size by default. Add the opt-in class when a field
should grow with its value without becoming narrower than the standard field:

```html
<input class="content-sized" name="title" value="A short title">
```

Keep `rows` or `cols` on textareas whose authored dimensions must remain fixed.
Browsers without `field-sizing` support retain a usable fixed-size fallback.

## Preserve table semantics

v11 leaves `table` at its native display type. A table no longer becomes its
own generic scrolling block, which preserves table semantics but means a wide
table needs an explicit overflow container. Give that container an accessible
name and keyboard focus:

```html
<div role="region" aria-labelledby="plans-caption" tabindex="0">
  <table>
    <caption id="plans-caption">Plan comparison</caption>
    <!-- rows and cells -->
  </table>
</div>
```

Use a unique caption ID for each table. The fully named and focusable region is
the scroll container and receives a visible focus ring; the table retains its
native structure. Do not restore `display: block` or overflow directly on the
table. Tables that fit their container need no wrapper.

## Account for layout and visual changes

The optional `.mine-layout` measure grows from `46em` to `56em`.
It uses logical sizing, includes padding in its width, tightens its block margin on narrow viewports, no longer clips overflowing content, and protects its inline edges from device safe areas without requiring another class.
The `.safe-area-inset` utility protects all four physical edges and preserves its normal inline gutter when a device safe-area inset is smaller.

Review pages that depend on the old line length or clipping behavior,
especially wide code blocks, tables, positioned descendants, and custom focus
rings.

Typography now favors readable wrapping and rhythm: prose is bounded to `88ch`,
headings balance short lines, and supporting browsers use hanging punctuation.
Heading, horizontal-rule, figure, and code-block spacing changed, so check
fragment offsets and any adjacent selectors that assumed browser-default
margins.

Media defaults are more deliberate. Images, video, audio, canvas, and iframes
stay within their container; video has a quiet unloaded background; audio fills
the available inline measure; and iframes receive the same raised frame as
other embedded surfaces. Figures shrink-wrap their media, center themselves,
and constrain long captions. Override authored dimensions or framing after
mine.css where an embed needs different behavior.

The existing `figure.borderless` opt-out removes the media border, padding, and
shadow while retaining rounded corners. Borderless images now use a transparent
background so an image's own transparency is not replaced by the framework's
layer color.

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

The package metadata requires Node.js 22 or newer and npm 10 or newer. Package
managers may check those requirements while installing mine.css, even though
the package's browser API is CSS-only. Loading the published CSS directly does
not require Node.js in the browser.

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
- Follow in-page and footnote links with reduced motion both enabled and
  disabled; confirm the destination is visible below sticky navigation.
- Check placeholders, empty and populated temporal inputs, selects, multiple
  selects, validation states, content-sized fields, textareas, and disabled
  controls in Safari as well as a Chromium browser.
- Check fieldsets, code blocks, blockquotes, horizontal rules, framed and
  borderless figures, unloaded video, audio, canvas, and iframes.
- Check wide tables through their named, keyboard-focusable overflow wrappers.
- Check a narrow mobile viewport and a wide desktop viewport for unexpected
  overflow or line-length changes.
- Update screenshots or snapshots only after confirming that their visual
  differences are intentional.

The semantic, classless HTML API remains the same. A page that only loads
`mine.css` and uses ordinary document elements should generally migrate by
updating the dependency and visually verifying the result.

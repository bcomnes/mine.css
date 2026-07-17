---
name: migrate-mine-css-v11
description: Migrate websites and packages from mine.css v10 or earlier to v11. Use when upgrading the mine.css dependency, replacing the removed JavaScript theme-switcher entry point, removing class-based light and dark overrides, renaming top-bar selectors, updating cascade, layout, form, media, or theme behavior, or verifying a site against the v11 browser and visual contracts.
---

# Migrate mine.css to v11

Use this workflow to upgrade a consuming project while preserving its intended
design and behavior. Read `../../../MIGRATION.md` completely before editing; it
is the canonical description of the v11 contract.

## Inspect the consumer

Read the package manifests, lockfiles, stylesheet entry points, document
templates, and project-native contributor instructions. Establish the current
test and build commands before changing dependencies.

Search for the affected API surface. Adjust paths to the project as needed:

```sh
rg -n "mine\.css|theme-switcher|toggleTheme|light-mode|dark-mode|top-bar|font-size-scale|@layer|field-sizing|content-sized" .
```

Identify:

- the installed mine.css version and package manager;
- JavaScript or CSS imports of the package root and deep imports;
- theme-toggle code, persisted theme values, and mode classes;
- optional layout and top-bar usage;
- mine.css custom-property overrides;
- syntax-highlighting styles and application-specific dark styles;
- named document theme sidecars selected with `data-mine-theme`, syntax theme stylesheet links, and code that changes either selection;
- cascade-layer declarations and assumptions about stylesheet order or
  specificity;
- custom form-control, placeholder, validation-state, and table-overflow rules;
- fragment navigation, smooth scrolling, view transitions, and hidden-content
  helpers;
- the consuming project's browser-support policy.

Run the project's existing checks and capture representative light and dark
screenshots when practical. A baseline makes deliberate v11 changes easier to
distinguish from regressions.

## Apply the migration

1. Update mine.css to v11 with the project's existing package manager and
   update its lockfile.
2. Consume the package root as CSS. Remove imports of
   `dist/theme-switcher.js` and any expectation that the package root resolves
   to JavaScript.
3. Review the consumer's cascade. The main stylesheet already lives in the
   low-priority `mine` layer, so import it normally. Leave application
   overrides unlayered, or declare `mine` before the application's layers.
   Optional layout, top-bar, color-theme, and syntax-theme sidecars may be
   imported into an explicitly ordered `sidecar` or `theme` layer.
4. Remove `toggleTheme()`, stored theme state, `.light-mode` and `.dark-mode`
   overrides, and site-level theme controls. Add the `color-scheme` metadata and
   use `prefers-color-scheme` for application-specific dark rules.
5. If syntax highlighting uses one palette, load a light theme normally and a
   dark theme with the same media query.
6. Keep `dist/layout.css` and `dist/top-bar.css` as explicit optional imports.
   If the top bar is used, apply every selector rename and add
   `.mine-top-bar-label` around visible link labels. Add `viewport-fit=cover`
   only when its translucent surface should extend into display cutouts; the
   sidecar keeps controls inside the safe area.
7. Remove `--font-size-scale` overrides. Review `--font-size-body`, the modern
   `--system-*` stacks, light and dark color sources, `--control-border`,
   `--valid`, `--invalid`, `--translucent-background`, and the shared
   `--surface-shadow` used by raised panels.
8. Audit form overrides. Selects now share textual-input styling; placeholders
   and empty temporal controls have stable Safari behavior; validation uses
   `:user-valid` and `:user-invalid`; unsized textareas may grow using
   `field-sizing`; and `input.content-sized` opts a text field into intrinsic
   growth.
9. Keep tables at their native display type. When a table can overflow, put it
   in a uniquely named, keyboard-focusable
   `[role="region"][aria-labelledby][tabindex]` wrapper instead of applying
   block display or scrolling to the table itself.
10. Review assumptions affected by the wider `.mine-layout`, visible overflow,
    safe-area gutters, responsive type and prose measures, native button
    appearance, media framing, and native CSS nesting.
11. Preserve native `hidden` behavior and use `.visually-hidden` for
    assistive-only content. Review fragment offsets and the motion defaults,
    including smooth in-page navigation and same-origin view transitions under
    `prefers-reduced-motion: no-preference`.
12. Preserve named palette selection separately from light/dark mode. A
   `data-mine-theme` value may select a sidecar such as Tron, but each named
   theme must still follow `prefers-color-scheme` for its light and dark values.
13. Keep optional Highlight.js palettes separate from document palettes. The adaptive Tron syntax sidecar lives at `dist/highlight.js/tron-legacy.css` and uses the same unscoped `.hljs-*` selectors as upstream Highlight.js. Load only one syntax stylesheet at a time, and switch its `<link href>` when the application owns syntax-theme selection. Its fixed light and dark counterparts can be imported directly when the application owns syntax-mode selection. Update both `data-mine-theme` and the syntax stylesheet link only when one control should change both palettes.

Keep edits scoped to the migration. Preserve application-specific branding and
behavior unless it conflicts with the removed v10 API.

## Guardrails

- Do not restore the deleted mine.css theme-switcher JavaScript.
- Do not recreate class-based light/dark overrides; follow the browser setting.
- Do not treat `data-mine-theme` as a light/dark switch. It selects a named
  palette only.
- Do not assume `data-mine-theme` also selects a Highlight.js palette. Syntax themes are independent stylesheets with standard, unscoped `.hljs-*` selectors.
- Do not load multiple Mine or upstream Highlight.js theme stylesheets at once. Switch one stylesheet link or arrange fixed light and dark files with mutually exclusive media queries.
- Do not add custom button styling merely to reproduce v10. v11 intentionally
  keeps native buttons.
- Do not assume the optional layout or top bar is bundled into the main
  stylesheet.
- Do not wrap the package-root import in `layer(mine)`; the distributed main
  stylesheet already defines that layer.
- Do not restore `display: block` or scrolling directly on `table`. Put wide
  tables in an accessible overflow region.
- Do not override `[hidden]` to reveal content; remove the attribute when the
  content is no longer hidden.
- Do not deep-import `src`; the published package contains `dist` only.
- Do not rewrite v11's distributed CSS for older browsers. If the consumer
  needs a pre-nesting browser, transpile a separate application build.
- Do not update visual snapshots blindly. Inspect the changed state first.

## Verify the result

Run the consuming project's install, formatter, linter, build, unit tests, and
browser tests using its native commands. Then inspect representative content:

- light and dark browser preferences;
- print preview where relevant;
- keyboard focus on links and form controls;
- placeholders, empty temporal inputs, selects, multiple selects, validation
  states, content-sized inputs, textareas, and disabled controls;
- fieldsets, code, keyboard keys, blockquotes, horizontal rules, framed figures,
  unloaded video, audio, canvas, and iframes;
- wide tables in named, keyboard-focusable overflow regions;
- fragment and footnote navigation with reduced motion enabled and disabled;
- narrow mobile and wide desktop layouts;
- horizontal overflow in code, tables, and the optional top bar.

Repeat the affected-surface search and explain any intentional matches that
remain. Report migrated files, verification performed, deliberate visual
changes, and any checks that could not be run.

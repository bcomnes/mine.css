# mine.css framework audit

Audit date: 2026-07-10  
Reviewed commit: `3e423a0` (`master`)  
Scope: framework CSS, optional layout CSS, theme/type switcher, generated distribution, style guide, documentation, package contents, and build/test setup.

> Resolution status: all findings below describe the audited base commit. They have been addressed on `bret/lean-modern-cleanup`; the mapping at the end of this report records the implementation commits.

## Executive summary

`mine.css` is pleasantly small and easy to follow. Its source organization, central theme tokens, restrained selector specificity, readable measure, responsive images, scrollable code/tables, and reliance on native controls are all good foundations.

The highest-value work is correctness and accessibility rather than a redesign:

1. Fix the undefined dark-mode layer color; it currently invalidates the keyboard-key gradient and any other declaration that consumes it.
2. Rework the light palette to meet WCAG contrast requirements, especially links, muted text, and input borders.
3. Make print mode explicitly light instead of allowing a dark screen preference/class to leak onto paper.
4. Fix the `toggleType()` custom-storage-key bug.
5. Remove the clipping behavior from `.mine-layout` and make safe-area padding additive.
6. Decide and document the browser-support contract: the distributed CSS contains native nesting, but the effective Browserslist still includes browsers that cannot parse it.

The width-dependent font sizing is not inherently wrong, but the current formula is unbounded and anchored in pixels. It makes typography grow forever with the viewport and partially bypasses the reader's default font-size preference. A capped, `rem`-anchored scale—or simply `1rem`—would be a better default for a classless document stylesheet.

## Prioritized findings

### 1. High — `--dark-layer-background` resolves to an undefined token

Evidence:

- `src/variables.css:34` declares `--dark-layer-background: var(--transparent)`.
- `--transparent` is not declared anywhere in the repository.
- `--layer-background` is consumed by figure media in `src/typography/figures.css:6` and by both the color stops of the `kbd` gradient in `src/typography/keyboard.css:4-5`.
- A computed-style check in dark mode returned an empty `--layer-background`; the `kbd` background color became transparent and `background-image` became `none`.

This is not just equivalent to intentionally choosing transparent. An unresolved custom property makes the declaration using it invalid at computed-value time; a compound value such as the gradient is discarded.

Recommendation: set `--dark-layer-background: transparent`, or define a real `--transparent` primitive before using it. Prefer a direct `transparent` value unless that primitive will be reused meaningfully.

### 2. High — several light-theme colors miss WCAG AA contrast

Contrast ratios calculated from the shipped tokens:

| Use | Colors | Ratio | Relevant target |
| --- | --- | ---: | ---: |
| Light link text | `#0088ff` on `#fff` | 3.52:1 | 4.5:1 for normal text |
| Light muted text | `#7d7d7d` on `#fff` | 4.12:1 | 4.5:1 for normal text |
| Light input/fieldset border | `#d6d6d6` on `#fff` | 1.45:1 | 3:1 when the boundary identifies the control |
| Dark input/fieldset border | `#4d4d4d` on `#1f1f1f` | 1.95:1 | 3:1 when the boundary identifies the control |

The muted token is used for normal blockquote text, `h6`, and the smaller `figcaption`, so this is not limited to decorative text. The text inputs use the same background as the page, making their low-contrast border the main visible boundary.

WCAG 2.2 requires 4.5:1 for normal text and its guidance specifically calls out a text-input border below 3:1 as insufficient when that border identifies the input: [WCAG 2.2 contrast minimum](https://www.w3.org/TR/WCAG22/#contrast-minimum) and [non-text contrast guidance](https://www.w3.org/WAI/WCAG22/Understanding/non-text-contrast).

Recommendation:

- Darken the light link and muted-text tokens enough to clear 4.5:1 on white.
- Give control boundaries their own semantic token instead of making `--accent-midground` serve borders, rules, and general decoration.
- Target at least 3:1 for an input boundary in both themes.
- Consider underlining links by default. This improves recognition, though it does not replace the text-to-background contrast requirement.
- Add automated contrast assertions for every foreground/background token pair.

### 3. High — print mode does not reset the dark palette

`src/variables.css:87-98` darkens only the accent tokens for print. It does not reset `--text`, `--background`, `--link-text`, `--mark-background`, `--code-text`, or `color-scheme`. It also changes only the light code aliases, which do not help when `--code-background` and `--code-border` point at the dark aliases.

Consequences:

- A dark OS preference or an explicit `.dark-mode` class can retain a dark page background and light text during printing.
- If the browser does not print backgrounds, light text can become especially fragile or disappear.
- Printed code blocks are not guaranteed to use the intended print accents.

Recommendation: inside `@media print`, set the theme-agnostic tokens directly to a complete light print palette and use `color-scheme: light`. Add a print-emulation check to the test suite.

### 4. Medium — `toggleType()` ignores its custom key when reading

`src/theme-switcher.js:70` accepts `settingsKey`, but line 71 always reads `mine-type-scheme`. It then writes to the supplied key and calls `setType()` with that key.

For example, `toggleType('article', 'article-type')` reads one key, writes another, and therefore repeatedly transitions from stale/default state instead of cycling the custom setting.

Recommendation: read `window.sessionStorage.getItem(settingsKey)`. Add a small unit test for the default key and a custom key.

### 5. Medium — `.mine-layout` hides overflow that should remain visible

`src/layout.css:6` applies `overflow: hidden` to the entire document container. That can clip focus rings, shadows, positioned callouts, popovers, and other intentional overflow. It also creates a scroll container, which can change the containing behavior of sticky descendants. Long words are already addressed with `overflow-wrap`, while code blocks and tables have their own scrolling rules.

The general CSS guidance is to avoid hiding overflow merely to make an example look tidy because doing so can lose content: [MDN on wrapping and breaking text](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Text/Wrapping_breaking_text).

Recommendation: remove `overflow: hidden`. If one specific descendant causes horizontal overflow, constrain that descendant rather than the document wrapper.

### 6. Medium — safe-area padding replaces normal padding instead of extending it

`src/layout.css:14-16` assigns all four padding sides directly from `env(safe-area-inset-*)`. Those values are `0` on an ordinary rectangular viewport. If `.safe-area-inset` and `.mine-layout` are used on the same element, the later rule replaces the layout's `0 1em` gutter with zeros. Even on a notched display it provides only the notch clearance, not the desired gutter plus the clearance.

MDN's safe-area example adds the inset to baseline padding, e.g. `calc(1em + env(safe-area-inset-bottom))`: [MDN `env()`](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Values/env).

Recommendation: make it additive, for example with `max(1em, env(safe-area-inset-left))`/`max(1em, env(safe-area-inset-right))`, or separate safe-area variables from the component's base padding.

Also note that `dist/layout.css` is not truly standalone: `.mine-layout { width: 100%; padding-inline: 1em; }` relies on the box-sizing reset from the main stylesheet to avoid becoming wider than the viewport, and the font utility classes rely on variables defined by the main stylesheet. Either make the optional asset self-contained or document that it must be loaded after `mine.css`.

### 7. Medium — body font size grows forever with viewport width

The root size is:

```css
font-size: calc(14px + 0.25vw);
```

Observed/calculated sizes:

| Viewport | Root size | `h1` size |
| ---: | ---: | ---: |
| 320px | 14.8px | 40.7px |
| 1280px | 17.2px | 47.3px |
| 2560px | 20.4px | 56.1px |
| 3840px | 23.6px | 64.9px |

The `46em` measure keeps the line length fairly stable, which is the strongest argument for the current approach. The drawbacks are that type keeps growing on ultrawide displays even though reading distance may not change, and the `14px` anchor does not honor a user's chosen browser default as well as `rem` does. MDN recommends relative font-size units for inclusive design: [MDN `font-size` accessibility](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/font-size#accessibility).

Recommended options, in order of simplicity:

1. Use `1rem` and let readers/browsers choose the base.
2. If subtle fluid type is part of the identity, use one capped token such as `--font-size-body: clamp(1rem, calc(0.95rem + 0.2vw), 1.125rem)`.
3. Keep `--font-size-body` as the public override and make any fluid behavior opt-in rather than splitting the result across `--font-size-body` and `--font-size-scale`.

Whichever option wins, cap heading sizes independently so a large root does not compound into oversized headings.

### 8. Medium — the stated/effective browser targets disagree with the CSS shipped

Version 10 intentionally removed the nesting transform, and `dist/mine.css` now contains native nested rules such as `&:hover` and `& > code`. Native nesting is parsed by the browser, not compiled away: [MDN CSS nesting](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Nesting/Using).

There is no explicit Browserslist configuration. The current effective default list includes Chrome 109, UC Browser 15.5, KaiOS, and Opera Mini, while the installed compatibility data reports no CSS-nesting support for those targets. Autoprefixer does not transform nesting. The build also warns that its `caniuse-lite` data is 12 months old.

Recommendation: make one of these contracts explicit:

- Modern-only: keep native nesting, add a Browserslist matching the actual syntax floor, document minimum browser versions, and add a syntax-support check.
- Broad classless baseline: compile nesting in the distributed artifact while retaining it in source.

`supported-color-schemes` in `src/variables.css:62,83` is also a stale, non-standard predecessor. Keep the standard `color-scheme` property and remove the ignored declaration.

### 9. Medium — form controls do not consistently inherit framework typography

Text-like inputs repeat the root size calculation at `src/inputs/text-input.css:33`, but they do not inherit the selected body font family or line height. Buttons and selects are not normalized at all; `src/inputs/buttons.css` contains only an empty rule. Consequently the serif/round type utilities can change the document without changing its controls.

Recommendation:

```css
button,
input,
select,
textarea {
  font: inherit;
  color: inherit;
}
```

Then layer only the intended control-specific differences. Add `max-inline-size: 100%` to fixed-width text controls. Prefer a visible `:focus-visible` outline rather than relying solely on a border-color change, and remove the link rule that sets `outline: 0` on active/hovered links.

### 10. Medium — the npm package publishes about 2 MB of unrelated material

`npm pack --dry-run --json` reported:

- 1,966,091-byte tarball; 2,224,207 bytes unpacked.
- 53 entries, including `.github`, source, site templates, the full style guide, and two demo images totaling about 2.06 MB unpacked.
- The actual `dist` assets total only tens of kilobytes.

There is no `files` allowlist or `.npmignore`, so npm falls back to `.gitignore` and includes nearly everything. npm documents that omitting `files` defaults to including all files and recommends `npm pack --dry-run` to inspect the result: [npm `package.json` files](https://docs.npmjs.com/files/package.json/#files).

Recommendation: add a narrow `files` list, likely `dist`, with `README`, `LICENSE`, and `package.json` included automatically. Include `src` only if source-level imports are intentionally supported. Add a tarball-content/size check before release.

### 11. Medium — build reproducibility and build-chain security need attention

Current validation results:

- `npm test`: passes; this runs a clean build and Stylelint only.
- `npm audit`: 27 development/build-chain advisories (2 critical, 13 high, 11 moderate, 1 low).
- `npm audit --omit=dev`: 0 advisories. Consumers receive no runtime dependency tree from this package.
- `npm outdated`: four direct updates within declared ranges: `@domstack/static` 11.0.2 → 11.0.3, `auto-changelog` 2.5.0 → 2.6.0, Autoprefixer 10.4.21 → 10.5.2, and `postcss-url` 10.1.3 → 10.1.4.

The highest audit paths are in local build tools (`handlebars` through the site/changelog tools and `shell-quote` through copy/task tools), so this is primarily maintainer/CI exposure, not end-user runtime exposure. It still matters because the build processes repository content and publishes artifacts.

`package-lock.json` is ignored, leaving transitive build versions floating. That has already made the generated bundle non-reproducible: a current clean build removes a previously generated `outline-width: 0` line from `dist/mine.css`. The tests pass either version because CI does not verify the committed distribution against a clean build.

Recommendation:

- Track a lockfile for reproducible builds and use `npm ci` in CI.
- Update the four direct dependencies, refresh Browserslist data, then re-run the audit.
- Remove `postcss-extend`; it is not used by framework or site source, and its nested PostCSS dependency is the one audit item with no available fix.
- Assess whether `postcss-url` is needed; the only framework URL is an inline data URI.
- Replace or override vulnerable transitive build packages where upstream updates do not resolve them.
- Add a CI step that builds and then runs `git diff --exit-code -- dist`.

### 12. Low — plain `<pre>` and `<samp>` text is colored like a link

`src/typography/code.css:23-28` groups `a code, pre, kbd, samp` and assigns all of them `--link-text`. A dark-mode computed-style check confirmed a plain `pre` uses the link blue (`rgb(102, 189, 255)`) rather than `--code-text`. Typical `pre > code` content overrides it, and the later `kbd` rule overrides it, which makes the remaining behavior look accidental.

Recommendation: keep `a code` link-colored if desired, set `pre`/`samp` to `--code-text`, and remove selectors whose values are immediately overwritten.

### 13. Low — a cleanup pass can remove legacy normalization and sharpen the type system

Candidates to verify and then remove or modernize:

- `MediaQueryList.addListener()` in `src/theme-switcher.js:4` is deprecated; use `addEventListener('change', setTheme)`: [MDN `addListener()`](https://developer.mozilla.org/en-US/docs/Web/API/MediaQueryList/addListener).
- `supported-color-schemes`, old IE/Android workaround comments, `img { border: 0; border-style: none; }`, `svg:not(:root) { overflow: hidden; }`, the checkbox/radio `transform: translate(0)` workaround, and the duplicate search `appearance` declarations should be retested against the chosen support floor.
- Use unitless `line-height: 1.25` on headings rather than `1.25em`, matching the otherwise sound unitless line-height policy.
- Reconsider global `p { letter-spacing: -0.01em; }`. Tracking is font-specific and this framework explicitly allows consumers to substitute serif, rounded, or custom fonts.
- Replace physical properties with logical ones where practical (`margin-inline`, `padding-inline`, `border-inline-start`) to improve writing-mode support.
- Either style buttons or remove the empty button module.

### 14. Low — README and style-guide drift makes the public API look older than it is

Concrete documentation issues:

- Production CDN examples still pin `^4.0.0` even though the package is 10.0.3 (`README.md:47,80,247,294`).
- The final license link says ISC, while `package.json` and `LICENSE` say MIT (`README.md:310`).
- The color override example is missing semicolons (`README.md:174-180`).
- The documented variables still use the older `hsla()` form and repeat the undefined `--transparent` token.
- The README links to a nonexistent `./site/` directory (`README.md:255`).
- Several prose typos remain (`indipendent`, `preferenc`, `thought`, `nessisary`, `whereever`).
- The style guide contains invalid HTML such as `div`, `details`, and `form` inside `p`, plus duplicate IDs (for example both textareas use `id="story"`). Browser error recovery means the guide is not always exercising the DOM structure its source appears to describe.

Recommendation: generate the token documentation from `src/variables.css` or keep a tested canonical snippet, update version examples to the current major, run an HTML validator against the generated guide, and add a link checker.

## Test coverage gaps

Stylelint is useful, but it cannot catch any of the high-priority findings above. A small behavioral suite would provide disproportionate value:

1. Load the built style guide in light, dark, explicit-light, explicit-dark, and print modes.
2. Assert that all semantic custom properties compute to non-empty valid values.
3. Assert critical contrast pairs from the token palette.
4. Check 320px, 1280px, and a wide viewport for horizontal overflow and bounded type sizes.
5. Keyboard-tab through links and form controls and verify a visible focus indicator is not clipped.
6. Unit-test the theme/type storage-state transitions, including a custom type key.
7. Build from a clean install and require an empty `dist` diff.
8. Inspect the packed file list and enforce a modest size ceiling.

## Suggested implementation order

### Patch release candidates

1. Fix `--dark-layer-background`.
2. Fix the `toggleType()` key read.
3. Correct print tokens.
4. Remove unused `postcss-extend` if the clean build is unchanged apart from expected generated output.
5. Correct factual README errors and the license/version examples.

### Deliberate visual/compatibility release

1. Revise the contrast palette and focus treatment.
2. Choose the bounded typography formula.
3. Remove layout clipping and redesign safe-area spacing.
4. Normalize form typography.
5. Declare the browser floor and either retain or compile native nesting.
6. Prune verified-obsolete normalization rules.

These changes affect the visible defaults and, in the nesting case, the compatibility contract, so grouping them into an intentionally reviewed release is preferable to mixing them into dependency churn.

## Validation notes

- `npm test` passed on 2026-07-10.
- The clean build and Stylelint passed, with a warning that Browserslist data is 12 months old.
- The 320px and 2560px style-guide checks had no page-level horizontal overflow when both `mine.css` and `layout.css` were loaded.
- The browser check did confirm the invalid dark layer token and missing `kbd` gradient.
- Existing working-tree changes to `dist/mine.css` and `dist/mine.css.map` were present before this audit; this report does not propose treating them as audit edits.

## Resolution map

| Finding | Resolution commit |
| --- | --- |
| 1. Invalid dark layer token | `39e8699` |
| 2. Theme contrast | `17fa854`, `07f907c` |
| 3. Print palette | `a977982` |
| 4. Custom type key | `f8c2db8` |
| 5. Layout clipping | `b1391a2` |
| 6. Safe-area and standalone layout | `332d1be` |
| 7. Unbounded typography | `23e9976` |
| 8. Browser contract | `99b45ab` |
| 9. Form typography, focus, and narrow inputs | `d1607a8`, `3a9ec30` |
| 10. Package contents | `238a51b` |
| 11. Toolchain security and reproducibility | `5d6037e`, `6a8cf82` |
| 12. Preformatted text color | `cbb0e66` |
| 13. Legacy normalization and logical sizing | `750e300`, `4fdbbe5` |
| 14. Documentation and style guide | `ce777bf` |
| Behavioral coverage | `fa750b1` |

import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import postcss from 'postcss'

const variables = await readFile(new URL('../src/variables.css', import.meta.url), 'utf8')
const framework = await readFile(new URL('../src/index.css', import.meta.url), 'utf8')
const documentStyles = await readFile(new URL('../src/document.css', import.meta.url), 'utf8')
const systemFonts = await readFile(new URL('../src/system-fonts-vars.css', import.meta.url), 'utf8')
const layout = await readFile(new URL('../src/layout.css', import.meta.url), 'utf8')
const siteStyles = await readFile(new URL('../global.css', import.meta.url), 'utf8')
const topBar = await readFile(new URL('../src/top-bar.css', import.meta.url), 'utf8')
const fieldset = await readFile(new URL('../src/inputs/fieldset.css', import.meta.url), 'utf8')
const textInput = await readFile(new URL('../src/inputs/text-input.css', import.meta.url), 'utf8')
const code = await readFile(new URL('../src/typography/code.css', import.meta.url), 'utf8')
const embeddedMedia = await readFile(new URL('../src/typography/embedded-media.css', import.meta.url), 'utf8')
const figures = await readFile(new URL('../src/typography/figures.css', import.meta.url), 'utf8')
const headings = await readFile(new URL('../src/typography/headings.css', import.meta.url), 'utf8')
const horizontalRules = await readFile(new URL('../src/typography/horizontal-rules.css', import.meta.url), 'utf8')
const iframes = await readFile(new URL('../src/typography/iframes.css', import.meta.url), 'utf8')
const links = await readFile(new URL('../src/typography/links.css', import.meta.url), 'utf8')
const typography = await readFile(new URL('../src/typography/index.css', import.meta.url), 'utf8')
const tronLegacy = await readFile(new URL('../src/themes/tron-legacy.css', import.meta.url), 'utf8')
const tronLegacyHighlight = await readFile(new URL('../src/highlight.js/tron-legacy.css', import.meta.url), 'utf8')
const tronLegacyHighlightLight = await readFile(new URL('../src/highlight.js/tron-legacy-light.css', import.meta.url), 'utf8')
const tronLegacyHighlightDark = await readFile(new URL('../src/highlight.js/tron-legacy-dark.css', import.meta.url), 'utf8')
const tronLegacyHighlightRules = await readFile(new URL('../src/highlight.js/tron-legacy-rules.css', import.meta.url), 'utf8')
const distribution = await readFile(new URL('../dist/mine.css', import.meta.url), 'utf8')
const layoutDistribution = await readFile(new URL('../dist/layout.css', import.meta.url), 'utf8')
const topBarDistribution = await readFile(new URL('../dist/top-bar.css', import.meta.url), 'utf8')
const packageJson = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'))

function hslToken (name) {
  const match = variables.match(new RegExp(`--${name}: hsl\\((\\d+)deg, (\\d+)%, (\\d+)%, 100%\\)`))
  assert.ok(match, `Missing opaque HSL token --${name}`)
  return match.slice(1).map(Number)
}

function hslToRgb ([hue, saturation, lightness]) {
  const s = saturation / 100
  const l = lightness / 100
  const chroma = (1 - Math.abs((2 * l) - 1)) * s
  const part = (hue / 60) % 2
  const x = chroma * (1 - Math.abs(part - 1))
  const offset = l - (chroma / 2)
  const sectors = [
    [chroma, x, 0],
    [x, chroma, 0],
    [0, chroma, x],
    [0, x, chroma],
    [x, 0, chroma],
    [chroma, 0, x]
  ]
  return sectors[Math.floor(hue / 60)].map(channel => channel + offset)
}

function luminance (rgb) {
  const [red, green, blue] = rgb.map(channel => channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4)
  return (0.2126 * red) + (0.7152 * green) + (0.0722 * blue)
}

function contrast (first, second) {
  const light = Math.max(luminance(first), luminance(second))
  const dark = Math.min(luminance(first), luminance(second))
  return (light + 0.05) / (dark + 0.05)
}

function hexToken (source, name) {
  const match = source.match(new RegExp(`--${name}: #([0-9a-f]{6})([0-9a-f]{2})?;`, 'i'))
  assert.ok(match, `Missing hex token --${name}`)
  return {
    rgb: match[1].match(/../g).map(channel => Number.parseInt(channel, 16) / 255),
    alpha: match[2] ? Number.parseInt(match[2], 16) / 255 : 1
  }
}

function composite ({ rgb, alpha }, background) {
  return rgb.map((channel, index) => (channel * alpha) + (background[index] * (1 - alpha)))
}

test('theme tokens stay valid and accessible', () => {
  assert.doesNotMatch(variables, /var\(--transparent\)/)
  assert.match(variables, /--dark-layer-background: transparent;/)
  assert.ok(contrast(hslToRgb(hslToken('light-link-text')), [1, 1, 1]) >= 4.5)
  assert.ok(contrast(hslToRgb(hslToken('light-link-text')), hslToRgb(hslToken('light-text'))) >= 3)
  assert.ok(contrast(hslToRgb(hslToken('light-accent-foreground')), [1, 1, 1]) >= 4.5)
  assert.ok(contrast(hslToRgb(hslToken('light-control-border')), [1, 1, 1]) >= 3)
  assert.ok(contrast(hslToRgb(hslToken('light-valid')), [1, 1, 1]) >= 3)
  assert.ok(contrast(hslToRgb(hslToken('light-invalid')), [1, 1, 1]) >= 3)
  assert.ok(contrast(
    hslToRgb(hslToken('dark-control-border')),
    hslToRgb(hslToken('dark-background'))
  ) >= 3)
  assert.ok(contrast(
    hslToRgb(hslToken('dark-valid')),
    hslToRgb(hslToken('dark-background'))
  ) >= 3)
  assert.ok(contrast(
    hslToRgb(hslToken('dark-invalid')),
    hslToRgb(hslToken('dark-background'))
  ) >= 3)
})

test('print declares a complete light-facing palette', () => {
  const print = variables.slice(variables.indexOf('@media print'))
  for (const token of ['text', 'background', 'layer-background', 'link-text', 'valid', 'invalid', 'mark-background', 'code-text', 'code-background', 'code-border']) {
    assert.match(print, new RegExp(`--${token}:`), `Print is missing --${token}`)
  }
  assert.match(print, /color-scheme: light;/)
  assert.match(print, /--surface-shadow: none;/)
})

test('raised surfaces share one customizable shadow', () => {
  assert.match(variables, /--surface-shadow:/)
  for (const [name, source] of [['fieldset', fieldset], ['code', code], ['figures', figures], ['iframes', iframes]]) {
    assert.match(source, /box-shadow: var\(--surface-shadow\);/, `${name} does not use --surface-shadow`)
    assert.doesNotMatch(source, /inset 0 1px 0 rgb\(255 255 255/, `${name} duplicates the surface shadow`)
  }
})

test('system font stacks use modern generics with durable fallbacks', () => {
  assert.match(systemFonts, /--system-sans:\n\s+ui-sans-serif, system-ui,/)
  assert.match(systemFonts, /"Segoe UI"/)
  assert.match(systemFonts, /--system-mono:\n\s+ui-monospace, "SFMono-Regular", menlo,/)
  assert.doesNotMatch(systemFonts, /system-ui-monospaced/)
  assert.match(systemFonts, /--system-serif:\n\s+ui-serif,/)
  assert.match(systemFonts, /--system-round:\n\s+ui-rounded, var\(--system-sans\);/)
})

test('color schemes only follow the browser preference', () => {
  assert.match(variables, /@media \(prefers-color-scheme: dark\)/)
  assert.doesNotMatch(distribution, /\.(?:dark|light)-mode/)
  assert.equal('postcss-dark-theme-class' in packageJson.devDependencies, false)
})

test('content-sized fields grow without escaping their container', () => {
  assert.match(textInput, /input\.content-sized \{[\s\S]*field-sizing: content;[\s\S]*inline-size: auto;[\s\S]*min-inline-size: min\(15\.5em, 100%\);/)
  assert.match(textInput, /textarea:not\(\[rows\], \[cols\]\) \{[\s\S]*field-sizing: content;[\s\S]*min-block-size: calc\(5lh \+ 0\.8em \+ 2px\);/)
})

test('single-line controls keep a content-independent minimum height', () => {
  const minimumHeightRule = textInput.match(/(?:input[^\n]+,\n)+select:not\(\[multiple\]\) \{[\s\S]*?min-block-size: calc\(1lh \+ 0\.8em \+ 2px\);/)
  assert.ok(minimumHeightRule, 'Missing single-line control minimum height')
  for (const type of ['date', 'datetime-local', 'month', 'time', 'week']) {
    assert.match(minimumHeightRule[0], new RegExp(`input\\[type="${type}"\\]`))
  }
})

test('WebKit temporal value boxes keep their height while empty', () => {
  assert.match(textInput, /input::-webkit-date-and-time-value \{[\s\S]*height: 1\.5em;/)
  assert.match(textInput, /bugs\.webkit\.org\/show_bug\.cgi\?id=198959/)
})

test('horizontal rules use a themed hairline with an embossed bevel', () => {
  assert.match(horizontalRules, /block-size: 1px;/)
  assert.match(horizontalRules, /margin-block: 2\.5rem;/)
  assert.match(horizontalRules, /border-radius: 999px;/)
  assert.match(horizontalRules, /background-color: color-mix\([\s\S]*var\(--accent-midground\) 75%,[\s\S]*var\(--text\)[\s\S]*\);/)
  assert.match(horizontalRules, /box-shadow:[\s\S]*var\(--accent-midground\) 45%, var\(--background\)[\s\S]*0 2px 3px rgb\(0 0 0 \/ 14%\);/)
})

test('embedded media stays within the document measure', () => {
  assert.match(embeddedMedia, /audio,\ncanvas \{[\s\S]*display: block;[\s\S]*max-inline-size: 100%;/)
  assert.match(embeddedMedia, /audio \{[\s\S]*inline-size: 100%;/)
  assert.match(embeddedMedia, /canvas \{[\s\S]*block-size: auto;/)
})

test('typography and layout remain bounded', () => {
  assert.match(documentStyles, /hanging-punctuation: first allow-end last;/)
  assert.match(documentStyles, /tab-size: 2;/)
  assert.match(documentStyles, /body \{[\s\S]*overflow-wrap: anywhere;/)
  assert.match(documentStyles, /\[hidden\]:not\(\[hidden="until-found" i\]\) \{[\s\S]*display: none !important;/)
  assert.match(documentStyles, /\.visually-hidden:not\(:focus, :active\) \{[\s\S]*inline-size: 1px;[\s\S]*block-size: 1px;[\s\S]*clip-path: inset\(50%\);/)
  assert.match(documentStyles, /:focus-visible \{[\s\S]*outline-offset: 2px;/)
  assert.doesNotMatch(links, /outline-offset/)
  assert.doesNotMatch(textInput, /outline-offset/)
  assert.match(documentStyles, /:target \{[\s\S]*scroll-margin-block-start: 3rem;/)
  assert.match(headings, /text-wrap: balance;/)
  assert.match(iframes, /iframe \{[\s\S]*display: block;[\s\S]*max-inline-size: 100%;/)
  assert.match(iframes, /border: 1px solid color-mix\(in srgb, var\(--accent-midground\) 70%, var\(--background\)\);/)
  assert.match(iframes, /border-radius: 7px;/)
  assert.match(iframes, /background-color: var\(--accent-background\);/)
  assert.match(figures, /figure \{[\s\S]*inline-size: fit-content;[\s\S]*max-inline-size: 100%;[\s\S]*margin-inline: auto;/)
  assert.match(figures, /& picture,\n {2}& img \{ display: block; \}/)
  assert.match(figures, /figcaption \{[\s\S]*contain: inline-size;[\s\S]*font-size: 0\.9em;/)
  assert.match(typography, /p,\nli,\ndd \{[\s\S]*max-inline-size: 88ch;[\s\S]*text-wrap: pretty;/)
  assert.match(variables, /--font-size-body: clamp\(1rem, calc\(.+\), 1\.25rem\);\n\n {2}@supports \(font-size: round\(1rem, 1px\)\)/)
  assert.match(variables, /round\(nearest, calc\(.+\), 1px\)/)
  assert.doesNotMatch(variables, /--font-size-scale:/)
  assert.doesNotMatch(layout, /overflow: hidden/)
  assert.match(layout, /padding-right: max\(1em, env\(safe-area-inset-right\)\)/)
  assert.match(layout, /padding-left: max\(1em, env\(safe-area-inset-left\)\)/)
  assert.match(layout, /box-sizing: border-box/)
})

test('package contract matches the modern distribution', () => {
  assert.deepEqual(packageJson.files, ['dist'])
  assert.deepEqual(packageJson.browserslist, ['supports css-nesting'])
  for (const plugin of ['postcss-nested', 'postcss-nesting', 'postcss-preset-env']) {
    assert.equal(plugin in packageJson.devDependencies, false)
  }
  assert.match(distribution, /\n\s+&:focus-visible \{/)
  assert.equal(packageJson.main, 'dist/mine.css')
  assert.equal(packageJson.style, 'dist/mine.css')
  assert.equal('exports' in packageJson, false)
  assert.equal('glob' in packageJson.overrides, false)
})

test('the main source imports into one low-priority layer', () => {
  const source = postcss.parse(framework)
  const imports = source.nodes.filter(node => node.type === 'atrule' && node.name === 'import')
  assert.ok(imports.length > 0)
  for (const imported of imports) assert.match(imported.params, / layer\(mine\)$/)

  const root = postcss.parse(distribution)
  const rules = root.nodes.filter(node => node.type !== 'comment')
  assert.ok(rules.length > 0)
  for (const rule of rules) {
    assert.equal(rule.type, 'atrule')
    assert.equal(rule.name, 'layer')
    assert.equal(rule.params, 'mine')
    assert.ok(rule.nodes.some(node => node.type === 'rule'))
  }

  /* Explicitly loaded companions retain their existing cascade behavior. */
  assert.doesNotMatch(layoutDistribution, /@layer\s+mine/)
  assert.doesNotMatch(topBarDistribution, /@layer\s+mine/)
})

test('core motion enhancements honor the reader preference', () => {
  assert.match(documentStyles, /@media \(prefers-reduced-motion: no-preference\) \{[\s\S]*@view-transition \{ navigation: auto; \}/)
  assert.match(documentStyles, /interpolate-size: allow-keywords;/)
  assert.match(documentStyles, /html \{[\s\S]*scroll-behavior: smooth;/)
  assert.doesNotMatch(documentStyles, /&:focus-within/)
  assert.doesNotMatch(siteStyles, /@view-transition/)
})

test('top-bar sidecar uses the mine.css selector contract', () => {
  assert.match(topBar, /Reimplementation inspired by top-bar\.css/)
  assert.match(topBar, /\.mine-top-bar\b/)
  assert.match(variables, /--translucent-background: color-mix\(in srgb, var\(--background\) 75%, transparent\)/)
  assert.match(topBar, /background-color: var\(\n\s+--translucent-background,/)
  assert.match(topBar, /color-mix\(in srgb, var\(--background, white\) 75%, transparent\)/)
  assert.match(topBar, /padding-top: env\(safe-area-inset-top\)/)
  assert.match(topBar, /padding-right: max\(1rem, env\(safe-area-inset-right\)\)/)
  assert.match(topBar, /padding-left: max\(1rem, env\(safe-area-inset-left\)\)/)
  assert.match(topBar, /box-shadow: 0 2px 10px 0 rgb\(0 0 0 \/ 20%\)/)
  assert.doesNotMatch(topBar, /box-shadow:.*var\(--text/)
  assert.match(topBar, /\.mine-top-bar-select\b/)
  assert.match(topBar, /border-color: var\(--control-border, #949494\)/)
  assert.doesNotMatch(topBar, /\.top-bar(?:\b|-)/)
  assert.match(topBar, /:target \{[\s\S]*scroll-margin-block-start: calc\(4rem \+ env\(safe-area-inset-top\)\);/)
  assert.doesNotMatch(topBar, /scroll-padding-block-start/)
})

test('Tron Legacy defines complete, accessible light and dark palettes', () => {
  assert.match(tronLegacy, /:root\[data-mine-theme="tron"\]/)
  const roles = ['text', 'background', 'layer-background', 'accent-background', 'accent-midground', 'control-border', 'accent-foreground', 'link-text', 'valid', 'invalid', 'mark-background', 'code-text', 'code-background', 'code-border']
  for (const mode of ['light', 'dark']) {
    for (const role of roles) hexToken(tronLegacy, `${mode}-${role}`)
  }

  const lightBackground = hexToken(tronLegacy, 'light-background').rgb
  assert.ok(contrast(hexToken(tronLegacy, 'light-text').rgb, lightBackground) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'light-link-text').rgb, lightBackground) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'light-accent-midground').rgb, lightBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'light-control-border').rgb, lightBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'light-valid').rgb, lightBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'light-invalid').rgb, lightBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'light-accent-foreground').rgb, lightBackground) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'light-code-text').rgb, hexToken(tronLegacy, 'light-code-background').rgb) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'light-text').rgb, hexToken(tronLegacy, 'light-mark-background').rgb) >= 4.5)

  const darkBackground = hexToken(tronLegacy, 'dark-background').rgb
  assert.ok(contrast(hexToken(tronLegacy, 'dark-text').rgb, darkBackground) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-link-text').rgb, darkBackground) >= 4.5)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-accent-midground').rgb, darkBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-control-border').rgb, darkBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-valid').rgb, darkBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-invalid').rgb, darkBackground) >= 3)
  assert.ok(contrast(hexToken(tronLegacy, 'dark-code-text').rgb, hexToken(tronLegacy, 'dark-code-background').rgb) >= 4.5)
  assert.ok(contrast(
    hexToken(tronLegacy, 'dark-text').rgb,
    composite(hexToken(tronLegacy, 'dark-mark-background'), darkBackground)
  ) >= 4.5)
})

test('Tron Legacy covers standard Highlight.js scopes without changing typography', () => {
  assert.doesNotMatch(tronLegacy, /(?:hljs|data-hljs-theme)/i)
  assert.match(tronLegacyHighlight, /@import url\("\.\/tron-legacy-light\.css"\);/)
  assert.match(tronLegacyHighlight, /@import url\("\.\/tron-legacy-dark\.css"\) \(prefers-color-scheme: dark\);/)
  assert.match(tronLegacyHighlightLight, /:root\[data-hljs-theme="tron"\]/)
  assert.match(tronLegacyHighlightDark, /:root\[data-hljs-theme="tron"\]/)
  assert.doesNotMatch(tronLegacyHighlightLight, /prefers-color-scheme/)
  assert.doesNotMatch(tronLegacyHighlightDark, /prefers-color-scheme/)
  const syntaxRoles = ['foreground', 'background', 'comment', 'keyword', 'title', 'function', 'attribute', 'literal', 'number', 'property', 'string', 'escape', 'regexp', 'special', 'variable-special', 'addition', 'deletion']
  for (const role of syntaxRoles) {
    assert.match(tronLegacyHighlightLight, new RegExp(`--tron-hljs-${role}: #[0-9a-f]{6};`, 'i'))
    assert.match(tronLegacyHighlightDark, new RegExp(`--tron-hljs-${role}: #[0-9a-f]{6};`, 'i'))
  }

  const scopes = ['subst', 'keyword', 'operator', 'title', 'attr', 'literal', 'number', 'regexp', 'string', 'built_in', 'comment', 'name', 'section', 'bullet', 'emphasis', 'strong', 'addition', 'deletion', 'property', 'punctuation', 'tag']
  for (const scope of scopes) {
    assert.match(tronLegacyHighlightRules, new RegExp(`\\.hljs-${scope}\\b`), `Missing Highlight.js scope ${scope}`)
  }

  assert.match(tronLegacyHighlightRules, /\.hljs \{\n {2}display: block;\n(?:\n {2}\/\*.*\*\/\n)? {2}overflow-x: auto;\n {2}padding: 1em;/)
  assert.doesNotMatch(tronLegacyHighlightRules, /pre code\.hljs \{[^}]*padding:/)
  assert.doesNotMatch(tronLegacyHighlightRules, /^\s*(?:border|font-family|font-size|line-height|margin):/m)
})

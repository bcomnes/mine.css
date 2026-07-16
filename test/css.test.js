import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const variables = await readFile(new URL('../src/variables.css', import.meta.url), 'utf8')
const systemFonts = await readFile(new URL('../src/system-fonts-vars.css', import.meta.url), 'utf8')
const layout = await readFile(new URL('../src/layout.css', import.meta.url), 'utf8')
const topBar = await readFile(new URL('../src/top-bar.css', import.meta.url), 'utf8')
const fieldset = await readFile(new URL('../src/inputs/fieldset.css', import.meta.url), 'utf8')
const code = await readFile(new URL('../src/typography/code.css', import.meta.url), 'utf8')
const figures = await readFile(new URL('../src/typography/figures.css', import.meta.url), 'utf8')
const tronLegacy = await readFile(new URL('../src/themes/tron-legacy.css', import.meta.url), 'utf8')
const tronLegacyHighlight = await readFile(new URL('../src/highlight.js/tron-legacy.css', import.meta.url), 'utf8')
const tronLegacyHighlightLight = await readFile(new URL('../src/highlight.js/tron-legacy-light.css', import.meta.url), 'utf8')
const tronLegacyHighlightDark = await readFile(new URL('../src/highlight.js/tron-legacy-dark.css', import.meta.url), 'utf8')
const tronLegacyHighlightRules = await readFile(new URL('../src/highlight.js/tron-legacy-rules.css', import.meta.url), 'utf8')
const distribution = await readFile(new URL('../dist/mine.css', import.meta.url), 'utf8')
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
  for (const [name, source] of [['fieldset', fieldset], ['code', code], ['figures', figures]]) {
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

test('typography and layout remain bounded', () => {
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

test('top-bar sidecar uses the mine.css selector contract', () => {
  assert.match(topBar, /Reimplementation inspired by top-bar\.css/)
  assert.match(topBar, /\.mine-top-bar\b/)
  assert.match(topBar, /background-color: color-mix\(in srgb, var\(--background, white\) 75%, transparent\)/)
  assert.match(topBar, /box-shadow: 0 2px 10px 0 rgb\(0 0 0 \/ 20%\)/)
  assert.doesNotMatch(topBar, /box-shadow:.*var\(--text/)
  assert.match(topBar, /\.mine-top-bar-select\b/)
  assert.match(topBar, /border-color: var\(--control-border, #949494\)/)
  assert.doesNotMatch(topBar, /\.top-bar(?:\b|-)/)
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

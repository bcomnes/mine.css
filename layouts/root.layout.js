/**
 * @import { LayoutFunction } from '@domstack/static'
 * @import { HtmlRenderable } from 'fragtml/types.js'
 */
import { html, raw, render } from 'fragtml'

import { themeOptions } from '../globals/theme-options.js'

/**
 * @typedef {object} RootLayoutVars
 * @property {string} siteName
 * @property {string} [title]
 * @property {string} version
 */

/** @type {LayoutFunction<RootLayoutVars, HtmlRenderable>} */
export default function RootLayout ({
  vars: {
    title,
    siteName,
    version
  },
  scripts,
  styles,
  children
}) {
  return render(html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <!-- Extend glass surfaces into notched display areas while CSS keeps content in the safe area. -->
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
        <!-- Let built-in controls and the initial canvas adopt the browser preference before CSS loads. -->
        <meta name="color-scheme" content="light dark">
        <title>${title ? `${title} | ` : ''}${siteName}</title>
        ${scripts
          // Global modules can restore visual state, so hold first paint until they run.
          ? scripts.map(script => html`<script src="${script}" type="module" blocking="render"></script>`)
          : null}
        ${styles
          ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
          : null}
        <!-- Only one Highlight.js theme is active; the global client swaps this stylesheet. -->
        <link
          data-mine-hljs-stylesheet
          rel="stylesheet"
          href="/highlight.js/default/index.css"
          blocking="render"
        >
      </head>
      <body>
        <nav class="mine-top-bar">
          <div class="mine-top-bar-title">
            <a href="/"><span class="mine-top-bar-label">mine.css</span></a>
            <small class="mine-top-bar-version">v${version}</small>
          </div>
          <a class="mine-top-bar-link" href="/guide/"><span class="mine-top-bar-label">guide</span></a>
          <a class="mine-top-bar-link mine-top-bar-link-current sans style-sans"><span class="mine-top-bar-label">sans</span></a>
          <a class="mine-top-bar-link serif style-serif"><span class="mine-top-bar-label">serif</span></a>
          <a class="mine-top-bar-link round style-round"><span class="mine-top-bar-label">round</span></a>
          <label class="mine-top-bar-theme">
            <select class="mine-top-bar-select" aria-label="color theme">
              ${themeOptions.map(({ value, label }) => html`<option value=${value}>${label}</option>`)}
            </select>
          </label>
          <div class="mine-top-bar-right">
            <a aria-label="GitHub" class="mine-top-bar-link" href="https://github.com/bcomnes/mine.css/">
              <span class="mine-top-bar-label">github</span>
            </a>
          </div>
        </nav>
        <main class="markdown-body mine-layout">
          ${typeof children === 'string'
            // The static-site builder has already rendered Markdown to trusted HTML.
            ? raw(children)
            : children}
        </main>
        <footer>
          <a href="https://github.com/bcomnes/mine.css/issues"><small>💌</small></a>
        </footer>
      </body>
    </html>
`)
}

import { html, raw, render } from 'fragtml'

/**
 * @typedef {object} RootLayoutProps
 * @property {{ title?: string, siteName: string }} vars
 * @property {string[]} [scripts]
 * @property {string[]} [styles]
 * @property {import('fragtml/types.js').HtmlRenderable} children
 */

/** @param {RootLayoutProps} props */
export default async function RootLayout ({
  vars: {
    title,
    siteName
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
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Let built-in controls and the initial canvas adopt the browser preference before CSS loads. -->
        <meta name="color-scheme" content="light dark">
        <!-- Restore the named palette before styles load so navigation does not flash the default theme. -->
        <script>${raw(`
          try {
            const theme = localStorage.getItem('mine-theme')
            if (theme === 'tron') document.documentElement.dataset.mineTheme = theme
          } catch {}
        `)}</script>
        <title>${title ? `${title} | ` : ''}${siteName}</title>
        ${scripts
          ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
          : null}
        ${styles
          ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
          : null}
      </head>
      <body>
        <nav class="mine-top-bar">
          <div class="mine-top-bar-title">
            <a href="/"><span class="mine-top-bar-label">mine.css</span></a>
          </div>
          <a class="mine-top-bar-link" href="/guide/"><span class="mine-top-bar-label">guide</span></a>
          <a class="mine-top-bar-link mine-top-bar-link-current sans style-sans"><span class="mine-top-bar-label">sans</span></a>
          <a class="mine-top-bar-link serif style-serif"><span class="mine-top-bar-label">serif</span></a>
          <a class="mine-top-bar-link round style-round"><span class="mine-top-bar-label">round</span></a>
          <label class="mine-top-bar-theme">
            <select class="mine-top-bar-select" aria-label="color theme">
              <option value="default">default</option>
              <option value="tron">tron</option>
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

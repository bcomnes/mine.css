import { html, render } from 'uhtml-isomorphic'

/**
 * @typedef {object} RootLayoutProps
 * @property {{ title?: string, siteName: string }} vars
 * @property {string[]} [scripts]
 * @property {string[]} [styles]
 * @property {string | unknown} children
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
  return render(String, html`
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- Let built-in controls and the initial canvas adopt the browser preference before CSS loads. -->
        <meta name="color-scheme" content="light dark">
        <title>${title ? `${title} | ` : ''}${siteName}</title>
        ${scripts
          ? scripts.map(script => html`<script src="${script}" type='module'></script>`)
          : null}
        ${styles
          ? styles.map(style => html`<link rel="stylesheet" href=${style} />`)
          : null}
      </head>
      <body>
        <nav class="top-bar">
          <div class="top-bar-title">
            <a href="/">mine.css</a>
          </div>
          <a class="top-bar-link" href="/guide/">guide</a>
          <a class="top-bar-link sans style-sans current-page">sans</a>
          <a class="top-bar-link serif style-serif">serif</a>
          <a class="top-bar-link round style-round">round</a>
          <a class="top-bar-link type-toggle">Tt</a>
          <div class="top-bar-right">
            <a aria-label="GitHub" class="top-bar-link" href="https://github.com/bcomnes/mine.css/">
              🐈 <span class="top-bar-github-label">github</span>
            </a>
          </div>
        </nav>
        <main class="markdown-body mine-layout">
          ${typeof children === 'string' ? html([children]) : children /* Support both uhtml and string children. Optional. */}
        </main>
        <footer>
          <a href="https://github.com/bcomnes/mine.css/issues"><small>💌</small></a>
        </footer>
      </body>
    </html>
`)
}

import { html, render } from 'uhtml-isomorphic'

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
          <span class="top-bar-link"><input class="dark-icon" onclick="toggleTheme()" type="image" alt="Toogle Theme" height="14" width="14" src="/light-dark.svg"></span>
          <div class="top-bar-right">
            <a class="top-bar-link" href="https://github.com/bcomnes/mine.css/">
              🐈 github
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

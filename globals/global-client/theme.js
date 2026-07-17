import { themeOptions } from '../theme-options.js'

import { requiredElement } from './dom.js'

const defaultTheme = 'default'
const storageKey = 'mine-theme'
const themeFiles = new Map(themeOptions.map(({ value, file = value }) => [value, file]))

/** Restore the persisted theme as early as the global client can run. */
export function restoreTheme () {
  applyTheme(readStoredTheme())
}

/** Initialize the top-bar theme selector and keep it synchronized with the root element. */
export function initializeThemeControl () {
  const themeSelect = /** @type {HTMLSelectElement} */ (requiredElement('.mine-top-bar-select'))
  const theme = normalizeTheme(document.documentElement.dataset['mineTheme'])

  applyTheme(theme)
  themeSelect.value = theme
  themeSelect.addEventListener('change', () => {
    const selectedTheme = normalizeTheme(themeSelect.value)
    applyTheme(selectedTheme)
    storeTheme(selectedTheme)
  })
}

/** @param {string | undefined | null} theme */
function normalizeTheme (theme) {
  return theme && themeFiles.has(theme) ? theme : defaultTheme
}

/** @param {string | undefined | null} theme */
function applyTheme (theme) {
  const normalizedTheme = normalizeTheme(theme)
  const themeFile = themeFiles.get(normalizedTheme)
  const themeStylesheet = /** @type {HTMLLinkElement} */ (requiredElement('[data-mine-hljs-stylesheet]'))

  if (!themeFile) throw new Error(`No stylesheet configured for ${normalizedTheme}`)

  if (normalizedTheme === defaultTheme) {
    delete document.documentElement.dataset['mineTheme']
  } else {
    document.documentElement.dataset['mineTheme'] = normalizedTheme
  }

  const href = `/highlight.js/${themeFile}/index.css`
  if (themeStylesheet.getAttribute('href') !== href) themeStylesheet.href = href
}

function readStoredTheme () {
  try {
    return normalizeTheme(localStorage.getItem(storageKey))
  } catch {
    return defaultTheme
  }
}

/** @param {string} theme */
function storeTheme (theme) {
  try {
    if (theme === defaultTheme) localStorage.removeItem(storageKey)
    else localStorage.setItem(storageKey, theme)
  } catch {}
}

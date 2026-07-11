const defaultTypeSetting = 'mine-type-scheme'

/**
 * @param {string} querySelector
 * @param {string} settingsKey
 */
export function setType (querySelector, settingsKey = defaultTypeSetting) {
  const element = document.querySelector(querySelector)
  if (!element) throw new Error(`No element matches ${querySelector}`)
  const desiredType = window.sessionStorage.getItem(settingsKey)

  element.classList.toggle('serif', desiredType === 'serif')
  element.classList.toggle('round', desiredType === 'round')
  element.classList.toggle('sans', desiredType === 'sans')
}

/**
 * @param {string} querySelector
 * @param {string} settingsKey
 */
export function toggleType (querySelector, settingsKey = defaultTypeSetting) {
  const typeScheme = window.sessionStorage.getItem(settingsKey)

  switch (typeScheme) {
    case 'sans': {
      window.sessionStorage.setItem(settingsKey, 'serif')
      break
    }
    case 'serif': {
      window.sessionStorage.setItem(settingsKey, 'round')
      break
    }
    case 'round':
    default: {
      window.sessionStorage.setItem(settingsKey, 'sans')
      break
    }
  }

  setType(querySelector, settingsKey)
}

/* Restore the saved type choice in browsers while keeping server imports side-effect safe. */
if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  setType('body')
}

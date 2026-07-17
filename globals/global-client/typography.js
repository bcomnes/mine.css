import { requiredElement } from './dom.js'

/** Initialize the top-bar controls that preview mine.css font families. */
export function initializeTypographyControls () {
  const page = requiredElement('body')
  const controls = {
    sans: requiredElement('.style-sans'),
    serif: requiredElement('.style-serif'),
    round: requiredElement('.style-round')
  }

  /** @param {'sans' | 'serif' | 'round'} family */
  const selectFamily = family => {
    page.classList.toggle('serif', family === 'serif')
    page.classList.toggle('round', family === 'round')

    for (const [name, control] of Object.entries(controls)) {
      control.classList.toggle('mine-top-bar-link-current', name === family)
    }
  }

  controls.sans.addEventListener('click', () => selectFamily('sans'))
  controls.serif.addEventListener('click', () => selectFamily('serif'))
  controls.round.addEventListener('click', () => selectFamily('round'))
}

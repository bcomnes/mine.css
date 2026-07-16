const page = requiredElement('body')
const sansButton = requiredElement('.style-sans')
const serifButton = requiredElement('.style-serif')
const roundButton = requiredElement('.style-round')
const themeSelect = /** @type {HTMLSelectElement} */ (requiredElement('.mine-top-bar-select'))

/** @param {string} selector */
function requiredElement (selector) {
  const element = document.querySelector(selector)
  if (!element) throw new Error(`No element matches ${selector}`)
  return element
}

function round () {
  page.classList.toggle('serif', false)
  page.classList.toggle('round', true)

  sansButton.classList.toggle('mine-top-bar-link-current', false)
  serifButton.classList.toggle('mine-top-bar-link-current', false)
  roundButton.classList.toggle('mine-top-bar-link-current', true)
}

function serif () {
  page.classList.toggle('serif', true)
  page.classList.toggle('round', false)
  sansButton.classList.toggle('mine-top-bar-link-current', false)
  serifButton.classList.toggle('mine-top-bar-link-current', true)
  roundButton.classList.toggle('mine-top-bar-link-current', false)
}

function sans () {
  page.classList.toggle('serif', false)
  page.classList.toggle('round', false)
  sansButton.classList.toggle('mine-top-bar-link-current', true)
  serifButton.classList.toggle('mine-top-bar-link-current', false)
  roundButton.classList.toggle('mine-top-bar-link-current', false)
}

/** @param {'default' | 'tron'} theme */
function setTheme (theme) {
  if (theme === 'tron') {
    document.documentElement.dataset['mineTheme'] = theme
    document.documentElement.dataset['hljsTheme'] = theme
  } else {
    delete document.documentElement.dataset['mineTheme']
    delete document.documentElement.dataset['hljsTheme']
  }
  themeSelect.value = theme
}

// The head bootstrap restores this attribute before paint; synchronize the menu with it.
setTheme(document.documentElement.dataset['mineTheme'] === 'tron' ? 'tron' : 'default')

sansButton.addEventListener('click', sans)
serifButton.addEventListener('click', serif)
roundButton.addEventListener('click', round)
themeSelect.addEventListener('change', () => {
  const theme = themeSelect.value === 'tron' ? 'tron' : 'default'
  setTheme(theme)
  try {
    if (theme === 'tron') localStorage.setItem('mine-theme', theme)
    else localStorage.removeItem('mine-theme')
  } catch {}
})

const quantity = /** @type {HTMLInputElement | null} */ (document.querySelector('#quantity'))
const quantityOutput = /** @type {HTMLOutputElement | null} */ (document.querySelector('#quantity-output'))
if (quantity && quantityOutput) {
  const updateQuantity = () => { quantityOutput.value = quantity.value }
  updateQuantity()
  quantity.addEventListener('input', updateQuantity)
}

const indeterminateCheckbox = /** @type {HTMLInputElement | null} */ (document.querySelector('#indeterminate-checkbox'))
if (indeterminateCheckbox) {
  indeterminateCheckbox.indeterminate = true
}

const validationForm = document.querySelector('#validation-form')
if (validationForm) {
  /* Keep the valid demo state visible instead of reloading the static guide. */
  validationForm.addEventListener('submit', event => event.preventDefault())
}

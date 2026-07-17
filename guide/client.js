initializeQuantityOutput()
initializeIndeterminateCheckbox()
initializeValidationForm()

function initializeQuantityOutput () {
  const quantity = /** @type {HTMLInputElement | null} */ (document.querySelector('#quantity'))
  const output = /** @type {HTMLOutputElement | null} */ (document.querySelector('#quantity-output'))
  if (!quantity || !output) return

  const updateOutput = () => { output.value = quantity.value }
  updateOutput()
  quantity.addEventListener('input', updateOutput)
}

function initializeIndeterminateCheckbox () {
  const checkbox = /** @type {HTMLInputElement | null} */ (document.querySelector('#indeterminate-checkbox'))
  if (checkbox) checkbox.indeterminate = true
}

function initializeValidationForm () {
  const form = document.querySelector('#validation-form')
  if (!form) return

  // Keep the valid demo state visible instead of reloading the static guide.
  form.addEventListener('submit', event => event.preventDefault())
}

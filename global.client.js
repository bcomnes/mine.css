const page = requiredElement('body')
const sansButton = requiredElement('.style-sans')
const serifButton = requiredElement('.style-serif')
const roundButton = requiredElement('.style-round')

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

sansButton.addEventListener('click', sans)
serifButton.addEventListener('click', serif)
roundButton.addEventListener('click', round)

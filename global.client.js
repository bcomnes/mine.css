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

  sansButton.classList.toggle('current-page', false)
  serifButton.classList.toggle('current-page', false)
  roundButton.classList.toggle('current-page', true)
}

function serif () {
  page.classList.toggle('serif', true)
  page.classList.toggle('round', false)
  sansButton.classList.toggle('current-page', false)
  serifButton.classList.toggle('current-page', true)
  roundButton.classList.toggle('current-page', false)
}

function sans () {
  page.classList.toggle('serif', false)
  page.classList.toggle('round', false)
  sansButton.classList.toggle('current-page', true)
  serifButton.classList.toggle('current-page', false)
  roundButton.classList.toggle('current-page', false)
}

sansButton.addEventListener('click', sans)
serifButton.addEventListener('click', serif)
roundButton.addEventListener('click', round)

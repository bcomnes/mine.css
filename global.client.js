import {toggleTheme, setType, toggleType} from './src/theme-switcher.js';

window.toggleTheme = toggleTheme

const page = document.querySelector('body')
const sansButton = document.querySelector('.style-sans')
const serifButton = document.querySelector('.style-serif')
const roundButton = document.querySelector('.style-round')
const toggle = document.querySelector('.id')
const typeToggle = document.querySelector('.type-toggle')

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
typeToggle.addEventListener('click', () => toggleType('body'))

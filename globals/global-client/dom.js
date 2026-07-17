/**
 * Return a required element or fail close to the selector that is out of sync
 * with the shared layout.
 *
 * @param {string} selector
 * @returns {Element}
 */
export function requiredElement (selector) {
  const element = document.querySelector(selector)
  if (!element) throw new Error(`No element matches ${selector}`)
  return element
}

/* global getComputedStyle */

import { expect, test } from './support.js'

async function gotoGuide (page, siteURL) {
  await page.goto(`${siteURL}/guide/`, { waitUntil: 'domcontentloaded' })
}

const viewports = [
  { name: 'phone', width: 320, height: 800, rootFont: '16px' },
  { name: 'wide desktop', width: 2560, height: 1000, rootFont: '18px' }
]

for (const viewport of viewports) {
  test(`keeps the ${viewport.name} layout bounded`, async ({ page, siteURL }) => {
    await page.setViewportSize(viewport)
    await gotoGuide(page, siteURL)

    const metrics = await page.evaluate(() => {
      const root = getComputedStyle(document.documentElement)
      const main = document.querySelector('main')
      const fileInput = document.querySelector('input[type="file"]')
      if (!main || !fileInput) throw new Error('Style guide fixtures are missing')

      return {
        bodyWidth: document.body.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        rootFont: root.fontSize,
        mainWidth: main.getBoundingClientRect().width,
        mainOverflow: getComputedStyle(main).overflow,
        fileInputWidth: fileInput.getBoundingClientRect().width
      }
    })

    expect(metrics.bodyWidth).toBe(metrics.viewportWidth)
    expect(metrics.rootFont).toBe(viewport.rootFont)
    expect(metrics.mainOverflow).toBe('visible')
    expect(metrics.mainWidth).toBeLessThanOrEqual(metrics.viewportWidth)
    expect(metrics.fileInputWidth).toBeLessThanOrEqual(metrics.mainWidth)
  })
}

test('follows the browser color-scheme preference', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await gotoGuide(page, siteURL)

  const darkTokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    const key = document.querySelector('kbd')
    const highlightedCode = document.querySelector('.hljs')
    if (!key || !highlightedCode) throw new Error('Color-scheme fixtures are missing')
    return {
      layer: styles.getPropertyValue('--dark-layer-background').trim(),
      keyBackground: getComputedStyle(key).backgroundImage,
      highlightedColor: getComputedStyle(highlightedCode).color,
      highlightedBackground: getComputedStyle(highlightedCode).backgroundColor
    }
  })
  expect(darkTokens.layer).toBe('transparent')
  expect(darkTokens.keyBackground).toContain('linear-gradient')
  expect(darkTokens.highlightedColor).toBe('rgb(173, 186, 199)')
  expect(darkTokens.highlightedBackground).toBe('rgb(34, 39, 46)')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(31, 31, 31)')

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(page.locator('.hljs').first()).toHaveCSS('color', 'rgb(36, 41, 46)')
  await expect(page.locator('.hljs').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)')
})

test('uses a light palette when printing from dark mode', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark', media: 'print' })
  await gotoGuide(page, siteURL)

  const print = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const body = getComputedStyle(document.body)
    const pre = document.querySelector('pre')
    const highlightedCode = document.querySelector('.hljs')
    const highlightedToken = highlightedCode?.querySelector('span')
    if (!pre || !highlightedCode || !highlightedToken) throw new Error('Code fixtures are missing')
    return {
      colorScheme: root.colorScheme,
      bodyColor: body.color,
      bodyBackground: body.backgroundColor,
      codeColor: getComputedStyle(pre).color,
      codeBackground: getComputedStyle(pre).backgroundColor,
      highlightedCodeColor: getComputedStyle(highlightedCode).color,
      highlightedCodeBackground: getComputedStyle(highlightedCode).backgroundColor,
      highlightedTokenColor: getComputedStyle(highlightedToken).color
    }
  })

  expect(print).toEqual({
    colorScheme: 'light',
    bodyColor: 'rgb(18, 18, 18)',
    bodyBackground: 'rgb(255, 255, 255)',
    codeColor: 'rgb(18, 18, 18)',
    codeBackground: 'rgb(212, 212, 212)',
    highlightedCodeColor: 'rgb(18, 18, 18)',
    highlightedCodeBackground: 'rgba(0, 0, 0, 0)',
    highlightedTokenColor: 'rgb(18, 18, 18)'
  })
  await expect(page.locator('nav')).toBeHidden()
  await expect(page.locator('footer')).toBeHidden()
})

test('keeps keyboard focus visible', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  const contentLink = page.locator('main a[href="http://dev.nodeca.com"]')
  await expect(contentLink).toHaveCSS('text-decoration-line', 'none')
  await contentLink.hover()
  const hoverPresentation = await contentLink.evaluate(element => {
    const styles = getComputedStyle(element)
    return {
      background: styles.backgroundColor,
      radius: styles.borderRadius,
      shadow: styles.boxShadow,
      textDecoration: styles.textDecorationLine
    }
  })
  expect(hoverPresentation.textDecoration).toBe('none')
  expect(hoverPresentation.background).not.toBe('rgba(0, 0, 0, 0)')
  expect(hoverPresentation.radius).not.toBe('0px')
  expect(hoverPresentation.shadow).not.toBe('none')

  const navigationColors = await page.evaluate(() => {
    const titleLink = document.querySelector('.mine-top-bar-title a')
    const contentLink = document.querySelector('main a[href="http://dev.nodeca.com"]')
    if (!titleLink || !contentLink) throw new Error('Link fixtures are missing')
    return {
      title: getComputedStyle(titleLink).color,
      content: getComputedStyle(contentLink).color
    }
  })
  expect(navigationColors.title).toBe(navigationColors.content)

  const navigationLink = page.getByRole('link', { name: 'guide', exact: true })
  await navigationLink.hover()
  const navigationHover = await navigationLink.evaluate(element => {
    const label = element.querySelector('.mine-top-bar-label')
    if (!label) throw new Error('Navigation label fixture is missing')
    const controlStyles = getComputedStyle(element)
    const labelStyles = getComputedStyle(label)
    return {
      controlBackground: controlStyles.backgroundColor,
      controlShadow: controlStyles.boxShadow,
      labelBackground: labelStyles.backgroundColor,
      labelShadow: labelStyles.boxShadow
    }
  })
  expect(navigationHover.controlBackground).toBe('rgba(0, 0, 0, 0)')
  expect(navigationHover.controlShadow).toBe('none')
  expect(navigationHover.labelBackground).not.toBe('rgba(0, 0, 0, 0)')
  expect(navigationHover.labelShadow).not.toBe('none')

  await navigationLink.focus()
  await expect(navigationLink).toBeFocused()
  await expect(navigationLink).toHaveCSS('outline-style', 'solid')
  await expect(navigationLink).toHaveCSS('outline-width', '2px')
})

test('keeps mobile navigation usable around anchored content', async ({ page, siteURL }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto(`${siteURL}/guide/#input-types`, { waitUntil: 'domcontentloaded' })

  const geometry = await page.evaluate(() => {
    const nav = document.querySelector('nav')
    const target = document.querySelector('#input-types')
    const roundControl = document.querySelector('.style-round')
    if (!nav || !target || !roundControl) throw new Error('Navigation fixtures are missing')

    const roundBounds = roundControl.getBoundingClientRect()

    return {
      navBottom: nav.getBoundingClientRect().bottom,
      navHeight: nav.getBoundingClientRect().height,
      targetTop: target.getBoundingClientRect().top,
      roundLeft: roundBounds.left,
      roundRight: roundBounds.right,
      viewportWidth: document.documentElement.clientWidth
    }
  })

  expect(geometry.navHeight).toBeLessThanOrEqual(64)
  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.navBottom)
  expect(geometry.roundLeft).toBeGreaterThanOrEqual(0)
  expect(geometry.roundRight).toBeLessThanOrEqual(geometry.viewportWidth)
})

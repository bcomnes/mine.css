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

test('switches an automatic dark theme to explicit light', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await gotoGuide(page, siteURL)

  const root = page.locator('html')
  await expect(root).toHaveClass(/dark-mode/)

  const darkTokens = await page.evaluate(() => {
    const styles = getComputedStyle(document.documentElement)
    const key = document.querySelector('kbd')
    if (!key) throw new Error('Keyboard fixture is missing')
    return {
      layer: styles.getPropertyValue('--dark-layer-background').trim(),
      keyBackground: getComputedStyle(key).backgroundImage
    }
  })
  expect(darkTokens.layer).toBe('transparent')
  expect(darkTokens.keyBackground).toContain('linear-gradient')

  await page.getByRole('button', { name: 'Toggle theme' }).click()
  await expect(root).toHaveClass(/light-mode/)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
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
  const guideLink = page.getByRole('link', { name: 'guide', exact: true })
  await guideLink.focus()
  await expect(guideLink).toBeFocused()
  await expect(guideLink).toHaveCSS('outline-style', 'solid')
  await expect(guideLink).toHaveCSS('outline-width', '2px')
})

test('keeps mobile navigation usable around anchored content', async ({ page, siteURL }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto(`${siteURL}/guide/#input-types`, { waitUntil: 'domcontentloaded' })

  const geometry = await page.evaluate(() => {
    const nav = document.querySelector('nav')
    const target = document.querySelector('#input-types')
    const themeToggle = document.querySelector('[alt="Toggle theme"]')
    if (!nav || !target || !themeToggle) throw new Error('Navigation fixtures are missing')

    const themeBounds = themeToggle.getBoundingClientRect()

    return {
      navBottom: nav.getBoundingClientRect().bottom,
      navHeight: nav.getBoundingClientRect().height,
      targetTop: target.getBoundingClientRect().top,
      themeLeft: themeBounds.left,
      themeRight: themeBounds.right,
      viewportWidth: document.documentElement.clientWidth
    }
  })

  expect(geometry.navHeight).toBeLessThanOrEqual(64)
  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.navBottom)
  expect(geometry.themeLeft).toBeGreaterThanOrEqual(0)
  expect(geometry.themeRight).toBeLessThanOrEqual(geometry.viewportWidth)
})

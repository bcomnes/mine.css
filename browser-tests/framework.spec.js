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
    if (!pre) throw new Error('Code fixture is missing')
    return {
      colorScheme: root.colorScheme,
      bodyColor: body.color,
      bodyBackground: body.backgroundColor,
      codeColor: getComputedStyle(pre).color,
      codeBackground: getComputedStyle(pre).backgroundColor
    }
  })

  expect(print).toEqual({
    colorScheme: 'light',
    bodyColor: 'rgb(18, 18, 18)',
    bodyBackground: 'rgb(255, 255, 255)',
    codeColor: 'rgb(18, 18, 18)',
    codeBackground: 'rgb(212, 212, 212)'
  })
})

test('keeps keyboard focus visible', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  const guideLink = page.getByRole('link', { name: 'guide', exact: true })
  await guideLink.focus()
  await expect(guideLink).toBeFocused()
  await expect(guideLink).toHaveCSS('outline-style', 'solid')
  await expect(guideLink).toHaveCSS('outline-width', '2px')
})

/* global getComputedStyle */

import { expect, test } from './support.js'

async function gotoGuide (page, siteURL) {
  await page.goto(`${siteURL}/guide/`, { waitUntil: 'domcontentloaded' })
}

async function readThemePresentation (page) {
  return page.evaluate(() => {
    const toRgb = (value) => {
      const canvas = document.createElement('canvas')
      canvas.width = canvas.height = 1
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Canvas context is unavailable')
      context.fillStyle = value
      context.fillRect(0, 0, 1, 1)
      return [...context.getImageData(0, 0, 1, 1).data.slice(0, 3)]
    }
    const styles = getComputedStyle(document.documentElement)
    const key = document.querySelector('kbd')
    const highlightedCode = document.querySelector('.hljs')
    const textInput = document.querySelector('input[type="text"]')
    const codeBlock = document.querySelector('pre')
    if (!key || !highlightedCode || !textInput || !codeBlock) throw new Error('Color-scheme fixtures are missing')
    return {
      codeBorder: toRgb(getComputedStyle(codeBlock).borderColor),
      controlBorder: toRgb(getComputedStyle(textInput).borderColor),
      controlShadow: getComputedStyle(textInput).boxShadow,
      layer: styles.getPropertyValue('--dark-layer-background').trim(),
      keyBackground: getComputedStyle(key).backgroundImage,
      keyShadow: getComputedStyle(key).boxShadow,
      highlightedColor: getComputedStyle(highlightedCode).color,
      highlightedBackground: getComputedStyle(highlightedCode).backgroundColor
    }
  })
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
      const blockquote = document.querySelector('blockquote')
      if (!main || !fileInput || !blockquote) throw new Error('Style guide fixtures are missing')
      const blockquoteStyles = getComputedStyle(blockquote)

      return {
        blockquoteMarginInlineEnd: blockquoteStyles.marginInlineEnd,
        blockquoteMarginInlineStart: blockquoteStyles.marginInlineStart,
        bodyWidth: document.body.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        rootFont: root.fontSize,
        mainWidth: main.getBoundingClientRect().width,
        mainOverflow: getComputedStyle(main).overflow,
        fileInputWidth: fileInput.getBoundingClientRect().width
      }
    })

    expect(metrics.bodyWidth).toBe(metrics.viewportWidth)
    expect(metrics.blockquoteMarginInlineStart).toBe('0px')
    expect(metrics.blockquoteMarginInlineEnd).toBe('0px')
    expect(metrics.rootFont).toBe(viewport.rootFont)
    expect(metrics.mainOverflow).toBe('visible')
    expect(metrics.mainWidth).toBeLessThanOrEqual(metrics.viewportWidth)
    expect(metrics.fileInputWidth).toBeLessThanOrEqual(metrics.mainWidth)
  })
}

test('follows the browser color-scheme preference', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await gotoGuide(page, siteURL)

  const darkTokens = await readThemePresentation(page)
  expect(darkTokens.layer).toBe('transparent')
  expect(darkTokens.codeBorder).toEqual([63, 63, 63])
  expect(darkTokens.controlBorder).toEqual([80, 80, 80])
  expect(darkTokens.controlShadow).toContain('rgb(107, 107, 107)')
  expect(darkTokens.keyBackground).toContain('linear-gradient(rgb(51, 51, 51)')
  expect(darkTokens.keyShadow).toContain('rgba(0, 0, 0, 0.45)')
  expect(darkTokens.highlightedColor).toBe('rgb(173, 186, 199)')
  expect(darkTokens.highlightedBackground).toBe('rgb(34, 39, 46)')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(31, 31, 31)')

  await page.emulateMedia({ colorScheme: 'light' })
  await page.waitForTimeout(200)
  const lightTokens = await readThemePresentation(page)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  expect(lightTokens.codeBorder).toEqual([226, 226, 226])
  expect(lightTokens.controlBorder).toEqual([185, 185, 185])
  expect(lightTokens.controlShadow).toContain('rgb(148, 148, 148)')
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

test('keeps browser-native button metrics', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  const metrics = await page.evaluate(() => {
    const bodyStyles = getComputedStyle(document.body)
    const controls = [
      document.querySelector('button'),
      document.querySelector('input[type="button"]'),
      document.querySelector('input[type="reset"]'),
      document.querySelector('input[type="submit"]')
    ]
    if (controls.some(control => !control)) throw new Error('Button fixtures are missing')
    return {
      bodyFontSize: bodyStyles.fontSize,
      controls: controls.map(control => {
        const styles = getComputedStyle(control)
        return { fontSize: styles.fontSize, lineHeight: styles.lineHeight }
      })
    }
  })

  for (const control of metrics.controls) {
    expect(control.fontSize).not.toBe(metrics.bodyFontSize)
    expect(control.lineHeight).toBe('normal')
  }
})

test('spaces every input demo consistently before its source', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  const inputExamples = [
    'buttons',
    'checkbox',
    'color',
    'date',
    'datetime-local',
    'email',
    'file',
    'image-input',
    'month',
    'number',
    'password',
    'radio',
    'range',
    'reset',
    'search',
    'submit',
    'tel',
    'text',
    'textarea',
    'time',
    'url',
    'week',
    'fieldset'
  ]
  const gaps = await page.evaluate((ids) => ids.map(id => {
    const heading = document.querySelector(`a#${id}`)?.parentElement
    if (!heading) throw new Error(`Missing input heading: ${id}`)

    let sibling = heading.nextElementSibling
    while (sibling && sibling.tagName !== 'PRE') sibling = sibling.nextElementSibling
    const fixture = sibling?.previousElementSibling
    if (!fixture || !sibling) throw new Error(`Missing input fixture or source: ${id}`)

    return sibling.getBoundingClientRect().top - fixture.getBoundingClientRect().bottom
  }), inputExamples)

  expect(gaps).toHaveLength(inputExamples.length)
  for (const gap of gaps) {
    expect(gap).toBeGreaterThan(0)
    expect(gap).toBeCloseTo(gaps[0], 1)
  }
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
      navScrollbarWidth: getComputedStyle(nav).scrollbarWidth,
      targetTop: target.getBoundingClientRect().top,
      roundLeft: roundBounds.left,
      roundRight: roundBounds.right,
      viewportWidth: document.documentElement.clientWidth
    }
  })

  expect(geometry.navHeight).toBeLessThanOrEqual(64)
  expect(geometry.navScrollbarWidth).toBe('none')
  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.navBottom)
  expect(geometry.roundLeft).toBeGreaterThanOrEqual(0)
  expect(geometry.roundRight).toBeLessThanOrEqual(geometry.viewportWidth)
})

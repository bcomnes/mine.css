/* global HTMLMediaElement, getComputedStyle */

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
    const themeControl = document.querySelector('.mine-top-bar-select')
    const video = document.querySelector('#blank-video')
    if (!key || !highlightedCode || !textInput || !codeBlock || !themeControl || !video) throw new Error('Color-scheme fixtures are missing')
    return {
      codeBorder: toRgb(getComputedStyle(codeBlock).borderColor),
      controlBorder: toRgb(getComputedStyle(textInput).borderColor),
      controlShadow: getComputedStyle(textInput).boxShadow,
      layer: styles.getPropertyValue('--dark-layer-background').trim(),
      keyBackground: getComputedStyle(key).backgroundImage,
      keyShadow: getComputedStyle(key).boxShadow,
      highlightedColor: getComputedStyle(highlightedCode).color,
      highlightedBackground: getComputedStyle(highlightedCode).backgroundColor,
      themeControlBorder: toRgb(getComputedStyle(themeControl).borderColor),
      videoBackground: toRgb(getComputedStyle(video).backgroundColor)
    }
  })
}

const viewports = [
  { name: 'phone', width: 320, height: 800, rootFont: '16px' },
  { name: 'medium desktop', width: 900, height: 900, rootFont: '17px' },
  { name: 'wide desktop', width: 2560, height: 1000, rootFont: '20px' }
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
      const textarea = document.querySelector('textarea')
      const video = document.querySelector('#blank-video')
      if (!main || !fileInput || !blockquote || !textarea || !video) throw new Error('Style guide fixtures are missing')
      const blockquoteStyles = getComputedStyle(blockquote)

      return {
        blockquoteMarginInlineEnd: blockquoteStyles.marginInlineEnd,
        blockquoteMarginInlineStart: blockquoteStyles.marginInlineStart,
        bodyWidth: document.body.scrollWidth,
        viewportWidth: document.documentElement.clientWidth,
        rootFont: root.fontSize,
        mainWidth: main.getBoundingClientRect().width,
        mainOverflow: getComputedStyle(main).overflow,
        fileInputWidth: fileInput.getBoundingClientRect().width,
        textareaDisplay: getComputedStyle(textarea).display,
        textareaWidth: textarea.getBoundingClientRect().width,
        videoHeight: video.getBoundingClientRect().height,
        videoWidth: video.getBoundingClientRect().width
      }
    })

    expect(metrics.bodyWidth).toBe(metrics.viewportWidth)
    expect(metrics.blockquoteMarginInlineStart).toBe('0px')
    expect(metrics.blockquoteMarginInlineEnd).toBe('0px')
    expect(metrics.rootFont).toBe(viewport.rootFont)
    expect(Number.isInteger(Number.parseFloat(metrics.rootFont))).toBe(true)
    expect(metrics.mainOverflow).toBe('visible')
    expect(metrics.mainWidth).toBeLessThanOrEqual(metrics.viewportWidth)
    expect(metrics.fileInputWidth).toBeLessThanOrEqual(metrics.mainWidth)
    expect(metrics.textareaDisplay).toBe('block')
    expect(metrics.textareaWidth).toBeLessThanOrEqual(metrics.mainWidth)
    expect(metrics.videoWidth).toBeLessThanOrEqual(metrics.mainWidth)
    expect(metrics.videoHeight).toBeGreaterThan(0)
    expect(metrics.videoWidth / metrics.videoHeight).toBeCloseTo(16 / 9, 2)
  })
}

test('follows the browser color-scheme preference', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await gotoGuide(page, siteURL)

  const darkTokens = await readThemePresentation(page)
  expect(darkTokens.layer).toBe('transparent')
  expect(darkTokens.codeBorder).toEqual([63, 63, 63])
  expect(darkTokens.controlBorder).toEqual([107, 107, 107])
  expect(darkTokens.themeControlBorder).toEqual(darkTokens.controlBorder)
  expect(darkTokens.controlShadow).toContain('rgba(255, 255, 255, 0.12)')
  expect(darkTokens.keyBackground).toContain('linear-gradient(rgb(51, 51, 51)')
  expect(darkTokens.keyShadow).toContain('rgba(0, 0, 0, 0.45)')
  expect(darkTokens.highlightedColor).toBe('rgb(173, 186, 199)')
  expect(darkTokens.highlightedBackground).toBe('rgb(34, 39, 46)')
  expect(darkTokens.videoBackground).toEqual([51, 51, 51])
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(31, 31, 31)')
  const topBar = page.locator('.mine-top-bar')
  await topBar.hover()
  await page.waitForTimeout(150)
  expect(await topBar.evaluate(element => getComputedStyle(element).boxShadow)).toContain('rgba(0, 0, 0, 0.2)')

  await page.emulateMedia({ colorScheme: 'light' })
  await page.waitForTimeout(200)
  const lightTokens = await readThemePresentation(page)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  expect(lightTokens.codeBorder).toEqual([226, 226, 226])
  expect(lightTokens.videoBackground).toEqual([242, 242, 242])
  expect(lightTokens.controlBorder).toEqual([148, 148, 148])
  expect(lightTokens.themeControlBorder).toEqual(lightTokens.controlBorder)
  expect(lightTokens.controlShadow).toContain('rgba(255, 255, 255, 0.12)')
  await topBar.hover()
  await page.waitForTimeout(150)
  expect(await topBar.evaluate(element => getComputedStyle(element).boxShadow)).toContain('rgba(0, 0, 0, 0.2)')
  await expect(page.locator('.hljs').first()).toHaveCSS('color', 'rgb(36, 41, 46)')
  await expect(page.locator('.hljs').first()).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  /* Consumers can reuse or replace the derived glass surface without rewriting it. */
  await page.evaluate(() => document.documentElement.style.setProperty(
    '--translucent-background',
    'rgb(255 0 128 / 50%)'
  ))
  await expect(topBar).toHaveCSS('background-color', 'rgba(255, 0, 128, 0.5)')
})

test('keeps a source-less video frame visible', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)

  const presentation = await page.locator('#blank-video').evaluate(video => {
    const bounds = video.getBoundingClientRect()
    return {
      background: getComputedStyle(video).backgroundColor,
      backgroundImage: getComputedStyle(video).backgroundImage,
      bodyBackground: getComputedStyle(document.body).backgroundColor,
      borderRadius: getComputedStyle(video).borderRadius,
      currentSrc: /** @type {HTMLVideoElement} */ (video).currentSrc,
      display: getComputedStyle(video).display,
      hasPoster: video.hasAttribute('poster'),
      hasSrc: video.hasAttribute('src'),
      haveNothing: HTMLMediaElement.HAVE_NOTHING,
      height: bounds.height,
      readyState: /** @type {HTMLVideoElement} */ (video).readyState,
      sourceCount: video.querySelectorAll('source').length,
      width: bounds.width
    }
  })

  expect(presentation.currentSrc).toBe('')
  expect(presentation.hasPoster).toBe(false)
  expect(presentation.hasSrc).toBe(false)
  expect(presentation.readyState).toBe(presentation.haveNothing)
  expect(presentation.sourceCount).toBe(0)
  expect(presentation.width).toBeGreaterThan(0)
  expect(presentation.height).toBeGreaterThan(0)
  expect(presentation.width / presentation.height).toBeCloseTo(16 / 9, 2)
  expect(presentation.background).not.toBe(presentation.bodyBackground)
  expect(presentation.backgroundImage).toBe('none')
  expect(presentation.borderRadius).toBe('7px')
  expect(presentation.display).toBe('block')
})

test('bounds and wraps prose without changing preformatted code', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)

  const wrapping = await page.evaluate(() => {
    const fixture = document.createElement('div')
    fixture.style.inlineSize = '10rem'
    const prose = document.createElement('p')
    prose.textContent = 'unbroken'.repeat(40)
    const pre = document.createElement('pre')
    const code = document.createElement('code')
    code.textContent = 'unbroken'.repeat(40)
    pre.append(code)
    fixture.append(prose, pre)
    document.body.append(fixture)

    const wideFixture = document.createElement('div')
    wideFixture.style.inlineSize = '1200px'
    const boundedProse = document.createElement('p')
    boundedProse.textContent = 'Readable prose keeps a protective line-length ceiling.'
    const widePre = document.createElement('pre')
    widePre.textContent = 'Preformatted content keeps the available document width.'
    wideFixture.append(boundedProse, widePre)
    document.body.append(wideFixture)

    return {
      codeKeepsWidth: widePre.getBoundingClientRect().width === wideFixture.getBoundingClientRect().width,
      codeOverflows: pre.scrollWidth > pre.clientWidth,
      codeWrap: getComputedStyle(pre).overflowWrap,
      proseIsBounded: boundedProse.getBoundingClientRect().width < wideFixture.getBoundingClientRect().width,
      proseFits: prose.scrollWidth <= prose.clientWidth,
      proseWrap: getComputedStyle(prose).overflowWrap
    }
  })

  expect(wrapping.proseWrap).toBe('anywhere')
  expect(wrapping.proseFits).toBe(true)
  expect(wrapping.proseIsBounded).toBe(true)
  expect(wrapping.codeWrap).toBe('normal')
  expect(wrapping.codeOverflows).toBe(true)
  expect(wrapping.codeKeepsWidth).toBe(true)
})

test('switches the separate Tron document and Highlight.js palettes together in the demo', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await gotoGuide(page, siteURL)

  const root = page.locator('html')
  const menu = page.getByLabel('color theme')
  const highlightedCode = page.locator('.hljs').first()
  const keyword = page.locator('.hljs-keyword').first()
  const string = page.locator('.hljs-string').first()
  const defaultCodeHeight = await highlightedCode.evaluate(element => element.getBoundingClientRect().height)

  expect(await root.getAttribute('data-mine-theme')).toBeNull()
  await expect(menu).toHaveValue('default')
  await menu.selectOption('tron')

  await expect(root).toHaveAttribute('data-mine-theme', 'tron')
  await expect(root).toHaveAttribute('data-hljs-theme', 'tron')
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(245, 247, 250)')
  await expect(highlightedCode).toHaveCSS('color', 'rgb(26, 37, 48)')
  await expect(highlightedCode).toHaveCSS('background-color', 'rgb(232, 236, 242)')
  expect(await highlightedCode.evaluate(element => element.getBoundingClientRect().height)).toBe(defaultCodeHeight)
  await expect(keyword).toHaveCSS('color', 'rgb(26, 95, 138)')
  await expect(string).toHaveCSS('color', 'rgb(217, 30, 24)')

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForTimeout(200)
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(20, 25, 31)')
  await expect(highlightedCode).toHaveCSS('color', 'rgb(218, 227, 241)')
  await expect(highlightedCode).toHaveCSS('background-color', 'rgb(28, 33, 40)')
  await expect(keyword).toHaveCSS('color', 'rgb(38, 127, 181)')
  await expect(string).toHaveCSS('color', 'rgb(255, 65, 13)')

  await page.reload({ waitUntil: 'domcontentloaded' })
  await expect(root).toHaveAttribute('data-mine-theme', 'tron')
  await expect(root).toHaveAttribute('data-hljs-theme', 'tron')
  await expect(menu).toHaveValue('tron')

  await menu.selectOption('default')
  expect(await root.getAttribute('data-mine-theme')).toBeNull()
  expect(await root.getAttribute('data-hljs-theme')).toBeNull()
  await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(31, 31, 31)')
  await expect(highlightedCode).toHaveCSS('background-color', 'rgb(34, 39, 46)')
})

test('selects the Tron document and Highlight.js themes independently', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'light' })
  await gotoGuide(page, siteURL)

  const body = page.locator('body')
  const highlightedCode = page.locator('.hljs').first()

  await page.evaluate(() => { document.documentElement.dataset.mineTheme = 'tron' })
  await expect(body).toHaveCSS('background-color', 'rgb(245, 247, 250)')
  await expect(highlightedCode).toHaveCSS('background-color', 'rgb(255, 255, 255)')

  await page.evaluate(() => {
    delete document.documentElement.dataset.mineTheme
    document.documentElement.dataset.hljsTheme = 'tron'
  })
  await expect(body).toHaveCSS('background-color', 'rgb(255, 255, 255)')
  await expect(highlightedCode).toHaveCSS('background-color', 'rgb(232, 236, 242)')
})

test('uses the selected theme light palette when printing from dark mode', async ({ page, siteURL }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await gotoGuide(page, siteURL)
  await page.getByLabel('color theme').selectOption('tron')
  await page.emulateMedia({ colorScheme: 'dark', media: 'print' })

  const print = await page.evaluate(() => {
    const root = getComputedStyle(document.documentElement)
    const body = getComputedStyle(document.body)
    const pre = document.querySelector('pre')
    const fieldset = document.querySelector('fieldset')
    const framedImage = document.querySelector('figure:not(.borderless) img')
    const highlightedCode = document.querySelector('.hljs')
    const highlightedToken = highlightedCode?.querySelector('span')
    if (!pre || !fieldset || !framedImage || !highlightedCode || !highlightedToken) throw new Error('Print fixtures are missing')
    return {
      colorScheme: root.colorScheme,
      bodyColor: body.color,
      bodyBackground: body.backgroundColor,
      codeColor: getComputedStyle(pre).color,
      codeBackground: getComputedStyle(pre).backgroundColor,
      codeShadow: getComputedStyle(pre).boxShadow,
      fieldsetShadow: getComputedStyle(fieldset).boxShadow,
      framedImageShadow: getComputedStyle(framedImage).boxShadow,
      highlightedCodeColor: getComputedStyle(highlightedCode).color,
      highlightedCodeBackground: getComputedStyle(highlightedCode).backgroundColor,
      highlightedTokenColor: getComputedStyle(highlightedToken).color
    }
  })

  expect(print).toEqual({
    colorScheme: 'light',
    bodyColor: 'rgb(45, 62, 79)',
    bodyBackground: 'rgb(245, 247, 250)',
    codeColor: 'rgb(26, 37, 48)',
    codeBackground: 'rgb(212, 212, 212)',
    codeShadow: 'none',
    fieldsetShadow: 'none',
    framedImageShadow: 'none',
    highlightedCodeColor: 'rgb(26, 37, 48)',
    highlightedCodeBackground: 'rgba(0, 0, 0, 0)',
    highlightedTokenColor: 'rgb(26, 37, 48)'
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

test('matches select controls to textual input surfaces', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  await page.locator('main a[href="http://dev.nodeca.com"]').hover()
  /* Let the link's hover transition settle before comparing its final tint. */
  await page.waitForTimeout(150)

  const presentation = await page.evaluate(() => {
    const readControl = (selector) => {
      const element = document.querySelector(selector)
      if (!element) throw new Error(`Missing control fixture: ${selector}`)
      const styles = getComputedStyle(element)
      const bounds = element.getBoundingClientRect()
      return {
        appearance: styles.appearance,
        backgroundColor: styles.backgroundColor,
        backgroundImage: styles.backgroundImage,
        borderColor: styles.borderColor,
        borderRadius: styles.borderRadius,
        boxShadow: styles.boxShadow,
        color: styles.color,
        height: bounds.height,
        paddingBlockEnd: Number.parseFloat(styles.paddingBlockEnd),
        paddingBlockStart: Number.parseFloat(styles.paddingBlockStart),
        paddingInlineEnd: Number.parseFloat(styles.paddingInlineEnd),
        paddingInlineStart: Number.parseFloat(styles.paddingInlineStart),
        width: bounds.width
      }
    }

    const link = document.querySelector('main a[href="http://dev.nodeca.com"]')
    if (!link) throw new Error('Link palette fixture is missing')

    return {
      datalistInput: readControl('#browser-choice'),
      disabledSelect: readControl('#destination-disabled'),
      disabledText: readControl('#name-disabled'),
      linkHoverBackground: getComputedStyle(link).backgroundColor,
      multipleSelect: readControl('#multiple-select'),
      multipleOptions: [...document.querySelectorAll('#multiple-select option')]
        .map(option => {
          const styles = getComputedStyle(option)
          return {
            backgroundColor: styles.backgroundColor,
            borderBlockStartColor: styles.borderBlockStartColor,
            borderBlockStartWidth: Number.parseFloat(styles.borderBlockStartWidth),
            borderRadius: styles.borderRadius,
            color: styles.color,
            paddingBlockStart: Number.parseFloat(styles.paddingBlockStart),
            selected: option.selected
          }
        }),
      multipleSelectOverflow: {
        clientHeight: document.querySelector('#multiple-select').clientHeight,
        scrollHeight: document.querySelector('#multiple-select').scrollHeight
      },
      select: readControl('#destination'),
      text: readControl('#name-populated'),
      topBarSelect: readControl('.mine-top-bar-select')
    }
  })

  for (const property of [
    'appearance',
    'backgroundColor',
    'backgroundImage',
    'borderColor',
    'borderRadius',
    'boxShadow',
    'height',
    'paddingBlockEnd',
    'paddingBlockStart',
    'paddingInlineEnd',
    'paddingInlineStart',
    'width'
  ]) {
    expect(presentation.select[property]).toBe(presentation.text[property])
    expect(presentation.disabledSelect[property]).toBe(presentation.disabledText[property])
  }
  expect(presentation.select.appearance).toBe('auto')
  expect(presentation.select.paddingInlineEnd).toBe(presentation.select.paddingInlineStart)
  expect(presentation.datalistInput).toEqual(presentation.text)
  expect(presentation.multipleSelect.width).toBe(presentation.text.width)
  expect(presentation.multipleSelect.borderColor).toBe(presentation.text.borderColor)
  expect(presentation.multipleSelect.borderRadius).toBe(presentation.text.borderRadius)
  expect(presentation.multipleSelect.paddingInlineStart).toBe(presentation.text.paddingInlineStart)
  expect(presentation.multipleSelect.backgroundImage).toBe('none')
  expect(presentation.multipleSelect.height).toBeGreaterThan(presentation.text.height)
  expect(presentation.multipleSelectOverflow.scrollHeight).toBe(presentation.multipleSelectOverflow.clientHeight)
  const selectedOptions = presentation.multipleOptions.filter(option => option.selected)
  const unselectedOptions = presentation.multipleOptions.filter(option => !option.selected)
  expect(selectedOptions).toHaveLength(2)
  expect(selectedOptions[0].backgroundColor).toBe(presentation.linkHoverBackground)
  expect(selectedOptions[0].borderBlockStartColor).toBe(presentation.multipleSelect.backgroundColor)
  expect(selectedOptions[0].borderBlockStartWidth).toBe(1)
  expect(selectedOptions[0].borderRadius).not.toBe('0px')
  expect(selectedOptions[0].color).toBe(presentation.text.color)
  expect(selectedOptions[0].paddingBlockStart).toBeGreaterThan(0)
  expect(unselectedOptions).toHaveLength(1)
  expect(unselectedOptions[0].backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(presentation.topBarSelect.height).toBeLessThan(presentation.text.height)
  expect(presentation.topBarSelect.width).toBeLessThan(presentation.text.width)
  expect(presentation.topBarSelect.borderRadius).toBe(presentation.text.borderRadius)
  expect(presentation.topBarSelect.backgroundImage).toContain('linear-gradient')
  expect(presentation.topBarSelect.boxShadow).toBe(presentation.text.boxShadow)
  expect(presentation.topBarSelect.paddingInlineEnd).toBe(presentation.topBarSelect.paddingInlineStart)

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForTimeout(150)
  const darkSelection = await page.evaluate(() => {
    const option = document.querySelector('#multiple-select option:checked')
    const link = document.querySelector('main a[href="http://dev.nodeca.com"]')
    if (!option || !link) throw new Error('Multiple-select palette fixtures are missing')
    return {
      background: getComputedStyle(option).backgroundColor,
      color: getComputedStyle(option).color,
      link: getComputedStyle(link).backgroundColor,
      text: getComputedStyle(document.body).color
    }
  })
  expect(darkSelection.background).toBe(darkSelection.link)
  expect(darkSelection.color).toBe(darkSelection.text)
})

test('reveals constrained validity after user interaction', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)

  const readValidity = () => page.evaluate(() => {
    const email = document.querySelector('#validation-email')
    const url = document.querySelector('#validation-url')
    if (!email || !url) throw new Error('Validation fixtures are missing')

    const resolveColor = (token) => {
      const probe = document.createElement('span')
      probe.style.color = `var(${token})`
      document.body.append(probe)
      const color = getComputedStyle(probe).color
      probe.remove()
      return color
    }

    return {
      colors: {
        control: resolveColor('--control-border'),
        invalid: resolveColor('--invalid'),
        valid: resolveColor('--valid')
      },
      email: {
        backgroundImage: getComputedStyle(email).backgroundImage,
        border: getComputedStyle(email).borderColor,
        boxShadow: getComputedStyle(email).boxShadow,
        invalid: email.matches(':invalid'),
        stateColor: getComputedStyle(email).getPropertyValue('--control-state').trim(),
        userInvalid: email.matches(':user-invalid')
      },
      tokens: {
        invalid: getComputedStyle(document.documentElement).getPropertyValue('--invalid').trim(),
        valid: getComputedStyle(document.documentElement).getPropertyValue('--valid').trim()
      },
      url: {
        backgroundImage: getComputedStyle(url).backgroundImage,
        border: getComputedStyle(url).borderColor,
        boxShadow: getComputedStyle(url).boxShadow,
        stateColor: getComputedStyle(url).getPropertyValue('--control-state').trim(),
        userValid: url.matches(':user-valid'),
        valid: url.matches(':valid')
      }
    }
  })

  const pending = await readValidity()
  expect(pending.email.invalid).toBe(true)
  expect(pending.url.valid).toBe(true)
  expect(pending.email.userInvalid).toBe(false)
  expect(pending.url.userValid).toBe(false)
  expect(pending.email.stateColor).toBe('')
  expect(pending.url.stateColor).toBe('')
  expect(pending.email.border).toBe(pending.colors.control)
  expect(pending.url.border).toBe(pending.colors.control)

  await page.locator('#validation-email').fill('still-not-an-email')
  await page.locator('#validation-url').fill('https://example.com/docs')
  await page.locator('#validation-form input[type="submit"]').click()
  await page.waitForTimeout(200)

  const interacted = await readValidity()
  expect(interacted.email.userInvalid).toBe(true)
  expect(interacted.url.userValid).toBe(true)
  expect(interacted.email.border).toBe(interacted.colors.invalid)
  expect(interacted.url.border).toBe(interacted.colors.valid)
  expect(interacted.email.stateColor).toBe(interacted.tokens.invalid)
  expect(interacted.url.stateColor).toBe(interacted.tokens.valid)
  expect(interacted.email.backgroundImage).not.toBe(pending.email.backgroundImage)
  expect(interacted.url.backgroundImage).not.toBe(pending.url.backgroundImage)
  expect(interacted.email.boxShadow).not.toBe(pending.email.boxShadow)
  expect(interacted.url.boxShadow).not.toBe(pending.url.boxShadow)
  expect(interacted.email.boxShadow).not.toBe(interacted.url.boxShadow)

  await page.emulateMedia({ colorScheme: 'dark' })
  await page.waitForTimeout(200)
  const dark = await readValidity()
  expect(dark.email.border).toBe(dark.colors.invalid)
  expect(dark.url.border).toBe(dark.colors.valid)
  expect(dark.email.stateColor).toBe(dark.tokens.invalid)
  expect(dark.url.stateColor).toBe(dark.tokens.valid)
  expect(dark.colors.invalid).not.toBe(interacted.colors.invalid)
  expect(dark.colors.valid).not.toBe(interacted.colors.valid)
  expect(dark.email.boxShadow).not.toBe(interacted.email.boxShadow)
  expect(dark.url.boxShadow).not.toBe(interacted.url.boxShadow)
})

test('spaces every form control demo consistently before its source', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)
  const formControlExamples = [
    'hidden',
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
    'select',
    'datalist',
    'output',
    'meter',
    'progress',
    'fieldset',
    'validation',
    'readonly',
    'multiple',
    'indeterminate'
  ]
  const gaps = await page.evaluate((ids) => ids.map(id => {
    const heading = document.querySelector(`a#${id}`)?.parentElement
    if (!heading) throw new Error(`Missing form control heading: ${id}`)

    let sibling = heading.nextElementSibling
    while (sibling && sibling.tagName !== 'PRE') sibling = sibling.nextElementSibling
    const fixture = sibling?.previousElementSibling
    if (!fixture || !sibling) throw new Error(`Missing form control fixture or source: ${id}`)

    return sibling.getBoundingClientRect().top - fixture.getBoundingClientRect().bottom
  }), formControlExamples)

  expect(gaps).toHaveLength(formControlExamples.length)
  for (const gap of gaps) {
    expect(gap).toBeGreaterThan(0)
    expect(gap).toBeCloseTo(gaps[0], 1)
  }
})

test('keeps form control fixtures valid and internally consistent', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)

  const audit = await page.evaluate(() => {
    const main = document.querySelector('main')
    if (!main) throw new Error('Guide content is missing')

    const ids = [...main.querySelectorAll('button[id], datalist[id], input[id], meter[id], output[id], progress[id], select[id], textarea[id]')]
      .map(element => element.id)
    const duplicateIds = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))]
    const missingLabelTargets = [...main.querySelectorAll('label[for]')]
      .map(label => label.getAttribute('for'))
      .filter(id => !id || !document.getElementById(id))
    const placeholderTypes = new Set([
      'email',
      'number',
      'password',
      'search',
      'tel',
      'text',
      'url'
    ])
    const invalidPlaceholderTypes = [...main.querySelectorAll('input[placeholder]')]
      .filter(input => !placeholderTypes.has(input.type))
      .map(input => input.type)
    const stateGroups = [
      ['scales', 'horns', 'teeth'],
      ['color-head', 'color-body', 'color-foot'],
      ['trip-start', 'empty-date', 'trip-end'],
      ['meeting-time', 'meeting-time-empty', 'meeting-time-disabled'],
      ['email-populated', 'email-placeholder', 'email-disabled'],
      ['avatar', 'avatar-disabled'],
      ['image-login', 'image-login-disabled'],
      ['start-month', 'empty-month', 'end-month'],
      ['number-populated', 'number-placeholder', 'number-disabled'],
      ['password-populated', 'password-placeholder', 'password-disabled'],
      ['huey', 'dewey', 'louie'],
      ['volume', 'cowbell'],
      ['search-populated', 'search-placeholder', 'search-disabled'],
      ['phone-populated', 'phone-placeholder', 'phone-disabled'],
      ['name-populated', 'name-placeholder', 'name-disabled'],
      ['story', 'story-placeholder', 'story-disabled'],
      ['appt', 'appt-empty', 'appt-disabled'],
      ['url-populated', 'url-placeholder', 'url-disabled'],
      ['week-example', 'week-empty', 'week-disabled'],
      ['destination', 'destination-disabled'],
      ['validation-email', 'validation-url']
    ]
    const inconsistentHeights = stateGroups.flatMap((group) => {
      const controls = group.map(id => document.getElementById(id))
      if (controls.some(control => !control)) return [group]
      const heights = controls.map(control => control.getBoundingClientRect().height)
      return heights.every(height => height === heights[0]) ? [] : [group]
    })
    const defaultTextInput = document.getElementById('user-id')
    const explicitTextInput = document.getElementById('name-populated')
    const defaultTextMismatch = !defaultTextInput ||
      !explicitTextInput ||
      defaultTextInput.hasAttribute('type') ||
      defaultTextInput.type !== 'text' ||
      defaultTextInput.getBoundingClientRect().height !== explicitTextInput.getBoundingClientRect().height
    const activeImageInput = document.getElementById('image-login')
    const disabledImageInput = document.getElementById('image-login-disabled')
    const imageInputOpacity = {
      active: activeImageInput && getComputedStyle(activeImageInput).opacity,
      disabled: disabledImageInput && getComputedStyle(disabledImageInput).opacity
    }
    const hiddenInput = document.querySelector('input[name="csrf-token"]')
    const indeterminateCheckbox = /** @type {HTMLInputElement | null} */ (document.getElementById('indeterminate-checkbox'))
    const quantity = /** @type {HTMLInputElement | null} */ (document.getElementById('quantity'))
    const quantityOutput = /** @type {HTMLOutputElement | null} */ (document.getElementById('quantity-output'))
    const multipleTypes = [...main.querySelectorAll('[multiple]')]
      .map(element => element.tagName === 'INPUT' ? element.type : element.tagName.toLowerCase())
    const fixtureIds = [
      'hidden',
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
      'select',
      'datalist',
      'output',
      'meter',
      'progress',
      'fieldset',
      'validation',
      'readonly',
      'multiple',
      'indeterminate'
    ]
    const fixtureSelector = 'button, datalist, input, label, legend, meter, option, optgroup, output, progress, select, small, textarea'
    const projectControls = root => [...root.querySelectorAll(fixtureSelector)]
      .map(control => ({
        attributes: [...control.attributes]
          .map(attribute => [attribute.name, attribute.value])
          .sort(([first], [second]) => first.localeCompare(second)),
        tag: control.tagName.toLowerCase(),
        text: control.tagName === 'INPUT'
          ? ''
          : control.textContent?.replace(/\s+/g, ' ').trim()
      }))
    const fixtureMismatches = fixtureIds.flatMap((id) => {
      const heading = document.querySelector(`a#${id}`)?.parentElement
      if (!heading) return [id]

      let source = heading.nextElementSibling
      while (source && source.tagName !== 'PRE') source = source.nextElementSibling
      if (!source) return [id]

      const fixtureControls = []
      let fixture = heading.nextElementSibling
      while (fixture && fixture !== source) {
        if (fixture.tagName !== 'DETAILS') {
          fixtureControls.push(...fixture.querySelectorAll(fixtureSelector))
        }
        fixture = fixture.nextElementSibling
      }

      const template = document.createElement('template')
      template.innerHTML = source.textContent || ''
      const actual = projectControls({ querySelectorAll: () => fixtureControls })
      const documented = projectControls(template.content)
      return JSON.stringify(actual) === JSON.stringify(documented) ? [] : [id]
    })

    return {
      defaultTextMismatch,
      duplicateIds,
      fixtureMismatches,
      hiddenInputDisplay: hiddenInput && getComputedStyle(hiddenInput).display,
      imageInputOpacity,
      indeterminateState: indeterminateCheckbox?.indeterminate,
      inconsistentHeights,
      invalidPlaceholderTypes,
      missingLabelTargets,
      multipleTypes,
      outputState: {
        input: quantity?.value,
        output: quantityOutput?.value
      }
    }
  })

  expect(audit).toEqual({
    defaultTextMismatch: false,
    duplicateIds: [],
    fixtureMismatches: [],
    hiddenInputDisplay: 'none',
    imageInputOpacity: {
      active: '1',
      disabled: '0.5'
    },
    indeterminateState: true,
    inconsistentHeights: [],
    invalidPlaceholderTypes: [],
    missingLabelTargets: [],
    multipleTypes: ['email', 'file', 'select'],
    outputState: {
      input: '40',
      output: '40'
    }
  })
})

test('wires the form control demonstrations', async ({ page, siteURL }) => {
  await gotoGuide(page, siteURL)

  const quantity = page.locator('#quantity')
  await quantity.focus()
  await quantity.press('ArrowRight')
  await expect(page.locator('#quantity-output')).toHaveText('41')
  expect(await page.locator('#indeterminate-checkbox').evaluate(element => /** @type {HTMLInputElement} */ (element).indeterminate)).toBe(true)
})

test('keeps mobile navigation usable around anchored content', async ({ page, siteURL }) => {
  await page.setViewportSize({ width: 320, height: 800 })
  await page.goto(`${siteURL}/guide/#input-types`, { waitUntil: 'domcontentloaded' })

  const geometry = await page.evaluate(() => {
    const nav = document.querySelector('nav')
    const target = document.querySelector('#input-types')
    const roundControl = document.querySelector('.style-round')
    const themeControl = document.querySelector('.mine-top-bar-select')
    if (!nav || !target || !roundControl || !themeControl) throw new Error('Navigation fixtures are missing')

    const roundBounds = roundControl.getBoundingClientRect()
    nav.scrollLeft = nav.scrollWidth
    const themeBounds = themeControl.getBoundingClientRect()

    return {
      navBottom: nav.getBoundingClientRect().bottom,
      navHeight: nav.getBoundingClientRect().height,
      navScrollbarWidth: getComputedStyle(nav).scrollbarWidth,
      navScrollableWidth: nav.scrollWidth - nav.clientWidth,
      targetTop: target.getBoundingClientRect().top,
      roundLeft: roundBounds.left,
      roundRight: roundBounds.right,
      themeLeft: themeBounds.left,
      themeRight: themeBounds.right,
      viewportWidth: document.documentElement.clientWidth
    }
  })

  expect(geometry.navHeight).toBeLessThanOrEqual(64)
  expect(geometry.navScrollbarWidth).toBe('none')
  expect(geometry.navScrollableWidth).toBeGreaterThan(0)
  expect(geometry.targetTop).toBeGreaterThanOrEqual(geometry.navBottom)
  expect(geometry.roundLeft).toBeGreaterThanOrEqual(0)
  expect(geometry.roundRight).toBeLessThanOrEqual(geometry.viewportWidth)
  expect(geometry.themeLeft).toBeGreaterThanOrEqual(0)
  expect(geometry.themeRight).toBeLessThanOrEqual(geometry.viewportWidth)
})

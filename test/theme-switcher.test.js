import assert from 'node:assert/strict'
import test from 'node:test'

test('module imports without browser globals', async () => {
  const module = await import(`../src/theme-switcher.js?server=${Date.now()}`)
  assert.equal(typeof module.toggleTheme, 'function')
  assert.equal(typeof module.toggleType, 'function')
})

test('toggleType cycles a custom storage key', async () => {
  const values = new Map([['article-type', 'sans']])
  const classes = new Set()
  const element = {
    classList: {
      toggle (name, enabled) {
        if (enabled) classes.add(name)
        else classes.delete(name)
      }
    }
  }
  const mediaQuery = {
    matches: false,
    addEventListener () {}
  }

  globalThis.window = {
    matchMedia: () => mediaQuery,
    sessionStorage: {
      getItem: key => values.get(key) ?? null,
      setItem: (key, value) => values.set(key, value)
    }
  }
  globalThis.document = {
    documentElement: element,
    querySelector: () => element
  }

  try {
    const { toggleType } = await import(`../src/theme-switcher.js?test=${Date.now()}`)
    toggleType('article', 'article-type')
    assert.equal(values.get('article-type'), 'serif')
    assert.equal(classes.has('serif'), true)
    assert.equal(classes.has('sans'), false)
    assert.equal(classes.has('round'), false)
  } finally {
    delete globalThis.window
    delete globalThis.document
  }
})

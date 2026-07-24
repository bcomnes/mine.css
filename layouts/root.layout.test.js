import assert from 'node:assert/strict'
import test from 'node:test'

import RootLayout from './root.layout.js'
import { themeOptions } from '../globals/theme-options.js'

test('layout escapes data while preserving rendered Markdown children', async () => {
  const markup = await RootLayout({
    vars: {
      title: '<script>alert(1)</script>',
      siteName: 'mine.css',
      version: '1.2.3'
    },
    scripts: ['/global.client.js'],
    styles: ['/global.css'],
    children: '<h1>Rendered Markdown</h1>',
    // The layout does not inspect page metadata, but DOMStack includes it in every call.
    page: /** @type {any} */ ({}),
    pages: []
  })

  assert.match(markup, /<title>&lt;script&gt;alert\(1\)&lt;\/script&gt; \| mine\.css<\/title>/)
  assert.doesNotMatch(markup, /localStorage/)
  assert.doesNotMatch(markup, /dataset\.hljsTheme/)
  assert.match(markup, /<script src="\/global\.client\.js" type="module" blocking="render"><\/script>/)
  assert.match(markup, /<link rel="stylesheet" href="?\/global\.css"?\s*\/>/)
  assert.match(markup, /<link\s+data-mine-hljs-stylesheet\s+rel="stylesheet"\s+href="\/highlight\.js\/default\/index\.css"\s+blocking="render"\s*>/)
  assert.match(markup, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/)
  assert.match(markup, /<a href="?\/"?><span class="mine-top-bar-label">mine\.css<\/span><\/a>\s*<small class="mine-top-bar-version">v1\.2\.3<\/small>/)
  assert.doesNotMatch(markup, /<a[^>]*>(?:(?!<\/a>)[\s\S])*mine-top-bar-version(?:(?!<\/a>)[\s\S])*<\/a>/)
  assert.match(markup, /<select class="mine-top-bar-select" aria-label="color theme">/)
  for (const { value, label } of themeOptions) {
    assert.match(markup, new RegExp(`<option value=(?:"${value}"|${value})>${label}</option>`))
  }
  assert.match(markup, /<main class="markdown-body mine-layout">\s*<h1>Rendered Markdown<\/h1>/)
  assert.doesNotMatch(markup, /&lt;h1&gt;Rendered Markdown/)
})

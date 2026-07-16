import assert from 'node:assert/strict'
import test from 'node:test'

import RootLayout from '../root.layout.js'

test('layout escapes data while preserving rendered Markdown children', async () => {
  const markup = await RootLayout({
    vars: {
      title: '<script>alert(1)</script>',
      siteName: 'mine.css'
    },
    children: '<h1>Rendered Markdown</h1>'
  })

  assert.match(markup, /<title>&lt;script&gt;alert\(1\)&lt;\/script&gt; \| mine\.css<\/title>/)
  assert.match(markup, /localStorage\.getItem\('mine-theme'\)/)
  assert.match(markup, /document\.documentElement\.dataset\.hljsTheme = theme/)
  assert.match(markup, /<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">/)
  assert.match(markup, /<select class="mine-top-bar-select" aria-label="color theme">/)
  assert.match(markup, /<main class="markdown-body mine-layout">\s*<h1>Rendered Markdown<\/h1>/)
  assert.doesNotMatch(markup, /&lt;h1&gt;Rendered Markdown/)
})

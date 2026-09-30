import { readFile, readdir, writeFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { build, context } from 'esbuild'

const root = resolve(new URL('..', import.meta.url).pathname)
const src = join(root, 'src')
const dist = join(root, 'dist')

const entries = [
  ['index.css', 'mine.css'],
  ['layout.css', 'layout.css'],
  ['top-bar.css', 'top-bar.css']
]

for (const file of await readdir(join(src, 'themes'))) {
  if (file.endsWith('.css')) entries.push([join('themes', file), join('themes', file)])
}

for (const theme of await readdir(join(src, 'highlight.js'), { withFileTypes: true })) {
  if (!theme.isDirectory() || theme.name === 'shared') continue
  for (const file of await readdir(join(src, 'highlight.js', theme.name))) {
    if (!file.endsWith('.css')) continue
    entries.push([
      join('highlight.js', theme.name, file),
      join('highlight.js', theme.name, file)
    ])
  }
}

const watch = process.argv.includes('--watch')
const builds = entries.map(([input, output]) => ({
  absWorkingDir: root,
  bundle: true,
  entryPoints: [join(src, input)],
  outfile: join(dist, output),
  sourcemap: true,
  legalComments: 'inline',
  logLevel: 'warning'
}))

if (watch) {
  const contexts = await Promise.all(builds.map(options => context(options)))
  await Promise.all(contexts.map(buildContext => buildContext.watch()))
  await new Promise(() => {})
} else {
  await Promise.all(builds.map(async options => {
    await build(options)
    const css = await readFile(options.outfile, 'utf8')
    await writeFile(options.outfile, css.replace(/[\t ]+(?=\r?\n)/g, ''))
  }))
}

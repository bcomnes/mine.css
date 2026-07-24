import { readFile } from 'node:fs/promises'

// These variables are available to every page and have the lowest precedence.

export default async function () {
  const packageMetadata = /** @type {{ version: string }} */ (JSON.parse(
    await readFile(new URL('../package.json', import.meta.url), 'utf8')
  ))

  return {
    siteName: 'bcomnes/mine.css',
    siteUrl: 'https://mine-css.neocities.org',
    version: packageMetadata.version
  }
}

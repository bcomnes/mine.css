declare module 'markdown-it-table-of-contents' {
  import type MarkdownIt from 'markdown-it'

  export interface TableOfContentsOptions {
    includeLevel?: number[]
  }

  const markdownItTableOfContents: MarkdownIt.PluginWithOptions<TableOfContentsOptions>

  export default markdownItTableOfContents
}

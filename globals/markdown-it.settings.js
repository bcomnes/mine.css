/**
 * @import MarkdownIt from 'markdown-it'
 */
import markdownItTOC from 'markdown-it-table-of-contents'

/**
 * @param {MarkdownIt} md
 * @returns {MarkdownIt}
 */
export default function configureMarkdown (md) {
  md.use(markdownItTOC, {
    includeLevel: [1, 2, 3, 4]
  })

  return md
}

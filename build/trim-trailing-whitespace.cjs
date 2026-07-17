/** Remove whitespace inherited from imported stylesheets without reformatting their CSS. */
module.exports = () => ({
  postcssPlugin: 'trim-trailing-whitespace',
  OnceExit (root) {
    const trimRaws = (node) => {
      for (const [name, value] of Object.entries(node.raws)) {
        // Spaces stored as whole raw values can separate CSS tokens, so only
        // trim padding immediately before an actual line ending.
        if (typeof value === 'string') node.raws[name] = value.replace(/[\t ]+(?=\r?\n)/g, '')
      }
    }

    trimRaws(root)
    root.walk(trimRaws)
  }
})

module.exports.postcss = true

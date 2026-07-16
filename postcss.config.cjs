/* Resolve imports and vendor prefixes while preserving native CSS nesting. */
module.exports = (ctx) => ({
  map: { inline: false },
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    autoprefixer: {}
  }
})

module.exports = (ctx) => ({
  map: { inline: false },
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'postcss-dark-theme-class': {
      darkSelector: '.dark-mode',
      lightSelector: '.light-mode'
    },
    'autoprefixer': {}
  }
})

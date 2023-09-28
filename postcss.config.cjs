module.exports = (ctx) => ({
  map: { inline: false },
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'postcss-url': {
      url: 'copy',
      useHash: true,
      assetsPath: 'assets'
    },
    'postcss-dark-theme-class': {
      darkSelector: '.dark-mode',
      lightSelector: '.light-mode'
    },
    'autoprefixer': {},
    'postcss-extend': {},
    'postcss-nesting': {},
    'postcss-browser-reporter': {},
    'postcss-reporter': {}
  }
})

module.exports = {
  plugins: [
    ['autoprefixer', {
      // Use browserslist config from package.json
      grid: 'autoplace'
    }],
    ['cssnano', {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: false,
      }]
    }]
  ]
};
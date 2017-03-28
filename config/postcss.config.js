const autoprefixer = require('autoprefixer')

module.exports = function (webpack) {
  return {
    plugins: [
      autoprefixer({
        browsers: ['last 2 versions']
      })
    ]
  }
}

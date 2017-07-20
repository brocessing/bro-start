const autoprefixer = require('autoprefixer')

module.exports = function ({ file, options, env }) {
  const config = { parser: false, plugins: [] }
  config.plugins.push(autoprefixer({ browsers: ['last 2 versions'] }))
  return config
}

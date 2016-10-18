const startTime = new Date()
const sh = require('kool-shell')
const webpack = require('webpack')
const utils = require('./utils')
const paths = require('../config/paths.config.js')
const webpackConfig = require('../config/webpack.config.prod.js')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const compiler = webpack(webpackConfig)

compiler.apply(new ProgressBarPlugin({
  format: sh.colors.gray('build [:bar] ' + ':percent'),
  clear: true,
  summary: false
}))

sh.step(1, 2, 'Cleaning up the dist folder...')
utils.cleanupDist(paths.dist)
  .catch((err) => {
    sh.error('💀  Error trying to clean the dist folder').error(err).exit(0)
  })
  .then(() => { sh.step(2, 2, 'Running the webpack compiler...') })
  .then(() => utils.webpackCompile(compiler))
  .catch((err) => {
    sh.error('💀  Error during the webpack compilation').error(err).exit(0)
  })
  .then(() => {
    const elapsedTime = ((new Date() - startTime) / 1000).toFixed(3)
    sh.success(`\n👌  Build completed in ${elapsedTime}s !`).exit(0)
  })

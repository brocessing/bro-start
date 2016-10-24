const startTime = new Date()
const sh = require('kool-shell')

const webpack = require('webpack')
const paths = require('../config/paths.config.js')
const webpackConfig = require('../config/webpack.config.prod.js')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const compiler = webpack(webpackConfig)

const store = require('./utils/store')
const buildUtils = require('./utils/build')

compiler.apply(new ProgressBarPlugin({
  format: sh.colors.gray('build [:bar] ' + ':percent'),
  clear: true,
  summary: false
}))

sh.step(1, 3, 'Cleaning up the dist folder...')
buildUtils.cleanupDist(paths.dist)
  .catch((err) => {
    sh.error('💀  Error trying to clean the dist folder').error(err).exit(0)
  })
  .then(() => { sh.step(2, 3, 'Running the webpack compiler...') })
  .then(() => buildUtils.webpackCompile(compiler))
  .catch((err) => {
    sh.error('💀  Error during the webpack compilation').error(err).exit(0)
  })
  .then((stats) => { store.hash = stats.hash })
  .then(() => { sh.step(3, 3, 'Rendering the static content...') })
  .then(() => buildUtils.staticRender(compiler))
  .catch((err) => {
    sh.error('💀  Error during the rendering').error(err).exit(0)
  })
  .then(() => {
    const elapsedTime = ((new Date() - startTime) / 1000).toFixed(3)
    sh.success(`\n👌  Build completed in ${elapsedTime}s !`).exit(0)
  })

const startTime = new Date()

const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.prod.js')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const paths = require('../config/paths.config.js')
const store = require('./utils/store')
const cleanup = require('./utils/cleanup')
const renderPages = require('./utils/renderPages')
const writePages = require('./utils/writePages')

const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/log'))
  .use(require('kool-shell/plugins/exit'))

const compiler = webpack(webpackConfig)

compiler.apply(new ProgressBarPlugin({
  format: sh.colors.gray('build [:bar] ' + ':percent'),
  clear: true,
  summary: false
}))

Promise.resolve()
  .then(() => sh.step(1, 3, 'Cleaning up the build folder...'))
  .then(() => cleanup(paths.build))
  .catch(err => {
    sh.error('Error trying to clean the dist folder')
    sh.error(err)
    sh.exit(0)
  })

  .then(() => sh.step(2, 3, 'Running the webpack compiler...'))
  .then(() => {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (!err) resolve(stats)
        else reject(err)
      })
    })
  })
  .catch(err => {
    sh.error('Error during the webpack compilation')
    sh.error(err)
    sh.exit(0)
  })

  .then(stats => { store.hash = stats.hash })
  .then(() => sh.step(3, 3, 'Rendering the static content...'))
  .then(() => renderPages())
  .then(pages => writePages(pages))
  .catch(err => {
    sh.error('Error during the rendering')
    sh.error(err)
    sh.exit(0)
  })

  .then(() => {
    const elapsedTime = ((new Date() - startTime) / 1000).toFixed(3)
    sh.log()
    sh.success(`Build completed in ${elapsedTime}s !\n`)
    sh.exit(0)
  })

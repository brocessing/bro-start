const sh = require('kool-shell')
const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev.js')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const compiler = webpack(webpackConfig)

const browserSync = require('browser-sync')
const serverConfig = require('../config/devserver.config.js')
const paths = require('../config/paths.config.js')
const pjson = require('../package.json')
const tunnelDomain = pjson.name.replace(/[^0-9a-z]/gi, '').substring(0, 20)

const utils = require('./utils')
const templatingConfig = require('../config/templating.config.js')
const content = utils.content(paths.content, templatingConfig.yamlSafeload)

let hash = null
compiler.plugin('done', () => { hash = compiler.records.hash })

content.load()
  .then((res) => { sh.success(res).exit(0) })
  .catch((err) => { sh.error(err).exit(0) })

function templateMiddleware (req, res, next) {
  // const compilerData = {
  //   hash: hash,
  //   isProduction: false
  // }
  console.log(hash)
  next()
}

browserSync.init({
  server: {
    baseDir: paths.src
  },
  open: false,
  reloadOnRestart: true,
  notify: false,
  port: serverConfig.port || 3000,
  xip: serverConfig.xip,
  tunnel: serverConfig.tunnel ? tunnelDomain : false,
  minify: false,
  middleware: [
    templateMiddleware,
    webpackDevMiddleware(compiler, {
      contentBase: paths.src,
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    }),
    webpackHotMiddleware(compiler)
  ]
})

const path = require('path')
const browserSync = require('browser-sync')
const paths = require('../config/paths.config')
const devServConf = require('../config/devserver.config')
const pjson = require('../package.json')
const store = require('./utils/store')

const webpack = require('webpack')
const webpackConfig = require('../config/webpack.config.dev.js')
const webpackDevMiddleware = require('webpack-dev-middleware')
const webpackHotMiddleware = require('webpack-hot-middleware')
const templateMiddleware = require('./utils/templateMiddleware')

const bs = browserSync.create()
const compiler = webpack(webpackConfig)
const tunnelDomain = pjson.name.replace(/[^0-9a-z]/gi, '').substring(0, 20)
const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/log'))
  .use(require('kool-shell/plugins/exit'))

let isInit = false

sh.step(1, 2, 'Running the webpack compiler...')
const hotMiddleware = webpackHotMiddleware(compiler)
const devMiddleware = webpackDevMiddleware(compiler, {
  publicPath: paths.public,
  stats: {
    colors: true,
    hash: false,
    timings: false,
    chunks: false,
    chunkModules: false,
    modules: false
  }
})

const middlewares = [
  templateMiddleware,
  devMiddleware,
  hotMiddleware
]

compiler.plugin('done', () => {
  // store hash to reuse it like a global variable
  store.hash = compiler.records.hash
  // init the browserSync server once a first build is ready
  if (!isInit) {
    isInit = true
    process.nextTick(init)
  }
})

function init () {
  isInit = true
  sh.step(2, 2, 'Starting the browser-sync server...')
  bs.init({
    server: { baseDir: paths.static },
    open: false,
    reloadOnRestart: true,
    notify: false,
    offline: devServConf.offline || false,
    port: devServConf.port || 3000,
    xip: !devServConf.offline ? devServConf.xip : false,
    tunnel: !devServConf.offline && devServConf.tunnel ? tunnelDomain : false,
    minify: false,
    middleware: middlewares,
    files: [
      path.join(paths.layouts, '**/*'),
      path.join(paths.static, '**/*')
    ]
  })
}

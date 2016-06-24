const path                 = require('path');
const webpack              = require('webpack');
const config               = require('../webpack.config');
const compiler             = webpack(config);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync          = require('browser-sync');
const server               = require('./server.js');
const localtunnelDomain    = require('../package.json').name
                            .replace(/[^0-9a-z]/gi, '')
                            .substring(0,20);

browserSync.init({
  open: false,
  reloadOnRestart: true,
  notify: false,
  tunnel: localtunnelDomain,
  proxy: `${server.ip}:${server.port}`,
  files: [
    path.join(config.paths.static,'**/*'),
    path.join(config.paths.src,'views/**/*')
  ],
  middleware: [
    webpackDevMiddleware(compiler, {
      contentBase: config.paths.static,
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
});

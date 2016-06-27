const fs                   = require('fs');
const url                  = require('url');
const minifier             = require('html-minifier');
const path                 = require('path');
const webpack              = require('webpack');
const config               = require('../webpack.config');
const compiler             = webpack(config);
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const browserSync          = require('browser-sync');
const server               = require('./server.js');
const mu                   = require('mu2');
const localtunnelDomain    = require('../package.json').name
                              .replace(/[^0-9a-z]/gi, '')
                              .substring(0,20);


mu.root = __dirname + '/../src/templates';

let hash = null;
compiler.plugin('done', () => { hash = compiler.records.hash });

function muMiddleware(req, res, next) {

  //parse url - append index.html to / if needed
  let fileUrl = url.parse(req.url).pathname;
  if (fileUrl.slice(-1) === '/') fileUrl += 'index.html';

  //remove require & mu cache
  delete require.cache[require.resolve('../src/pages.config.js')];
  const pages = require('../src/pages.config.js');
  mu.clearCache();

  //if the page exists in the page.config.js list
  if (fileUrl.match(/\.html$/) && pages[fileUrl.slice(1)]) {
    res.setHeader('Content-Type', 'text/html');
    const page = pages[fileUrl.slice(1)];
    const compilerData = {
      hash: hash,
      isProduction: false
    };
    const stream = mu.compileAndRender(page.template,
      Object.assign({compiler: compilerData}, page.data));
    stream.pipe(res);
    //handle error to avoid breaking browsersync features
    stream.on('error', (e) => {
      res.end(`<html><head></head><body>${e.toString()}</body></html>`);
    });
  } else {
    next();
  }
}

browserSync.init({
  open: false,
  reloadOnRestart: true,
  notify: false,
  tunnel: localtunnelDomain,
  proxy: `${server.ip}:${server.port}`,
  minify: false,
  files: [
    path.join(config.paths.static,'**/*'),
    path.join(config.paths.src,'templates/**/*'),
    path.join(config.paths.src,'pages.config.js'),
  ],
  middleware: [
    muMiddleware,
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

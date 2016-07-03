const fs                   = require('fs');
const url                  = require('url');
const path                 = require('path');
const browserSync          = require('browser-sync');
const xtend                = require('xtend');
const mu                   = require('mu2');
const webpack              = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const createConfig         = require('./createConfig');
const localtunnelDomain    = require(__dirname + '/../../package.json').name
                              .replace(/[^0-9a-z]/gi, '')
                              .substring(0,20);

function createDevServer(options = {}) {

  const config = createConfig(options);
  const pagesPath = path.join(config.options.paths.src, 'pages.config.js');
  const muDefaultRoot = './';
  let pagesConfig = require(pagesPath);
  let hash, compiler;

  const muMiddleware = (req, res, next) => {
    // parse url - append index.html to / if needed
    let fileUrl = url.parse(req.url).pathname;
    if (fileUrl.slice(-1) === '/') fileUrl += 'index.html';

    // remove require & mu cache
    delete require.cache[require.resolve(pagesPath)];
    pagesConfig = require(pagesPath);
    mu.root = (pagesConfig.options && pagesConfig.options.cwd)
    ? pagesConfig.options.cwd : muDefaultRoot;
    mu.clearCache();

    // if the page exists in the page.config.js list
    if (fileUrl.match(/\.html$/) && pagesConfig.pages[fileUrl.slice(1)]) {
      res.setHeader('Content-Type', 'text/html');
      const page = pagesConfig.pages[fileUrl.slice(1)];
      const compilerData = {
        hash: hash,
        isProduction: false
      };
      const stream = mu.compileAndRender(page.template,
        xtend({compiler: compilerData}, page.data));
      stream.pipe(res);
      // handle errors to avoid breaking browsersync features
      stream.on('error', (e) => {
        res.end(`<html><head></head><body>${e.toString()}</body></html>`);
      });
    // if the page doesn't exist, jump to the next middleware
    } else {
      next();
    }
  }

  const startBrowserSync = () => {
    browserSync.init({
      server: {
        baseDir: config.options.paths.static
      },
      open: false,
      reloadOnRestart: true,
      notify: false,
      tunnel: localtunnelDomain,
      minify: false,
      files: [
        path.join(mu.root, '**/*.mustache'),
        path.join(config.options.paths.static, '**/*'),
        path.join(config.options.paths.src, 'pages.config.js'),
      ],
      middleware: [
        muMiddleware,
        webpackDevMiddleware(compiler, {
          contentBase: config.options.paths.static,
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
  }

  const run = () => {
    return new Promise((resolve, reject) => {
      mu.root = (pagesConfig.options && pagesConfig.options.cwd)
        ? pagesConfig.options.cwd : muDefaultRoot;
      compiler = webpack(config.webpackConfig);
      compiler.plugin('done', () => {
        hash = compiler.records.hash;
        resolve();
      });
      startBrowserSync();
    });
  }

  return { run, config };

}

module.exports = createDevServer;
const fs                = require('fs');
const path              = require('path');
const webpack           = require('webpack');
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const mu                = require('mu2');
const createConfig      = require('./createConfig');
const sh                = require('./Shell');

function createBuild(options = {}) {

  const config        = createConfig(options);
  const pagesPath     = path.join(config.options.paths.src, 'pages.config.js');
  const pagesConfig   = require(pagesPath);
  const muDefaultRoot = './';
  let hash, compiler, output;

  const buildMustache = () => {
    return new Promise((resolve, reject) => {
      const compilerData = {
        hash: hash,
        isProduction: true
      };
      for (const k in pagesConfig.pages) {
        const page = pagesConfig.pages[k];
        const fileStream = fs.createWriteStream(path.join(output,k));
        const templateStream = mu.compileAndRender(page.template,
          Object.assign({compiler: compilerData}, page.data));
        templateStream.pipe(fileStream);
        templateStream.on('error', (e) => reject(e));
        fileStream.on('finish', () => resolve());
      }
    });
  }

  const run = () => {
    return new Promise((resolve, reject) => {
      mu.root = (pagesConfig.options && pagesConfig.options.cwd)
        ? pagesConfig.options.cwd : muDefaultRoot;
      compiler = webpack(config.webpackConfig);
      compiler.apply(new ProgressBarPlugin());
      compiler.run((err, stats) => {
        if (!err) {
          hash = stats.hash;
          output = stats.compilation.outputOptions.path;
          sh.info('Start building mustache templates...');
          buildMustache()
            .then(() => {
              resolve()
              sh.success('Build completed\n');
            })
            .catch((e) => {
              reject(e)
              sh.error('Build failed\n');
            });
        } else {
          reject(err);
        }
      });
    });
  }

  return { run };

}

module.exports = createBuild;

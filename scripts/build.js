const fs                = require('fs');
const path              = require('path');
const webpack           = require('webpack');
const config            = require('../webpack.config');
const compiler          = webpack(config);
const ProgressBarPlugin = require('progress-bar-webpack-plugin');
const mu                = require('mu2');
const pages             = require('../src/pages.config.js');

let hash = '';
let output = '';
mu.root = __dirname + '/../src/templates';

compiler.apply(new ProgressBarPlugin());
compiler.run((err, stats) => {
  if (!err) {
    hash = stats.hash;
    output = stats.compilation.outputOptions.path;
    buildMustache();
  }
});

function buildMustache() {
  const compilerData = {
    hash: hash,
    'isProduction': true
  };
  for (const k in pages) {
    const page = pages[k];
    const fileStream = fs.createWriteStream(path.join(output,k));
    const templateStream = mu.compileAndRender(page.template,
      Object.assign({compiler: compilerData}, page.data));
    templateStream.pipe(fileStream);
    templateStream.on('error', (e) => { console.log(e); });
  }
}
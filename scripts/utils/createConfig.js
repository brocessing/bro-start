const path               = require('path');
const webpack            = require('webpack');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

const defaultOptions = {
  isDoodle: false,
  isProduction: (process.env.NODE_ENV === 'production'),
  paths: { cwd: path.resolve(__dirname, '../../') }
}

function createConfig(_options) {

  const options = {
    isDoodle: _options.isDoodle || defaultOptions.isDoodle,
    isProduction: _options.isProduction || defaultOptions.isProduction,
    paths: _options.paths || {}
  }
  const cwd = options.paths.cwd || defaultOptions.paths.cwd;
  options.paths = {
    cwd: cwd,
    base: options.paths.base || (options.isProduction ? './' : '/'),
    static: options.paths.static || path.resolve(cwd, 'src/static'),
    src: options.paths.src || path.join(cwd, 'src'),
    build: options.paths.build || (options.isProduction
      ? path.join(cwd, 'build') : path.resolve(cwd, 'src/static'))
  }

  const CSSExtract = new ExtractTextPlugin('bundle-[hash].css', { allChunks: true });
  const CSSLoaders = options.isProduction ?
                      CSSExtract.extract('style', 'css?-url!stylus')
                      : 'style!css?-url!stylus';

  const specificLoaderIncludes = options.isDoodle ? options.paths.src : [];

  const specificPlugins = [];
  if (options.isProduction) {
    specificPlugins.push(
      new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }),
      new webpack.optimize.DedupePlugin(),
      new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false, screw_ie8: true, drop_console: true },
        output: { comments: false },
        mangle: { screw_ie8 : true }
      }),
      new webpack.optimize.OccurenceOrderPlugin(),
      new CopyWebpackPlugin(
        [{ from: path.join(options.paths.src, 'static'), to: options.paths.build }],
        {
          ignore: ['.DS_Store', '.gitkeep']
        }
      ),
      CSSExtract,
      new CleanWebpackPlugin(['build'], { root: options.paths.cwd, dry: false })
    );
  } else {
    specificPlugins.push(
      new webpack.HotModuleReplacementPlugin(),
      new webpack.NoErrorsPlugin()
    );
  }

  const specificEntries = options.isProduction
    ? []
    : ['webpack-hot-middleware/client?reload=true' ];

  const webpackConfig = {
    entry: [
      path.join(options.paths.src, 'index.js'),
      path.join(options.paths.src, 'index.styl')
    ].concat(specificEntries),
    output: {
      path: options.paths.build,
      publicPath: options.paths.base,
      filename: 'bundle-[hash].js',
      chunkFilename: 'chunk-[id]-[hash].js'
    },
    resolve: {
      extensions: ['', '.js', '.json', '.config.js'],
      alias: {
        'configs': path.resolve(defaultOptions.paths.cwd, 'src/configs'),
        'libs': path.resolve(defaultOptions.paths.cwd, 'src/libs'),
        'utils': path.resolve(defaultOptions.paths.cwd, 'src/libs/utils'),
      }
    },
    plugins: [].concat(specificPlugins),
    module: {
      loaders: [
        {
          test: /\.json?$/,
          exclude: ['/node_modules/'],
          loader: 'json'
        },
        {
          test: /\.styl?$/,
          exclude: ['/node_modules/'],
          loader: CSSLoaders
        },
        {
          test: /\.js?$/,
          include: [
            path.resolve(defaultOptions.paths.cwd, 'src')
          ].concat(specificLoaderIncludes),
          loader: 'babel',
          query: {
            presets: ['es2015'],
            cacheDirectory: true,
            plugins: ['transform-runtime']
          }
        },
      ]
    },
    stylus: {
      use: [
        require('autoprefixer-stylus'),
      ],
    },
    devtool: options.isProduction ? '' : '#eval-source-map',
    debug: options.isProduction ? false : true
  };

  return { options, webpackConfig };

}


module.exports = createConfig;
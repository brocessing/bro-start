const path               = require('path');
const webpack            = require('webpack');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');
const pages              = require('./src/pages.config');

const isProduction = (process.env.NODE_ENV === 'production');
const paths = {
  base: isProduction ? './' : '/',
  src: path.resolve('src'),
  build: isProduction ? path.resolve('build') : path.resolve('src/static'),
  static: path.resolve('src/static')
}

const CSSExtract = new ExtractTextPlugin('bundle-[hash].css', { allChunks: true });
const CSSLoaders = isProduction ?
                    CSSExtract.extract('style', 'css?-url!stylus')
                    : 'style!css?-url!stylus';


const devPlugins = isProduction ? [] : [
  new webpack.HotModuleReplacementPlugin(),
  new webpack.NoErrorsPlugin()
]

const devEntries = isProduction ? [] : [
  'webpack-hot-middleware/client?reload=true'
];

module.exports = {
  entry: devEntries.concat([
    path.join(paths.src, 'index.js'),
    path.join(paths.src, 'index.styl')
  ]),
  output: {
    path: paths.build,
    publicPath: paths.base,
    filename: 'bundle-[hash].js',
    chunkFilename: 'chunk-[id]-[hash].js'
  },
  resolve: {
    extensions: ['', '.js', '.json', '.config.js'],
    alias: {
      'configs': path.join(paths.src, 'configs'),
      'libs': path.join(paths.src, 'libs'),
      'utils': path.join(paths.src, 'libs/utils'),
    }
  },
  plugins: devPlugins.concat([]),
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
        exclude: ['/node_modules/'],
        include: paths.src,
        loader: 'babel',
        query: {
          presets: ['es2015'],
          cacheDirectory: true,
          plugins: ['transform-runtime']
        }
      },
    ]
  },
  devServer: {
    contentBase: paths.static,
    outputPath: path.join(paths.build, 'dev'),
    historyApiFallback: true,
    noInfo: true
  },
  stylus: {
    use: [
      require('autoprefixer-stylus'),
    ],
  },
  devtool: '#eval-source-map',
  debug: true
};

if (isProduction) {
  module.exports.devtool = '';
  module.exports.debug = false;
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, screw_ie8: true, drop_console: true },
      output: { comments: false },
      mangle: { screw_ie8 : true }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new CopyWebpackPlugin(
      [{ from: path.join(paths.src, 'static'), to: paths.build }],
      {
        ignore: ['.DS_Store', '.gitkeep']
      }
    ),
    CSSExtract,
    new CleanWebpackPlugin(['build'], { root: __dirname, dry: false })
  ]);
}

module.exports.paths = paths;
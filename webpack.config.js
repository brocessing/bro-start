const path               = require('path');
const webpack            = require('webpack');
const HtmlWebpackPlugin  = require('html-webpack-plugin');
const CopyWebpackPlugin  = require('copy-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin  = require('extract-text-webpack-plugin');

const srcPath   = path.join(__dirname, 'src');
const buildPath = path.join(__dirname, 'build');
const prod      = (process.env.NODE_ENV === 'production');

const basePath  = prod ? './' : '/';

module.exports = {
  entry: [
    path.join(srcPath, 'index.js'),
    path.join(srcPath, 'index.styl')
  ],
  output: {
    path: path.join(buildPath, 'dev'),
    publicPath: basePath,
    filename: 'bundle-[hash].js',
    chunkFilename: 'chunk-[id]-[hash].js'
  },
  node: {
    fs: "empty"
  },
  resolve: {
    extensions: ['', '.js', '.json', '.config.js'],
    alias: {
      'configs': path.join(srcPath, 'configs'),
      'libs': path.join(srcPath, 'libs'),
      'utils': path.join(srcPath, 'libs/utils'),
    }
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      env: (prod) ? 'production' : 'development'
    })
  ],
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
          loader: (prod) ? ExtractTextPlugin.extract('style', 'css?-url!stylus') : 'style!css?-url!postcss!stylus'
      },
      {
        test: /\.js?$/,
        exclude: ['/node_modules/'],
        include: srcPath,
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
    contentBase: path.join(srcPath, 'static'),
    outputPath: path.join(buildPath, 'dev'),
    historyApiFallback: true,
    noInfo: true
  },
  stylus: {
    use: [
      require('autoprefixer-stylus'),
      require('nib')()
    ],
    import: ['~nib/lib/nib/index.styl']
  },
  devtool: '#eval-source-map',
  debug: true
};

if (prod) {
  module.exports.output.path = buildPath;
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
      [{
        from: path.join(srcPath, 'static')
      }],
      {
        ignore: ['.DS_Store', '.gitkeep']
      }
    ),
    new ExtractTextPlugin('bundle-[hash].css', { allChunks: true }),
    new CleanWebpackPlugin(['build'], { root: __dirname, dry: false })
  ]);
}

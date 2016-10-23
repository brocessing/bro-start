const paths = require('./paths.config')
const baseConfig = require('./webpack.config.base.js')
const merge = require('webpack-merge')
const webpack = require('webpack')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const prodConfig = {
  output: {
    path: paths.dist
  },
  plugins: [
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, screw_ie8: true, drop_console: true },
      output: { comments: false },
      mangle: { screw_ie8: true }
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new CopyWebpackPlugin(
      [{
        from: paths.static,
        to: paths.dist
      }],
      {
        ignore: ['.DS_Store', '.gitkeep']
      }
    ),
    new ExtractTextPlugin('bundle-[hash].css', { allChunks: true })
  ],
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: ExtractTextPlugin.extract('style', 'css?-url!postcss!stylus'),
        include: paths.src,
        exclude: /node_modules/
      }
    ]
  },
  devtool: '',
  debug: false
}

module.exports = merge(baseConfig, prodConfig)

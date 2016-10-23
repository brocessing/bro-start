const paths = require('./paths.config')
const baseConfig = require('./webpack.config.base.js')
const merge = require('webpack-merge')
const webpack = require('webpack')

const devConfig = {
  entry: [
    'webpack-hot-middleware/client'
  ],
  output: {
    path: paths.src
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: {
    loaders: [
      {
        test: /\.styl$/,
        loader: 'style!css?-url!postcss!stylus',
        include: paths.src,
        exclude: /node_modules/
      }
    ]
  },
  devtool: '#eval-source-map',
  debug: true
}

module.exports = merge(baseConfig, devConfig)

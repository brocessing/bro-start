const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const paths = require('./paths.config')
const commonConfig = require('./webpack.config.common')

const devConfig = {
  entry: [
    'webpack-hot-middleware/client?reload=true'
  ],
  output: {
    path: paths.src
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin()
  ],
  module: {
    rules: [
      {
        test: /\.styl$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: { url: false }
          },
          {
            loader: 'postcss-loader',
            options: { config: path.resolve(__dirname, 'postcss.config.js') }
          },
          'stylus-loader'
        ],
        include: paths.src
      }
    ]
  },
  devtool: '#eval-source-map'
}

module.exports = merge(commonConfig, devConfig)

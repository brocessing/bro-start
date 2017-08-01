const path = require('path')
const merge = require('webpack-merge')
const webpack = require('webpack')
const paths = require('./paths.config')
const commonConfig = require('./webpack.config.common')

const devConfig = {
  entry: [
    path.join(paths.src, 'pages.js'),
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
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
              sourceMap: true
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              config: { path: path.resolve(__dirname, 'postcss.config.js') },
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              sourceMap: true
            }
          }
        ],
        include: paths.src
      }
    ]
  },
  devtool: '#eval-source-map'
}

module.exports = merge(commonConfig, devConfig)

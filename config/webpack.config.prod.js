const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const paths = require('./paths.config')
const commonConfig = require('./webpack.config.common')

const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const prodConfig = {
  output: {
    path: paths.build
  },
  module: {
    rules: [
      {
        test: /\.(scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                url: false,
                sourceMap: true,
                minimize: true
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
          ]
        })
      }
    ]
  },
  plugins: [
    // Copy static files
    new CopyWebpackPlugin(
      [{ from: paths.static, to: paths.build }],
      { ignore: ['.DS_Store', '.gitkeep'] }
    ),

    // Extract all css into one file
    new ExtractTextPlugin({ filename: '[hash].css', allChunks: true }),

    // Minification and size optimization
    new webpack.DefinePlugin({ 'process.env': { 'NODE_ENV': '"production"' } }),
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false, screw_ie8: true, drop_console: true },
      output: { comments: false },
      mangle: { screw_ie8: true },
      sourceMap: true
    }),
    new webpack.optimize.OccurrenceOrderPlugin()
  ],
  devtool: '#source-map',
  bail: true
}

module.exports = merge(commonConfig, prodConfig)

/* eslint-disable @typescript-eslint/no-var-requires */

import path from 'path'
import webpack from 'webpack'
import MiniCssExtractPlugin  from 'mini-css-extract-plugin'
import HTMLWebpackPlugin  from 'html-webpack-plugin'
import { CleanWebpackPlugin }  from 'clean-webpack-plugin'
import JsonOutputPlugin from './JsonOutputPlugin'
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer'

const isDev = process.env.NODE_ENV !== 'production'
process.env.NODE_ENV = isDev ? 'development' : 'production'
const env = require('dotenv-safe').config().parsed

const envStrings = Object.assign({}, ...Object.keys(env).map(key => ({ ['process.env.' + key]: JSON.stringify(env[key]) })))

const config: webpack.Configuration = {
  mode: isDev ? 'development': 'production',
  context: path.resolve(__dirname),
  entry: {
    manifest: './src/manifest',
    background: './src/background',
    content: './src/content',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
    // pathinfo: false,
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.s?css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: './',
              hmr: process.env.NODE_ENV === 'development',
            },
          },
          'css-loader',
          'sass-loader',
        ],
      },

      {
        // load external resources (ie Google fonts)
        test: /.(gif|png|woff(2)?|eot|ttf|svg)(\?[a-z0-9=.]+)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              name: 'assets/[name]-[hash].[ext]',
              limit: 40,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'app' + (isDev ? '' : '.min') + '.css',
    }),
    new webpack.DefinePlugin({
      ...envStrings,
    }),

    new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
    new JsonOutputPlugin({
      asset: 'manifest',
      filename: 'manifest.json',
    }),

    // new BundleAnalyzerPlugin(),
  ],

  resolve: {
    extensions: ['.js', '.ts', '*', '.tsx', '.png', '.svg'],
  },

  devServer: {
    port: 4141,
    host: '0.0.0.0',
  },
}

export default config

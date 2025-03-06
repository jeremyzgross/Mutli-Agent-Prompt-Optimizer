const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')

// Load environment variables from .env file
const env = dotenv.config().parsed || {}

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: {
    popup: path.resolve(__dirname, 'src/popup/index.tsx'),
    options: path.resolve(__dirname, 'src/options/index.ts'),
    background: path.resolve(__dirname, 'src/background/index.ts'),
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: 'src/manifest.json', to: 'manifest.json' },
        { from: 'src/popup/index.html', to: 'popup.html' },
        { from: 'src/options/index.html', to: 'options.html' },
        { from: 'src/assets', to: 'assets', noErrorOnMissing: true },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...env,
        NODE_ENV: 'production',
      }),
    }),
  ],
}

const path = require('path')
const CopyPlugin = require('copy-webpack-plugin')
const webpack = require('webpack')
const dotenv = require('dotenv')

// Load environment variables from .env file
const env = dotenv.config().parsed || {}

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    popup: './src/popup/index.tsx',
    background: './src/background/index.ts',
    options: './src/options/index.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify({
        ...env,
        NODE_ENV: 'production',
      }),
    }),
  ],
}

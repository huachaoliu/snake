const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: {
    index: './src/js/index.js',
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '/build/'),
  },

  resolve: {
    extensions: ['.js', '.less'],
    alias: {
      //...
    }
  },

  module: {
    rules: [
      {
        test: /\.js?$/,
        use: 'babel-loader'
      }
    ]
  },

  plugins: [
    new CleanWebpackPlugin('./build/*.*', {
      dry: true,
      exclude: ['main.css']
    }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      // favicon: 'favicon.ico',
      template: './index.html',
      inject: 'body'
    })
  ]
};
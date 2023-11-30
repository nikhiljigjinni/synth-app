const path = require('path');
// const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [
          // MiniCssExtractPlugin.loader,
          'style-loader',
          'css-loader'
        ],
      },

    ],
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js']
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },

  devServer: {
    static: './dist/'
  },

  // plugins: [
  //   new MiniCssExtractPlugin(),
  // ],

};

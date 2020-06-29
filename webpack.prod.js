const HtmlWebPackPlugin = require('html-webpack-plugin');
const path = require('path');

module.exports = (arg) => {
  console.log('This is the argument', arg);
  return {
    mode: 'production',
    context: __dirname,
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, ''),
      filename: 'bundle.js',
      publicPath: '/',
    },
    devServer: {
      historyApiFallback: true,
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          use: 'babel-loader',
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.scss$/,
          use: ['style-loader', 'css-loader', 'sass-loader'],
        },
        {
          test: [/\.(png|j?g|svg|gif)?$/],
          use: 'file-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebPackPlugin({
        template: path.resolve(__dirname, 'public/index.html'),
        filename: 'index.html',
      }),
    ],
  };
};

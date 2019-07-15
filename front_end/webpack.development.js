var path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename:'bundle.js'
  },
  watch:true,
  mode:"development",
  target:'web',
  resolve: {
    extensions: ['*','.js', '.jsx', '.react.js', '.jpg']
  },
  module: {
    rules: [{
      test:/.js$/,
      exclude:/node_modules/,
      use:{
        loader:'babel-loader'
      }
    },{
      test:/.scss$/,
      exclude:/node_modules/,
      use:['style-loader', 'css-loader', 'sass-loader']
    },{
      test: /\.(png|svg|jpg|gif)$/,
      exclude:/node_modules/,
      use: ['url-loader?name=/public/icons/[name].[ext]']
    }]
  }
}

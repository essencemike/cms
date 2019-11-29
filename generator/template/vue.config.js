const CopyWebpackPlugin = require('copy-webpack-plugin');
const env = process.env.NODE_ENV || 'development';

// 项目部署基础
// 默认情况下，我们假设你的应用将被部署在域的根目录下,
// 例如：https://www.my-app.com/
// 默认：'/'
// 如果您的应用程序部署在子路径中，则需要在这指定子路径
// 例如：https://www.foobar.com/my-app/
// 需要将它改为'/my-app/'
const publicPath = env === 'production' ? '' : '/';
const target = process.env.VUE_APP_BACKEND_API;

module.exports = {
  publicPath,
  runtimeCompiler: true,
  outputDir: 'dist',
  assetsDir: 'static',
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        { from: 'static/', to: 'static/' },
      ]),
    ],
    performance: {
      hints: false,
    },
  },
  devServer: {
    historyApiFallback: true,
    open: true,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        target: target,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: '',
        },
      },
    },
  },
  productionSourceMap: false,
  css: {
    sourceMap: false,
  },
};

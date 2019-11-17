const WriteFilePlugin = require('write-file-webpack-plugin')

module.exports = {
  productionSourceMap: process.env.NODE_ENV !== 'production',
  configureWebpack: {
    plugins: [
      new WriteFilePlugin()
    ]
  },
  pages: {
    popup: {
      entry: 'src/popup.js',
      template: 'src/popup.html',
      filename: 'popup.html',
      title: 'Popup Page',
      chunks: ['chunk-vendors', 'chunk-common', 'popup']
    }
  }
}

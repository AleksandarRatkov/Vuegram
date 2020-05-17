const webpack = require("webpack");

module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  configureWebpack: {
    plugins: [new webpack.ProvidePlugin({
       _: "lodash" 
      })]
  },

  pluginOptions: {
    i18n: {
      locale: 'en',
      fallbackLocale: 'sr',
      localeDir: 'locales',
      enableInSFC: false
    }
  }
}

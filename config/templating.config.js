const handlebars = require('handlebars')
const paths = require('./paths.config')
const isProduction = (process.env.NODE_ENV === 'production')
const store = require('../scripts/utils/store')

module.exports = {
  // Auto import partial from paths.partials
  autoPartials: true,

  // Add your handlebars helpers here
  helpers: {
    nl2br (text) {
      const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
      const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
      return new handlebars.SafeString(nl2brStr)
    }
  },

  // you can mutate data if you need to change contentjuste before a rendering
  beforeRender (data) {
    // set compiler data for use inside layouts
    data.compiler = {
      hash: store.hash,
      publicPath: paths.public,
      isProduction
    }
  }
}

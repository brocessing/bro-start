const handlebars = require('handlebars')

module.exports = {
  yamlSafeLoad: false,
  handlebarsHelpers: {
    nl2br (text) {
      const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
      const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
      return new handlebars.SafeString(nl2brStr)
    }
  }
}

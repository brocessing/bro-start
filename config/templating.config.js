module.exports = {
  yamlSafeLoad: false,
  autoPartials: true,
  beforeHandlebarsUse (handlebars) {
    handlebars.registerHelper('nl2br', (text) => {
      const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
      const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
      return new handlebars.SafeString(nl2brStr)
    })
  }
}

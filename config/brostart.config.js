const broStartConfig = {
  devServer: {
    historyAPIFallback: true,
    port: 8080,
    tunnel: false,
    xip: false,
    offline: false
  },
  templating: {
    yamlSafeLoad: false,
    autoPartials: true
  },
  lifecycle: {
    onHandlebarsInit (handlebars) {
      // add your own custom helpers, partials, decorators here
      handlebars.registerHelper('nl2br', (text) => {
        const reg = /([^>\r\n]?)(\r\n|\n\r|\r|\n)/g
        const nl2brStr = (text + '').replace(reg, '$1' + '<br>' + '$2')
        return new handlebars.SafeString(nl2brStr)
      })
    },
    beforeHandlebarsRender (data) {
      // you can mutate data if you need to add/remove content before rendering
    }
  }
}

module.exports = broStartConfig

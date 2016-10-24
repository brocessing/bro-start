const fs = require('fs-extra')
const handlebars = require('handlebars')
const { handlebarsHelpers } = require('../../config/templating.config.js')
for (let k in handlebarsHelpers) {
  handlebars.registerHelper(k, handlebarsHelpers[k])
}

const layouts = {
  load (filePath) {
    return new Promise((resolve, reject) => {
      let layout = {}
      layout.path = filePath
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err)
        const template = handlebars.compile(data)
        layout.render = function (content) {
          return template(content)
        }
        resolve(layout)
      })
    })
  }
}

module.exports = layouts

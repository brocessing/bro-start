const fs = require('fs-extra')
const handlebars = require('handlebars')

const layouts = {
  load (filePath) {
    return new Promise((resolve, reject) => {
      let layout = {}
      layout.path = filePath
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err)
        const template = handlebars.compile(data)
        layout.render = function (content, helpers) {
          return template(content)
        }
        resolve(layout)
      })
    })
  }
}

module.exports = layouts

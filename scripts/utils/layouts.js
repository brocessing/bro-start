const path = require('path')
const fs = require('fs-extra')
const loadFiles = require('./loadFiles')
const handlebars = require('handlebars')
const brostart = require('../../config/brostart.config.js')
brostart.lifecycle.onHandlebarsInit(handlebars)

const partials = {}

function reloadPartial (layoutsPath, filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) return reject(err)
      const partialName = path.relative(layoutsPath, filePath)
      partials[partialName] = { path: filePath }
      handlebars.registerPartial(partialName, data)
      resolve()
    })
  })
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
          brostart.lifecycle.beforeHandlebarsRender(content)
          return template(content)
        }
        resolve(layout)
      })
    })
  },
  reloadPartials (layoutsPath) {
    if (Object.keys(partials).length < 1) {
      return loadFiles(layoutsPath,
        filePath => path.extname(filePath) === '.hbs',
        filePath => reloadPartial(layoutsPath, filePath))
    } else {
      let p = []
      for (let k in partials) {
        p.push(reloadPartial(layoutsPath, partials[k].path))
      }
      return Promise.all(p)
    }
  }
}

module.exports = layouts

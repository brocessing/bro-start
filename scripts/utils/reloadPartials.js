const fs = require('fs-extra')
const path = require('path')
const handlebars = require('handlebars')
const processFiles = require('./processFiles')

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

function reloadPartials (layoutsPath) {
  if (Object.keys(partials).length < 1) {
    return processFiles(
      layoutsPath,
      filePath => path.extname(filePath) === '.hbs',
      filePath => reloadPartial(layoutsPath, filePath)
    )
  } else {
    let p = []
    for (let k in partials) {
      p.push(reloadPartial(layoutsPath, partials[k].path))
    }
    return Promise.all(p)
  }
}

module.exports = reloadPartials

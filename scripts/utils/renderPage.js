const path = require('path')
const fs = require('fs-extra')
const handlebars = require('handlebars')
const paths = require('../../config/paths.config')
const templatingConf = require('../../config/templating.config')
const reloadPartials = require('./reloadPartials')
let handlebarsIsInit = false

function reloadHelpers () {
  for (let helperName in templatingConf.helpers) {
    const helperFn = templatingConf.helpers[helperName]
    handlebars.registerHelper(helperName, helperFn)
  }
}

function render (page) {
  return new Promise((resolve, reject) => {
    const layoutPath = path.join(paths.src, page.layout)
    const content = Object.assign({}, page.content)
    fs.readFile(layoutPath, 'utf8', (err, data) => {
      if (err) return reject(err)
      let template, rendered
      try {
        template = handlebars.compile(data)
        templatingConf.beforeRender(content)
        rendered = template(content)
      } catch (err) {
        return reject(err)
      }
      resolve(rendered)
    })
  })
}

function renderPage (page, forceHandlebarsInit) {
  return new Promise((resolve, reject) => {
    if (!handlebarsIsInit || forceHandlebarsInit) {
      reloadPartials(paths.partials)
        .then(() => reloadHelpers())
        .then(() => { handlebarsIsInit = true })
        .then(() => render(page))
        .then(resolve)
        .catch(reject)
    } else {
      render(page)
        .then(resolve)
        .catch(reject)
    }
  })
}

module.exports = renderPage

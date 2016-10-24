const sh = require('kool-shell')
const path = require('path')
const url = require('url')

const paths = require('../../config/paths.config.js')
const templatingConfig = require('../../config/templating.config.js')

const store = require('./store')
const cache = require('./cache')
const yamlSystem = require('./yaml')
const layouts = require('./layouts')
const yaml = yamlSystem(paths.content, templatingConfig.yamlSafeload)

let contents = null

// gracefulError display error both on the browser and the console,
// to avoid breaking the auto-reload of browser-sync
function gracefulError (res, err) {
  res.end(`<html><head></head><body><pre style="font-size:10px;color:red">${err}</pre></body></html>`)
  sh.error(err)
}

function processTemplate (content, middleware) {
  // set compiler data for use inside layouts
  content.data.compiler = {
    hash: store.hash,
    isProduction: false
  }

  const layoutPath = path.join(paths.layouts, content.layout + '.hbs')
  layouts.load(layoutPath)
    .then((layout) => {
      middleware.res.setHeader('Content-Type', 'text/html')
      middleware.res.end(layout.render(content.data))
    })
    .catch((err) => {
      gracefulError(middleware.res,
        `💀  Error loading the layout ${content.layout}\n` +
          `↳  YAML: ${content.path}\n` +
          `↳  Error: ${err}`)
    })
}

function templateMiddleware (req, res, next) {
  // parse url - append index.html to / if needed
  let fileUrl = url.parse(req.url).pathname
  if (fileUrl.slice(-1) === '/') fileUrl += 'index.html'

  // if no content is loaded, we preload all the yaml
  if (!contents) {
    yaml.loadAll()
    .then((data) => {
      contents = data
      // if the current url match an existing route
      if (contents[fileUrl]) processTemplate(contents[fileUrl], {req, res, next})
    })
    .catch((err) => { gracefulError(res, err) })

  // if the current requested url match an existing route
  } else if (contents[fileUrl]) {
    const filePath = contents[fileUrl].path

    // verify if the yaml is up-to-date, if not, we update it
    cache.getModifiedDate(filePath).then((date) => {
      if (cache.hasExpired(filePath, date)) {
        sh.info(`[YAML] ${filePath} is expired, reloading it...`)
        yaml.loadPath(filePath)
          .then((content) => {
            contents[fileUrl] = content
            processTemplate(contents[fileUrl], {req, res, next})
          })
          .catch((err) => { gracefulError(res, err) })
      } else {
        processTemplate(contents[fileUrl], {req, res, next})
      }
    })

  // it's not for this middleware, skip this request
  } else {
    next()
  }
}

module.exports = templateMiddleware

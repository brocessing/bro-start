const mime = require('mime-types')
const path = require('path')
const url = require('url')
const paths = require('../../config/paths.config.js')
const templatingConf = require('../../config/templating.config')
const renderPage = require('./renderPage')
const sh = require('kool-shell')()
  .use(require('kool-shell/plugins/log'))

let pages

// gracefulError display error both on the browser and the console,
// to avoid breaking the auto-reload of browser-sync
function gracefulError (res, err) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(
    `<html><head></head><body>` +
    `<p style="white-space:pre-wrap;word-wrap:break-word;` +
    `font-family:monospace;font-size:18px;color:red">${err}</p></body></html>`
  )
  sh.error(err)
}

function getPageFromRoute (route) {
  for (let i = 0; i < pages.length; i++) {
    if (pages[i].output === route) return pages[i]
  }
  return false
}

function processTemplate (page, middleware) {
  renderPage(page, !!templatingConf.autoPartials)
    .then(rendered => {
      const contentType = mime.contentType(path.extname(page.output))
      middleware.res.setHeader('Content-Type', contentType)
      middleware.res.end(rendered)
    })
    .catch(err => gracefulError(middleware.res, err))
}

function templateMiddleware (req, res, next) {
  delete require.cache[require.resolve(path.join(paths.src, 'pages'))]
  pages = require(path.join(paths.src, 'pages'))

  // parse url - append index.html to / if needed
  let fileUrl = url.parse(req.url).pathname
  if (fileUrl.slice(-1) === '/') fileUrl += 'index.html'
  fileUrl = fileUrl.slice(1)

  let page = getPageFromRoute(fileUrl)

  // if the current requested url match an existing route
  if (page) {
    processTemplate(page, {req, res, next})
  // it's not for this middleware, skip this request
  } else {
    next()
  }
}

module.exports = templateMiddleware

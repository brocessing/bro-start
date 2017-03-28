const path = require('path')
const paths = require('../../config/paths.config')
const pages = require(path.join(paths.src, 'pages'))
const renderPage = require('./renderPage')

function renderPages () {
  return new Promise((resolve, reject) => {
    let renderedPages = []
    let p = []
    for (let i = 0; i < pages.length; i++) {
      let page = Object.assign({}, pages[i])
      p.push(new Promise((resolve, reject) => {
        if (!page.output) reject(new Error('No page defined'))
        renderPage(pages[i])
          .then(data => {
            page.rendered = data
            renderedPages.push(page)
            resolve()
          })
          .catch(reject)
      }))
    }
    Promise.all(p)
      .then(() => resolve(renderedPages))
      .catch(reject)
  })
}

module.exports = renderPages

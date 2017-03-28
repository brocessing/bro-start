const fs = require('fs-extra')
const path = require('path')
const paths = require('../../config/paths.config')

function writeFile (filePath, data) {
  return new Promise((resolve, reject) => {
    fs.outputFile(filePath, data, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

function writePages (pages) {
  let p = []
  for (let i = 0; i < pages.length; i++) {
    const page = pages[i]
    const outPath = path.join(paths.build, page.output)
    p.push(writeFile(outPath, page.rendered))
  }
  return Promise.all(p)
}

module.exports = writePages

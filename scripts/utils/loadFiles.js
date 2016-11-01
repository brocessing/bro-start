const fs = require('fs')
const path = require('path')

function processPath (filePath, match, transform) {
  return new Promise((resolve, reject) => {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return reject(err)
      } else if (stats.isDirectory()) {
        return loadFiles(filePath, match, transform).then(resolve).catch(reject)
      } else if (stats.isFile() && match(filePath, stats)) {
        return transform(filePath, stats).then(resolve).catch(reject)
      } else {
        return resolve()
      }
    })
  })
}

function loadFiles (entryPath, match = true, transform = Promise.resolve) {
  let p = []
  let processFiles = []
  return new Promise((resolve, reject) => {
    fs.readdir(entryPath, (err, files) => {
      if (err) return reject(err)
      files.forEach((file) => {
        const filePath = path.join(entryPath, file)
        p.push(new Promise((resolve, reject) => {
          processPath(filePath, match, transform)
            .then((res) => {
              if (res) processFiles = processFiles.concat(res)
              resolve(res)
            }).catch(reject)
        }))
      })
      Promise.all(p)
        .then(() => resolve(processFiles))
        .catch(reject)
    })
  })
}

module.exports = loadFiles

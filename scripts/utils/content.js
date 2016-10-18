const fs = require('fs-extra')
const path = require('path')
const util = require('util')
const yaml = require('js-yaml')

function content (contentPath, safeLoad) {
  const api = {
    load
  }

  function load () {
    return yamlLoadDir(contentPath)
  }

  function yamlLoadDir (dirPath) {
    let p = []
    let processFiles = []
    return new Promise((resolve, reject) => {
      fs.readdir(dirPath, (err, files) => {
        if (err) return reject(err)
        files.forEach((file) => {
          const filePath = path.join(dirPath, file)
          const promise = yamlProcessFile(filePath)
          p.push(promise)
          promise.then((res) => {
            if (res) processFiles = processFiles.concat(res)
          })
        })
        Promise.all(p)
          .then(() => resolve(processFiles))
          .catch(reject)
      })
    })
  }

  function yamlProcessFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          return reject(err)
        } else if (stats.isDirectory()) {
          return yamlLoadDir(filePath).then(resolve).catch(reject)
        } else if (stats.isFile() && path.extname(filePath) === '.yml') {
          return yamlProcessContent(filePath, stats).then(resolve).catch(reject)
        } else {
          return resolve()
        }
      })
    })
  }

  function yamlProcessContent (filePath, stats) {
    return new Promise((resolve, reject) => {
      let file = {}
      file.mtime = util.inspect(stats.mtime)
      file.path = filePath
      yamlLoadFile(filePath)
        .then((data) => {
          if (!data.layout) {
            return reject(`💀  Error with a YAML file\n` +
              `↳  File: ${filePath}\n` +
              `↳  Error: Missing the layout property`)
          }
          file.layout = data.layout
          delete data.layout
          if (!data.route) {
            file.route = path.relative(contentPath, filePath)
              .slice(0, -4) + '.html'
          } else {
            file.route = data.route
            delete data.route
          }
          file.data = data
          resolve([file])
        })
        .catch(reject)
    })
  }

  function yamlLoadFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err)
        try {
          const json = safeLoad ? yaml.safeLoad(data) : yaml.load(data)
          resolve(json)
        } catch (err) {
          reject(`💀  Error with the YAML Compiler\n` +
            `↳  File: ${filePath}\n` +
            `↳  Error: ${err}`)
        }
      })
    })
  }

  return api
}

module.exports = content

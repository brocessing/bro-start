const fs = require('fs-extra')
const path = require('path')
const _yaml = require('js-yaml')

const util = require('util')
const cache = require('./cache')
const loadFiles = require('./loadFiles')

function matchYaml (filePath) {
  return path.extname(filePath) === '.yml'
}

function yaml (contentPath, safeLoad) {
  const api = {
    loadAll,
    loadPath
  }

  function loadPath (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) return reject(err)
        if (!stats.isFile() || !matchYaml(filePath)) {
          return reject(`💀  Error with a YAML file\n` +
              `↳  File: ${filePath}\n` +
              `↳  Error: Not a valid YAML file`)
        }
        processFile(filePath, stats)
          .then((arr) => { arr[0] ? resolve(arr[0]) : reject() })
          .catch(reject)
      })
    })
  }

  function loadAll () {
    return new Promise((resolve, reject) => {
      loadFiles(contentPath, matchYaml, processFile)
        .then((arr) => {
          let contents = {}
          arr.forEach((content) => { contents['/' + content.route] = content })
          resolve(contents)
        })
        .catch(reject)
    })
  }

  function processFile (filePath, stats) {
    return new Promise((resolve, reject) => {
      let file = {}
      cache.set(filePath, new Date(util.inspect(stats.mtime)))
      file.path = filePath
      loadFile(filePath)
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

  function loadFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) return reject(err)
        try {
          const json = safeLoad ? _yaml.safeLoad(data) : _yaml.load(data)
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

module.exports = yaml

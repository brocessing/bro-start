const fs = require('fs-extra')
const path = require('path')

const paths = require('../../config/paths.config.js')
const templatingConfig = require('../../config/templating.config.js')
const store = require('./store')
const yamlSystem = require('./yaml')
const layouts = require('./layouts')
const yaml = yamlSystem(paths.content, templatingConfig.yamlSafeload)

const build = {
  writeFile (filePath, data) {
    return new Promise((resolve, reject) => {
      fs.outputFile(filePath, data, (err) => {
        if (err) return reject()
        resolve()
      })
    })
  },
  writeContent (content) {
    content.data.compiler = {
      hash: store.hash,
      isProduction: true
    }
    return new Promise((resolve, reject) => {
      const layoutPath = path.join(paths.layouts, content.layout + '.hbs')
      layouts.load(layoutPath)
        .then((layout) => {
          const data = layout.render(content.data)
          build.writeFile(path.join(paths.dist, content.route), data)
            .then(resolve).catch(reject)
        })
        .catch(reject)
    })
  },
  staticRender (compiler) {
    return new Promise((resolve, reject) => {
      yaml.loadAll()
        .then((contents) => {
          let p = []
          for (let k in contents) {
            const promise = build.writeContent(contents[k])
            p.push(promise)
          }
          Promise.all(p).then(resolve).catch(reject)
        })
        .catch(reject)
    })
  },
  webpackCompile (compiler) {
    return new Promise((resolve, reject) => {
      compiler.run((err, stats) => {
        if (!err) resolve(stats)
        else reject(err)
      })
    })
  },
  removeFile (filePath) {
    return new Promise((resolve, reject) => {
      fs.remove(filePath, err => (err) ? reject(err) : resolve())
    })
  },
  cleanupDist (distPath) {
    return new Promise((resolve, reject) => {
      fs.access(distPath, fs.F_OK, (err) => {
        if (err) resolve()
        build.removeFile(distPath)
          .then(() => {
            fs.mkdirp(distPath, (err) => {
              if (err) reject(err)
              resolve()
            })
          })
          .catch(reject)
      })
    })
  }
}

module.exports = build

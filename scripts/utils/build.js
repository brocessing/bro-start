const fs = require('fs-extra')
const path = require('path')

const build = {
  staticRender (compiler) {

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
    let promises = []
    const reg = /^(bundle|hash)[-abcdef0-9]+\.(js|css)$/
    return new Promise((resolve, reject) => {
      fs.access(distPath, fs.F_OK, (err) => {
        if (err) resolve()
        fs.readdir(distPath, (err, files) => {
          if (err) return reject(err)
          files.filter(e => e.match(reg))
            .forEach(e => promises.push(build.removeFile(path.join(distPath, e))))
          Promise.all(promises).then(resolve).catch(reject)
        })
      })
    })
  }
}

module.exports = build

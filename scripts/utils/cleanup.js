const fs = require('fs-extra')

function cleanup (distPath) {
  return new Promise((resolve, reject) => {
    fs.access(distPath, fs.F_OK, (err) => {
      if (err) return resolve()
      fs.remove(distPath, err => {
        if (err) return reject(err)
        resolve()
        // fs.mkdirp(distPath, (err) => {
        //   if (err) return reject(err)
        //   resolve()
        // })
      })
    })
  })
}

module.exports = cleanup

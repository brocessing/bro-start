const fs = require('fs-extra')
const util = require('util')
let cached = {}

const cache = {
  getModifiedDate (filePath) {
    return new Promise((resolve, reject) => {
      fs.stat(filePath, (err, stats) => {
        if (err) return reject(err)
        const mdate = new Date(util.inspect(stats.mtime))
        resolve(mdate)
      })
    })
  },

  hasExpired (filePath, date) {
    return !cached[filePath] || (date - cached[filePath]) > 0 || false
  },

  set (filePath, date) {
    if (!cache.hasExpired(filePath, date)) return
    cached[filePath] = date
  }
}

module.exports = cache

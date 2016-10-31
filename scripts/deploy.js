const path = require('path')
const sh = require('kool-shell')
const paths = require('../config/paths.config.js')
const cachePath = path.join(paths.root, '.ghpages-cache')
const ghp = require('./utils/ghpages.js')
const argv = process.argv
const force = !!(argv[2] && (argv[2] === '--force' || argv[2] === '-f'))
const pages = ghp({
  cachePath: cachePath,
  copyPath: paths.dist,
  force: force
})

pages.deploy()
  .then(() => {
    sh.success('New build pushed on the gh-pages branch !').exit(0)
  })
  .catch((err) => {
    sh.error('💀  Error during the deploying').error(err).exit(0)
  })

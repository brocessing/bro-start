const path = require('path')

module.exports = {
  root: path.join(__dirname, '..'),
  src: path.join(__dirname, '..', 'src'),
  dist: path.join(__dirname, '..', 'dist'),
  static: path.join(__dirname, '..', 'static'),
  content: path.join(__dirname, '..', 'src', 'content'),
  layouts: path.join(__dirname, '..', 'src', 'layouts')
}

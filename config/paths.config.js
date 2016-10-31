const path = require('path')
const isProduction = (process.env.NODE_ENV === 'production')

module.exports = {
  public: isProduction ? './' : '/',
  root: path.join(__dirname, '..'),
  src: path.join(__dirname, '..', 'src'),
  dist: path.join(__dirname, '..', 'dist'),
  static: path.join(__dirname, '..', 'static'),
  content: path.join(__dirname, '..', 'src', 'content'),
  layouts: path.join(__dirname, '..', 'src', 'layouts'),
  partials: path.join(__dirname, '..', 'src', 'layouts')
}

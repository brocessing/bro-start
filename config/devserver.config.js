const paths = require('./paths.config')
const phpMiddleware = require('php-server-middleware')

module.exports = {
  historyAPIFallback: true,
  port: 8080,
  tunnel: false,
  xip: false,
  offline: false,
  firstMiddlewares: [],
  lastMiddlewares: [
    phpMiddleware({
      root: paths.static,
      headersRewrite: true,
      bodyRewrite: true,
      handle404: true
    })
  ]
}

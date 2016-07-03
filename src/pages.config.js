/**
 * data.compiler will be appended automatically
 * to the data object of your pages.
 *
 * {{compiler.hash}} -> Get hash from Webpack
 * {{#compiler.isProduction}}
 *   Display this content only in Production builds
 * {{/compiler.isProduction}}
 */

const options = {
  'cwd': `${__dirname}/templates`
}

const pages = {
  'index.html': {
    template: 'home.mustache',
    data: {
      title: 'Bro-start-nano template',
      description: 'Tiny starter kit for making cool websites',
      pageClass: 'home'
    }
  }
};

module.exports = { options, pages };
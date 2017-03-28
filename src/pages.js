const contents = {
  title: 'bro-start',
  description: 'Blazing fast webpack setup for static websites',
  message: 'Everything is working.\nHave fun!'
}

const pages = [
  {
    output: 'index.html',
    content: contents,
    layout: 'layouts/index.hbs'
  }
]

module.exports = pages

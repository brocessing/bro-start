/**
 * Put the list of your pages in the pages array
 *
 * template: input path of the page (relative to the root of your project)
 * filename: output path of the page (relative to the root of the build folder)
 * filename and template are mandatory fields.
 *
 * you can render variable in your template via ejs template tags :
 * <%= htmlWebpackPlugin.options.title %> will render the title field
 *
 * you can use include(path) to add html files inside the template.
 */

const fs = require('fs');
const includes = {};

function include(path) {
  return includes[path] || (includes[path] = fs.readFileSync(path, 'utf8'));
}

const pages = [
  {
    template: 'src/views/template-main.html',
    filename: 'index.html',
    title: 'Bonjour',
    description: 'This is the homepage',
    content: include('src/views/content-index.html'),
    pageClass: 'home'
  }
];

module.exports = pages;
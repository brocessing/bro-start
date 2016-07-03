const fs   = require('fs-extra');
const path = require('path');

const createDoodle = (_name, _cwd) => {

  if (!_name) throw new Error('Invalid doodle name');

  const name = _name.toString();
  const cwd = path.resolve(_cwd, name);

  const templates = {
    'index.js': '',
    'index.styl': '',
    'index.mustache': "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n  "
     + "<meta charset=\"utf-8\">\r\n  <title>{{title}}<\/title>\r\n  "
     + "<meta name=\"viewport\" content=\"width=device-width,"
     + "height=device-height,initial-scale=1.0,minimal-ui\">\r\n  "
     + "<base href=\".\/\">\r\n  {{#compiler.isProduction}}"
     + "<link rel=\"stylesheet\" href=\"bundle-{{compiler.hash}}.css\">"
     + "{{\/compiler.isProduction}}\r\n<\/head>\r\n<body>\r\n  "
     + "<main id=\"page\"><\/main>\r\n  "
     + "<script src=\"bundle-{{compiler.hash}}.js\"><\/script>\r\n"
     + "<\/body>\r\n<\/html>\r\n",
    'pages.config.js': "const options = {\r\n  'cwd': __dirname\r\n};"
      + "\r\nconst pages = {\r\n  'index.html': {\r\n    "
      + "template: 'index.mustache',\r\n    data: {\r\n      "
      + "title: '" + name + "',\r\n    }\r\n  }\r\n};\r\n"
      + "module.exports = { options, pages };"
  }

  const exists = () => {
    return new Promise((resolve, reject) => {
      fs.access(cwd, fs.F_OK, err => (!err) ? resolve() : reject(err));
    });
  };

  const remove = () => {
    return new Promise((resolve, reject) => {
      fs.remove(cwd, err => (!err) ? resolve() : reject(err))
    });
  };

  const makeDirs = () => {
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      fs.mkdirs(path.join(cwd, 'src'),
        err => (!err) ? resolve() : reject(err));
    }));
    promises.push(new Promise((resolve, reject) => {
      fs.mkdirs(path.join(cwd, 'build'),
        err => (!err) ? resolve() : reject(err));
    }));
    return Promise.all(promises);
  };

  const makeFiles = () => {
    const promises = [];
    for (k in templates) {
      const fileName = k;
      const file = templates[fileName];
      const promise = new Promise((resolve, reject) => {
        fs.writeFile(path.join(cwd, 'src', fileName), file,
          err => (!err) ? resolve(fileName) : reject(err));
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  };

  return { exists, remove, makeDirs, makeFiles, name, cwd };

}

module.exports = createDoodle;
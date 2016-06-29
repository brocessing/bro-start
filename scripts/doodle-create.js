const fs    = require('fs-extra');
const path  = require('path');
const argv  = require('minimist')(process.argv.slice(2));
const chalk = require('chalk');

function error(msg = '') {
  console.log(chalk.red(msg));
  process.exit();
}

function success(msg = '') {
  console.log(chalk.green(msg));
  process.exit();
}

if (!argv._ || !argv._[0]) {
  error('Name of the doodle is missing. Good use of doodle-create:\n'
    + chalk.grey.italic('npm run doodle-create -- DoodleName') + '\n');
}

const Doodle = {
  name: argv._[0],
  path: path.join(__dirname, '../doodles', argv._[0]),
  exists() {
    return new Promise((resolve, reject) => {
      fs.access(this.path, fs.F_OK, err => (err) ? resolve() : reject(err));
    });
  },
  createDirs(cb) {
    const promises = [];
    promises.push(new Promise((resolve, reject) => {
      fs.mkdirs(path.join(this.path, 'src'),
        err => (!err) ? resolve() : reject(err));
    }));
    promises.push(new Promise((resolve, reject) => {
      fs.mkdirs(path.join(this.path, 'build'),
        err => (!err) ? resolve() : reject(err));
    }));
    return Promise.all(promises);
  },
  createFiles() {
    const promises = [];
    for (k in Templates) {
      const fileName = k;
      const file = Templates[fileName];
      const promise = new Promise((resolve, reject) => {
        fs.writeFile(path.join(this.path, 'src', fileName), file,
          err => (!err) ? resolve(fileName) : reject(err));
      });
      promises.push(promise);
    }
    return Promise.all(promises);
  },
  removeDirs() {
    return new Promise((resolve, reject) => {
      fs.remove(this.path, err => (!err) ? resolve() : reject(err))
    });
  }
}

const Templates = {
  'index.js': ``,
  'index.styl': ``,
  'index.mustache':
(`<!doctype html>
<html>
  <head>
    <meta charset=utf-8>
    <title>{{title}}</title>
  </head>
  <body>
  </body>
</html>`),
  'pages.config.js': `const options = {
  'cwd': __dirname
};
const pages = {
  'index.html': {
    template: 'index.mustache',
    data: {
      title: '${Doodle.name}',
    }
  }
};
module.exports = { options, pages };`
}

Doodle.exists()
  .catch(() => {
    error(Doodle.name + ' already exists! You can use these two commands :\n'
        + chalk.grey.italic('npm run doodle-dev -- ' + Doodle.name) + '\n'
        + chalk.grey.italic('npm run doodle-build -- ' + Doodle.name) + '\n');
  })
  .then(() => Doodle.createDirs())
  .catch((err) => error('Error trying to mkdir ' + Doodle.path + '\n' + err + '\n'))
  .then(() => Doodle.createFiles())
  .then((val) => success('Yay! ' + chalk.yellow(Doodle.name) + ' is ready!\n'))
  .catch((err) =>
    Doodle.removeDirs()
      .then(() => error('Error trying to create templates:\n ' + err + '\n'))
      .catch(() => error('Error.')));


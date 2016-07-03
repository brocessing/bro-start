const argv   = require('minimist')(process.argv.slice(2));
const path   = require('path');
const createDoodle = require('./utils/createDoodle');
const sh = require('./utils/Shell');

if (!argv._ || !argv._[0]) {
  sh.error('Name of the doodle is missing. Good use of doodle-create:\n'
    + sh.c.grey.italic('npm run doodle-create -- DoodleName') + '\n').exit();
}

let doodle;

try { doodle = createDoodle(argv._[0], path.join(__dirname, '..', 'doodles')); }
catch(e) { sh.error(e + '\n').exit(); }

doodle.exists()
  .then(() => {
    sh.error(doodle.name + ' already exists! You can use these two commands :\n'
        + sh.c.grey.italic('npm run doodle-dev -- ' + doodle.name) + '\n'
        + sh.c.grey.italic('npm run doodle-build -- ' + doodle.name) + '\n')
      .exit();
  })
  .catch(() => doodle.makeDirs())
  .catch((err) => sh.error('Error trying to mkdir ' + doodle.cwd + '\n' + err + '\n').exit())
  .then(() => doodle.makeFiles())
  .then((val) => sh.success('Yay! ' + sh.c.yellow(doodle.name) + ' is ready!\n').exit())
  .catch((err) =>
    doodle.remove()
      .then(() => sh.error('Error trying to create templates:\n ' + err + '\n').exit())
      .catch(() => sh.error('Error.').exit()));


const Spinner = require('cli-spinner').Spinner;
const chalk  = require('chalk');


const Shell = {

  c: chalk,

  spinner(msg) {
    const spinner = new Spinner(msg);
    spinner.setSpinnerString(18);
    spinner.start();
    return spinner;
  },

  error(msg) {
    console.log(chalk.red(msg));
    return this;
  },

  success(msg) {
    console.log(chalk.green(msg));
    return this;
  },

  info(msg) {
    console.log(chalk.grey(msg));
    return this;
  },

  exit() {
    process.exit();
  }

}

module.exports = Shell;
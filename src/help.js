'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');

module.exports = {
    help: () => {
        console.log(chalk.green('Usage :'));
        console.log();
        console.log(chalk.green('1. ac-tinper-theme init           themeColor.json file has been created, please modify the theme file'));
        console.log(chalk.green('2. ac-tinper-theme h              Help'));
        console.log(chalk.green('3. ac-tinper-theme v              Version'));
        console.log(chalk.green('4. tinper-theme build       build tinper scss file '));
        console.log(chalk.green('5. tinper-theme relation       Analysis of individual component dependencies of tinper-bee'));
        console.log(chalk.green('6. tinper-theme relation-all   Analysis of all component dependencies of tinper-bee '));
        console.log();
    },
    version: () => {
        console.log();
        console.log(chalk.green('Version : ' + require('../package.json').version));
        console.log();
        process.exit();
    },
    themeBuildHelp: (version,url) => {
        console.log();
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
        console.log(chalk.green("      🤡  tinper-bee-theme v : "+version));
        console.log();
        console.log(chalk.green("      dowloand url ")+chalk.yellow(url));
        console.log();
        console.log(chalk.green("      copy url to download theme file ! "));
        console.log();
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
    },
    themeColorCont: (_data) => {
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
        console.log(chalk.green("1. themeColor.json file has been created, please modify the theme file! "));
        console.log(chalk.green("2. After modification, execute tinper-theme build "));
        console.log();
        console.log(chalk.green(" themeColor.json : "));
        console.log();
        console.log(_data);
        console.log();
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
    },
    themeColorPrefix: (_data) => {
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
        console.log(chalk.green(" Generated, see tinper-bee-prefix.css file  "));
        console.log();
        console.log(chalk.green(" ***********************👀👀👀************************ "));
        console.log();
    },
    error: (msg) => {
        // console.log();
        console.log(chalk.red("Error : " + msg));
        // console.log();
    }
}
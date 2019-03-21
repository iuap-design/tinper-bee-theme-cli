const help = require('./help');
const {updateAll,build,init} = require('./build');
const relationComponent = require('./relation-component');

module.exports = {
  plugin: function(options) {
    commands = options.cmd;
    switch (commands[0]) {
        case "h":
            help.help();
            break;
        case "v":
            help.version();
            break;
        case "init":
            init();
            break;
        case "build":
            build();
            break;
        case "update":
            updateAll();
            break;
        case "relation":
            relationComponent();
            break;
        case "relation-all":
            relationComponent("all");
            break;
        // case "tinper-up":
        //     tinperBeeUpdate();
        //     break; 
        default:
            help.help();
    }
  }
}

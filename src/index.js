const chalk = require('chalk');
const ora = require('ora')
const fs = require('fs');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const spawn = require('cross-spawn');
const help = require('./help');

// const _server = "http://localhost:3001";
const _server = "http://tinper-bee-theme-server.online.app.yyuap.com";

let _defaultThemeColor = {

    "color-accent": "$palette-green-600",
    "color-accent-dark": "$palette-green-800",
    "color-accent-light": "$palette-green-400",

    "default-color": "30,136,229,255",
    "default-color-dark": "21,101,192,255",
    "default-color-light": "66,165,245,255",
}

let _ThemeColorAll = {
    "primary-color": "30,136,229,255",
    "primary-color-dark": "21,101,192,255",
    "primary-color-light": "66,165,245,255",

    "font-family-primary": "Open Sans2",
    "font-size-base": "14",
    "text-color-base": "66,66,66,255",

    "border-color": "30,136,229,255",
    "border-radius": "3",

    "item-hover-bg-color-base": "231,244,253,255",
    "item-selected-bg-color-base": "231,244,253,255",

    "secondary-color": "224,224,224,255",
    "secondary-color-dark": "189,189,189,255",
    "secondary-color-light": "238,238,238,255",
    "button-secondary-text-color": "66,66,66,255",

     // Table 细化样式变量：
    // 表头背景色
    "table-header-background-color": "247,247,247",
    // 表头文字颜色
    "table-header-text-color": "102, 102, 102",
    // 表格分割线颜色
    "table-border-color-base": "233,233,233",
    "table-row-hover-bg-color":"235, 236, 240"
  }

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
        default:
            help.help();
    }
  }
}

//检测文件或者文件夹存在 nodeJS
function fsExistsSync(path) {
    try{
        fs.accessSync(path,fs.F_OK);
    }catch(e){
        return false;
    }
    return true;
}

async function updateAll(){
    let questions = [{
        type: 'input',
        name: 'version',
        message: 'input number version ?',
        default: function() {
            return 'multiple version > 2.0.0'
        }
    }];
    let quirerObj = await inquirer.prompt(questions);
    let dataList = String(quirerObj.version).split(",");
    fetch(_server+'/server/updateAll',{
        method: 'post',
        body:    JSON.stringify({version:dataList}),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => {
        if(json.success){
            console.log(chalk.green(" 💯  tinperp-bee v "+quirerObj.version+" in server , Please execute tinper-theme init !"));
        }else{
            console.log(chalk.green(" 💯  tinperp-bee v "+quirerObj.version+" in server is not defind , The server is updating..."));
        }
    });
}

/**
 * 初始化，生成themeColor.json
 */
async function init(){
    let _theme = await getThemeColor();
    // console.log(chalk.green(" 😁 themeColor.json file has been created, please modify the theme file! "));
    help.themeColorCont(_theme);
}

/**
 * 开始构建theme
 */
async function build(){
    if(!fsExistsSync("themeColor.json")){
        console.log(chalk.red(" 🚫  themeColor.json is not defined , Please execute tinper-theme intit ! "));
        return;
    }
    let questions = [{
        type: 'input',
        name: 'version',
        message: 'input number version ?',
        default: function() {
            return 'tinper-bee version > 2.0.0'
        }
    }];
    // let _theme = await getThemeColor();
    let _theme = fs.readFileSync("themeColor.json",'utf-8');
    let quirerObj = await inquirer.prompt(questions);
    const spinner1 = ora('tinper-bee building ...').start()
    fetch(_server+'/server/package',{
        method: 'post',
        body:  JSON.stringify({"theme":JSON.parse(_theme),"version":quirerObj.version}),
        headers: { 'Content-Type': 'application/json' },
    })
    .then(res => res.json())
    .then(json => {
        if(!json.success){
            console.log();
            spinner1.fail(chalk.green(json.message));
        }else{
            spinner1.succeed('😁 , tinper-bee theme build success ! ')
            console.log(chalk.green("Visit "+json.data.url+" to verify your customized theme !"));
            let {name,url} = json.data;
            help.themeBuildHelp(quirerObj.version,url);
            getReviewComponent(quirerObj.version,name);
        }
    });
}


/**
 * 在overview 项目中验证 theme 样式的正确性
 * @param {*} version 
 * @param {*} name 
 */
async function getReviewComponent(version,name){
    if(!fsExistsSync("tinper-bee-overview")){
        await getDownload();
    }else{
        process.chdir(process.cwd()+'/tinper-bee-overview');
    }
    fs.writeFileSync("app/index.html",getOverviewHtml(version,name), { encoding: 'utf8' });

    await startOverview();
}

/**
 * 根据当前生成的配置文件，组合参数
 */
async function getThemeColor(){
    if(!fsExistsSync("themeColor.json")){
        let data = {..._ThemeColorAll,..._defaultThemeColor};
        fs.writeFileSync("themeColor.json",JSON.stringify(data), { encoding: 'utf8' });
        return data;
    }
    let _themeColor = fs.readFileSync("themeColor.json",'utf-8');    
    if(_themeColor && JSON.parse(_themeColor)["primary-color"]){
        return {...JSON.parse(_themeColor),..._defaultThemeColor};
    }else{
        console.log(chalk.green('😱 , Check the integrity of themecolor ! '));
    }
}
/**
 * 先下载模板工程
 */
async function getDownload(){
    return new Promise(function(resolve, reject) {
      download("tinper-bee/tinper-bee-overview","tinper-bee-overview",(err)=> {
          console.log(chalk.green(err ? 'Error' : 'dowloand tinper-bee-overview success !'));
          if (err) {
              console.log(chalk.red(err))
              reject("Error");
            } else {
              console.log(chalk.green('Install NPM dependent packages,please wait ... '));
              process.chdir(process.cwd()+'/tinper-bee-overview');
              let args = ['install'].filter(function(e) {
                  return e;
              });
              let proc = spawn('npm', args, {
                stdio: 'inherit'
              });
              proc.on('close', function(code) {
                console.log(chalk.green(' 👏 YNPM package installed !'));
                  if (code !== 0) {
                      console.error('`ynpm ' + args.join(' ') + '` failed');
                      reject(false);
                  }else{
                    resolve(true);
                  }
              });
          }
      })
    });
  }

/**
 * 执行 start 命令
 */
async function startOverview(){
    console.log(chalk.green(' project start !'));
    return new Promise(function(resolve, reject) {
        let args = ['run','dev'].filter(function(e) {
            return e;
        });
        let proc = spawn('npm', args, {
          stdio: 'inherit'
        });
        proc.on('close', function(code) { 
          if (code !== 0) { 
            reject(false);
          }else{
            resolve(true);
          }
        })
    });
  }


/**
 * html代码
 */
function getOverviewHtml(version,name){
    return "<!DOCTYPE html>"+
    "<html lang='en'>"+
    "<head>"+
    "<meta charset='UTF-8'>"+
    "<title>webpack boilerplate</title>"+
    "<meta http-equiv='X-UA-Compatible' content='IE=edge'>"+
    "<meta name='renderer' content='webkit'>"+
    "<meta name='viewport' content='width=device-width, initial-scale=1'>"+
    "<link href='http://iuap-design-cdn.oss-cn-beijing.aliyuncs.com/static/tinper-bee/theme/"+name+"' rel='stylesheet'>"+
    "</head>"+
    "<body>"+
    "<div id='app'></div>"+
    "<script src='https://cdn.bootcss.com/react/16.1.1/umd/react.development.js'></script>"+
    "<script src='https://cdn.bootcss.com/react-dom/16.1.1/umd/react-dom.development.js'></script>"+
    "<script src='//design.yonyoucloud.com/static/prop-types/15.6.0/prop-types.min.js'></script>"+
    "</body>"+
    "</html>";
}



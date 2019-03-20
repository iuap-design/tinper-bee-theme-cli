const chalk = require('chalk');
const ora = require('ora')
const fs = require('fs');
const fetch = require('node-fetch');
const inquirer = require('inquirer');
const download = require('download-git-repo');
const spawn = require('cross-spawn');
const help = require('./help');
const {_tinper_bee_default_url,_server,_defaultThemeColor,
    _themeColorAll,getOverviewHtml} = require('./config');

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
 * 执行打包build的内容
 */
async function build(){
    let {choose} = await chooseTinper();
    if(choose === "tinper-bee-default.css"){
        buildDefault(); //生成默认样式
    }else{
        buildCustom();//自定义样式
    }
}

/**
 * 选择要build的类型
 */
async function chooseTinper(func = ()=>{}){
    let questions = [{
        type: 'list',
        name: 'choose',
        message: 'Please choose ?',
        choices:["tinper-bee-default.css","custom tinper-bee.css "],
        default: function() {
            return 'Default is custom'
        }
    }];
    return await inquirer.prompt(questions);
}

/**
 * 开始构建theme
 */
async function buildCustom(){
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
    .then(async json => {
        if(!json.success){
            console.log();
            spinner1.fail(chalk.green(json.message));
        }else{
            spinner1.succeed('😁 , tinper-bee theme build success ! ')
            console.log(chalk.green("Visit "+json.data.url+" to verify your customized theme !"));
            let {name,url} = json.data;
            fs.writeFileSync("tinper-bee.css",await writeUrlFileSync(url), { encoding: 'utf8' });
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
        let data = {..._themeColorAll,..._defaultThemeColor};
        fs.writeFileSync("themeColor.json",JSON.stringify(data, null, "\t"), { encoding: 'utf8' });
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
 * 构建一个是否要加前缀的样式
 */
async function buildDefault(){
    let questions = [{
        type: 'input',
        name: 'prefix',
        message: 'Please prefix the input style ?'
    }];
    let quirerObj = await inquirer.prompt(questions);
    let prefix = String(quirerObj.prefix);
    fs.writeFileSync("tinper-bee-prefix.css","."+prefix+"{" + await writeUrlFileSync(_tinper_bee_default_url) +  "}", { encoding: 'utf8' });
    help.themeColorPrefix();
}

/**
 * 通过url获取文件内容
 * @param {*} url 
 */
async function writeUrlFileSync(url){
    return fetch(url)
    .then(res => res.text())
    .then(body => {
        return body;
    });
}

module.exports = {
    updateAll,
    build
}
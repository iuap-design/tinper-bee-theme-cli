'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');
require('colors');

var tinperPath =  process.cwd();

let componentbak = {
    "bee-affix": "1.0.14",
    "bee-alert": "2.0.0",
    "bee-animate": "1.0.0",
    "bee-autocomplete": "2.0.1",
    "bee-backtop": "1.0.1",
    "bee-badge": "2.0.0",
    "bee-breadcrumb": "2.0.1",
    "bee-button": "2.0.7",
    "bee-button-group": "2.0.1",
    "bee-cascader": "2.0.3",
    "bee-checkbox": "2.0.2",
    "bee-city-select": "2.0.0",
    "bee-clipboard": "2.0.0",
    "bee-collapse": "1.0.1",
    "bee-complex-grid": "2.0.2",
    "bee-dropdown": "2.0.2",
    "bee-form": "2.0.8",
    "bee-form-control": "2.0.1",
    "bee-form-group": "2.0.0",
    "bee-icon": "1.0.10",
    "bee-input-group": "2.0.1",
    "bee-input-number": "2.0.5",
    "bee-label": "1.0.0",
    "bee-layout": "1.2.7",
    "bee-loading": "1.0.6",
    "bee-loading-state": "2.0.1",
    "bee-locale": "0.0.12",
    "bee-menus": "2.0.2",
    "bee-message": "2.0.0",
    "bee-modal": "2.0.0",
    "bee-navbar": "2.0.0",
    "bee-notification": "2.0.0",
    "bee-overlay": "1.0.22",
    "bee-pagination": "2.0.3",
    "bee-panel": "2.0.1",
    "bee-popconfirm": "2.0.0",
    "bee-popover": "2.0.0",
    "bee-progress-bar": "2.0.0",
    "bee-radio": "2.0.1",
    "bee-rate": "2.0.2",
    "bee-select": "2.0.4",
    "bee-slider": "2.0.1",
    "bee-step": "2.0.0",
    "bee-switch": "2.0.2",
    "bee-table": "2.0.4",
    "bee-tabs": "2.0.1",
    "bee-tile": "1.0.0",
    "bee-timeline": "2.0.1",
    "bee-tooltip": "2.0.3",
    "bee-transfer": "2.0.7",
    "bee-transition": "1.0.0",
    "bee-tree": "2.0.5",
    "bee-upload": "2.0.0",
}

let component = {
    "bee-button": "2.0.0",
}
let questions = [{
    type: 'input',
    name: 'name',
    message: 'input tinper-bee component ',
    default: function() {
        return 'multiple tinper-bee component'
    }
}];

module.exports  = async () => {

    console.log('package.json中的version配置为空'.green);

    // for (let key in component) {
        
    //     // var _html = fs.readFileSync(key+"/index.html",'utf-8');
    //     // console.log("---_html---",_html);

    //     let name = key.split("-")[1]+"Demo.scss";
    //     var _demo = fs.readFileSync(key+"/demo/"+name,'utf-8');
    //     // if(_demo.indexOf("@import")){

    //         // 删除某个字符所在行
    //         var reg = /^@import.*$/;
           
    //         let cc = _demo.replace(reg,''); 
    //         console.log("----cc--",cc); 
    // }

}

async function getTinperBeeComp(_package,name){
    let _packJson = await getFindPackage(name);
    console.log(" ========== "+name+ " v "+ _packJson.version + " ========= ");
    console.log("");
    let comps ={},i =0,allList = {};
    for (let key in _package.pack) {
        if(key.indexOf("bee-") !== -1){
            i++;
            let allCom = await getFindRalationObject(key,name);
            if(allCom){
                allList = {[allCom["name"]]:allCom["version"],...allCom["pack"]};
                console.log("    ",allList);
                comps[key] = "";
            }
        }
    }
    console.log("");
    console.log(" ==========end========= ");
    console.log("");
    console.log("");
}

async function getFindRalationObject(name,id){
    let _path = process.cwd()+"/node_modules/"+name;
    if(!fsExistsSync(_path)){
        console.log(chalk.red(" 🚫  "+name+" is not defined "));
        return null;
    }
    let _theme = await getFindPackage(name);//fs.readFileSync(_path+"/package.json",'utf-8');
    let allCom = getFindComponent(getAllComponent(_theme),id);
    return allCom;
}

function getAllComponent(_package){
    let _pack = _package;
    if(typeof _package === "string"){
        _pack = JSON.parse(_package); 
    }else{
        _pack = _package;
    }
    return {name:_pack.name,version:_pack.version,pack:{..._pack.devDependencies,..._pack.peerDependencies,..._pack.dependencies}};
}

function getFindComponent(_package,id){
    let comps = {..._package},i =0;
    
    comps["pack"] = null;
    for (const key in _package.pack) {

        if(key === id){
            i++;
            // comps[key] = _package.pack[key];
            comps["pack"] = {[id]:_package.pack[key]};
        } 
    }
    return i==0?null:comps;
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

async function getFindPackage(comp){
    let _path = tinperPath+"/node_modules/"+comp+"/package.json";
    var _package = await fs.readFileSync(path.join(_path),'utf-8');
    if(!_package){
        console.log(comp+" path is error ,please go to tinper-bee directory to execute this command !");
        return null;
    }
    return JSON.parse(_package);
}
'use strict';

const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const inquirer = require('inquirer');

var tinperPath =  process.cwd();

let questions = [{
    type: 'input',
    name: 'name',
    message: 'input tinper-bee component ',
    default: function() {
        return 'multiple tinper-bee component'
    }
}];

module.exports  = async (options) => {
    var _package = fs.readFileSync(path.join(process.cwd(),'./package.json'),'utf-8');
    if(_package && JSON.parse(_package).name !== "tinper-bee"){
        console.log("path is error ,please go to tinper-bee directory to execute this command !");
        return null;
    }
    let i =0;
    if(options === "all"){
        let allCom = getAllComponent(_package);
        for (const key in allCom["pack"]) {
            if(key.indexOf("bee-") !== -1){
                i++;
                getTinperBeeComp(allCom,key);
            }
        }
    }else{
        inquirer.prompt(questions).then((answers)=>{
            getTinperBeeComp(getAllComponent(_package),answers.name);
        })
    }
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
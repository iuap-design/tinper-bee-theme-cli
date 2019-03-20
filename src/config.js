const _tinper_bee_default_url = "http://iuap-design-cdn.oss-cn-beijing.aliyuncs.com/static/tinper-bee/theme/tinper-bee.css";
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

let _themeColorAll = {
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

module.exports = {
    _tinper_bee_default_url,
    _server,
    _defaultThemeColor,
    _themeColorAll,
    getOverviewHtml
}
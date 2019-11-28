
const isproduction=process.env.NODE_ENV === 'production';
const HtmlWebpackPlugin = require('html-webpack-plugin');
module.exports={
    configureWebpack: (config)=>{
        if(isproduction){
            config.externals={
                'vue':"Vue",
                'vue-router':"VueRouter",
                'vuex':"Vuex",
                'axios':"axios",
            };
            config.plugins.push(new HtmlWebpackPlugin({
                template:'./index.template.html',

            }))
        }
    },
    // publicPath:'.',//设置打包文件的相对路径，上传服务器的时候要注释掉
};
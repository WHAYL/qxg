import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'

// 获取配置好的 .env.development和.env.production里配置好的的BASEURL
axios.defaults.baseURL = process.env.VUE_APP_BASEURL;
axios.defaults.headers.post['Content-Type'] = 'multipart/form-data';

// 请求拦截器,所有的请求都会经过这个拦截器,你可以在这个拦截器里对请求做一些处理
axios.interceptors.request.use(function (config) {
	// Do something before request is sent
	 var AUTH_TOKEN = localStorage.getItem("token");
	 config.headers.common['Authorization'] = "Bearer "+AUTH_TOKEN;
	return config;
}, function (error) {
	// Do something with request error
	return Promise.reject(error);
});

// 所有的服务器响应的内容都会经过响应拦截器,你可以在获取数据之前,在拦截器里对数据进行处理
axios.interceptors.response.use(function (response) {
	// Do something with response data
	return response;
}, function (error) {
	// Do something with response error
	return Promise.reject(error);
});
var myaxios = {
	get:function(url,pramas){
		return axios.get(url,{params:pramas});
	},
	post:function(url,pramas){
		return axios.post(url,pramas);
	}
}

// 为Vue实例对象创建一个$http属性，该属性指向自定义的axios组件
// 以后所有的Vue组件都可以直接通过this.$http的方式访问get和post请求
// this.$http.get() 或 this.$http.post();
Vue.prototype.$http = myaxios;
export default myaxios
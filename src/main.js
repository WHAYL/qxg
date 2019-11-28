import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './mixin'
import './utils/myaxios'
import './apis/index'
import 'reset-css'

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);

Vue.config.productionTip = false;

router.beforeEach((to, from, next)=>{
	
      if(to.name =="login"){
          next();
          return;
      }
      var token = localStorage.getItem("token");
      if(token){
	    next();
	  }else {
	    var path = to.path;
	      next({path:"/login",query:{comepath:path}})
	  }
});



new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');


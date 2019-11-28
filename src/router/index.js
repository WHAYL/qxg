import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/home/Home.vue';
import login from "../views/login/login";

Vue.use(VueRouter);

const routes = [
  {
    path:'/login',
    name:'login',
    component: login
  },
  {
    path: '/',
    name: 'home',
    component: Home,
    children:[
      {
        path: "AccountManage",
        name: "用户管理",
        component: () => import(/* webpackChunkName: "AccountManage" */ '../views/SysManage/AccountManage/AccountManage')
      },
      {
        path: "PermissionManage",
        name: "权限管理",
        component: () => import(/* webpackChunkName: "PermissionManage" */ '../views/SysManage/PermissionManage/PermissionManage')
      },
      {
        path: "RoleManage",
        name: "角色管理",
        component: () => import(/* webpackChunkName: "RoleManage" */ '../views/SysManage/RoleManage/RoleManage')
      },
      {
        path: "musicsManage",
        name: "音频管理",
        component: () => import(/* webpackChunkName: "musicsManage" */ '../views/musicManage/musicsManage/musicsManage')
      },
      {
        path: "musicTypeManage",
        name: "类型管理",
        component: () => import(/* webpackChunkName: "musicTypeManage" */ '../views/musicManage/musicTypeManage/musicTypeManage')
      },
    ]
  },
];

const router = new VueRouter({
    mode: 'history', //上传服务器的时候要用，不上传只打包要注释不然会出错
    routes
});

export default router

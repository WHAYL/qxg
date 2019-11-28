import Vue from 'vue'
import Vuex from 'vuex'
import axios from '../utils/myaxios'
import apis from '../apis'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    allRoles: [], //所有的角色状态
    allPermissions: [],
  },
  getters:{
    // 权限的树型结构
    permissionTree(state){
      var allPermissions = [...state.allPermissions];
      var rs =  allPermissions.filter((item,index)=>{
        var childArr = allPermissions.filter((child)=>{
          return child.parentid == item._id;
        })
        // 如果子权限的结合的长度大于0.则表示一层过滤的权限是有子权限的,
        // 它的子权限就等于在二层过滤里得到的结果
        childArr.length>0?item.children = childArr:"";

        return item.parentid == 0;
      })
      return rs;
    }
  },
  mutations: {
    LOADALLROLES(state,payload){
      state.allRoles = payload.data;
    },
    ALLPERMISSIONS(state,payload){
      state.allPermissions = payload.data;
    },
  },
  actions: {
    loadAllRoles({commit},payload){
      axios.get(apis.findRole).then((resp)=>{
        commit('LOADALLROLES',resp.data)
      })
    },
    loadAllPermission({commit},payload){
      axios.post(apis.findPermission).then((resp)=>{
        commit('ALLPERMISSIONS',resp.data)
      })
    }
  },
  modules: {
  }
})

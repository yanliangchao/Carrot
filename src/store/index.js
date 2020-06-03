import Vue from 'vue'
import Vuex from 'vuex'

//挂载Vuex
Vue.use(Vuex)

//创建VueX对象
const store = new Vuex.Store({
  state:sessionStorage.getItem('state') ? JSON.parse(sessionStorage.getItem('state')):{
      buttonList: []
  },
  mutations:{
      // 保存当前的权限菜单
      saveButtonList(state,buttonList){
          state.buttonList = buttonList;
      }
  }
})

export default store

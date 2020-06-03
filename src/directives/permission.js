import Vue from 'vue';
import store from '@/store';

Vue.directive('per', {
  inserted: function (el, binding) {
    if (!permissionJudge(binding.value)) {
      el.parentNode.removeChild(el);
    }

    function permissionJudge(value) {
      // 此处store.getters.getMenuBtnList代表vuex中储存的按钮菜单数据
      let list = store.state.buttonList;
      //console.log(value)
      for (let item of list) {
        //console.log(item)
        if (item === value) {
          //console.log(true)
          return true;
        }
      }
      return false;
    }
  }
});

<template>
<div class="sidebar">
  <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157" text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
    <el-menu-item index="dashboard">
      <i class="el-icon-lx-home"></i>
      <span slot="title">系统首页</span>
    </el-menu-item>
    <template v-for="item in items">
      <div v-if="!item.hidden" class="menu-wrapper">
        <template v-if="item.children">
            <el-submenu :index="item.path" :key="item.path">
                <template slot="title">
                    <i :class="item.meta.icon"></i>
                    <span slot="title">{{ item.meta.title }}</span>
                </template>
                <template v-for="subItem in item.children">
                    <el-submenu
                        v-if="subItem.subs"
                        :index="subItem.path"
                        :key="subItem.path"
                    >
                        <template slot="title">{{ subItem.meta.title }}</template>
                        <el-menu-item
                            v-for="(threeItem,i) in subItem.children"
                            :key="i"
                            :index="threeItem.path"
                        >{{ threeItem.meta.title  }}</el-menu-item>
                    </el-submenu>
                    <el-menu-item
                        v-else
                        :index="subItem.path"
                        :key="subItem.path"
                    >{{ subItem.meta.title }}</el-menu-item>
                </template>
            </el-submenu>
        </template>
      </div>
    </template>
  </el-menu>
</div>
</template>

<script>
import bus from './bus';
import request from '@/utils/request'
export default {
  data() {
    return {
      collapse: false,
      items: [],
      onlyOneChild: null
    };
  },
  computed: {
    onRoutes() {
      return this.$route.path.replace('/', '');
    }
  },
  methods: {
    buildMenus() {
      request.get(`/api/menus/build`)
        .then(res => {
          //console.log(res.data.menuVo);
          this.items = res.data.menuVo;
        })
    }
  },
  created() {
    this.buildMenus();
    // 通过 Event Bus 进行组件间通信，来折叠侧边栏
    bus.$on('collapse', msg => {
      this.collapse = msg;
      bus.$emit('collapse-content', msg);
    });
  }
};
</script>

<style scoped>
.sidebar {
  display: block;
  position: absolute;
  left: 0;
  top: 50px;
  bottom: 0;
  overflow-y: scroll;
}

.sidebar::-webkit-scrollbar {
  width: 0;
}

.sidebar-el-menu:not(.el-menu--collapse) {
  width: 220px;
}

.sidebar>ul {
  height: 100%;
}
</style>

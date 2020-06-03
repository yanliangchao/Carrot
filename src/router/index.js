import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            path: '/',
            component: () => import(/* webpackChunkName: "home" */ '../components/Home.vue'),
            meta: { title: '自述文件' },
            children: [
                {
                    path: '/dashboard',
                    component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/Dashboard.vue'),
                    meta: { title: '系统首页' }
                },
                {
                      path: '/user',
                      component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/user/index.vue'),
                      meta: { title: '用户管理' }
                },
                {
                  path: '/role',
                  component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/role/index.vue'),
                  meta: { title: '角色管理' }
                },
                {
                  path: '/menu',
                  component: () => import(/* webpackChunkName: "dashboard" */ '../components/page/system/menu/index.vue'),
                  meta: { title: '菜单管理' }
                },
                {
                    path: '/404',
                    component: () => import(/* webpackChunkName: "404" */ '../components/page/404.vue'),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: () => import(/* webpackChunkName: "403" */ '../components/page/403.vue'),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: () => import(/* webpackChunkName: "login" */ '../components/login/Login.vue'),
            meta: { title: '登录' }
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
});

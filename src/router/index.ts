import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MainView from '../views/MainView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'MainView',
    component: MainView,
  },
  {
    path: '/info',
    name: 'info',
    component: () => import(/* webpackChunkName: "info" */ '../views/InfoView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;

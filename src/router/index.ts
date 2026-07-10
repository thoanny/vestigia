import HomeView from '@/views/HomeView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: HomeView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

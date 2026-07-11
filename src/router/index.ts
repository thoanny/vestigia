import ExploreView from '@/views/ExploreView.vue';
import HomeView from '@/views/HomeView.vue';
import InboxView from '@/views/InboxView.vue';
import SettingsView from '@/views/SettingsView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: HomeView,
  },
  {
    path: '/explore',
    component: ExploreView,
  },
  {
    path: '/inbox',
    component: InboxView,
  },
  {
    path: '/settings',
    component: SettingsView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

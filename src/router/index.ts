import AboutView from '@/views/AboutView.vue';
import CharacterView from '@/views/CharacterView.vue';
import ExploreView from '@/views/ExploreView.vue';
import InboxView from '@/views/InboxView.vue';
import InventoryView from '@/views/InventoryView.vue';
import SettingsView from '@/views/SettingsView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: CharacterView,
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
  {
    path: '/about',
    component: AboutView,
  },
  {
    path: '/inventory',
    component: InventoryView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

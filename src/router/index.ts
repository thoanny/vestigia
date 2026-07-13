import AboutView from '@/views/AboutView.vue';
import AchievementsView from '@/views/AchievementsView.vue';
import BattlePassView from '@/views/BattlePassView.vue';
import CharacterView from '@/views/CharacterView.vue';
import ExploreView from '@/views/ExploreView.vue';
import HelpView from '@/views/HelpView.vue';
import HistoryView from '@/views/HistoryView.vue';
import InboxView from '@/views/InboxView.vue';
import InventoryView from '@/views/InventoryView.vue';
import LeaderboardView from '@/views/LeaderboardView.vue';
import SettingsView from '@/views/SettingsView.vue';
import ShopView from '@/views/ShopView.vue';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    component: CharacterView,
  },
  {
    path: '/history',
    component: HistoryView,
  },
  {
    path: '/inventory',
    component: InventoryView,
  },
  {
    path: '/explore',
    component: ExploreView,
  },
  {
    path: '/battlepass',
    component: BattlePassView,
  },
  {
    path: '/achievements',
    component: AchievementsView,
  },
  {
    path: '/inbox',
    component: InboxView,
  },
  {
    path: '/shop',
    component: ShopView,
  },
  {
    path: '/leaderboard',
    component: LeaderboardView,
  },
  {
    path: '/settings',
    component: SettingsView,
  },
  {
    path: '/help',
    component: HelpView,
  },
  {
    path: '/about',
    component: AboutView,
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

export default router;

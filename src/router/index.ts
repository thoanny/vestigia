import { useAuthStore } from '@/stores/auth';
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'character',
    component: () => import('@/views/CharacterView.vue'),
  },
  {
    path: '/account',
    name: 'account',
    component: () => import('@/views/AccountView.vue'),
  },
  {
    path: '/history',
    name: 'history',
    component: () => import('@/views/HistoryView.vue'),
  },
  {
    path: '/inventory',
    name: 'inventory',
    component: () => import('@/views/InventoryView.vue'),
  },
  {
    path: '/explore',
    name: 'explore',
    component: () => import('@/views/ExploreView.vue'),
  },
  {
    path: '/battlepass',
    name: 'battlepass',
    component: () => import('@/views/BattlePassView.vue'),
  },
  {
    path: '/achievements',
    name: 'achievements',
    component: () => import('@/views/AchievementsView.vue'),
  },
  {
    path: '/inbox',
    name: 'inbox',
    component: () => import('@/views/InboxView.vue'),
  },
  {
    path: '/shop',
    name: 'shop',
    component: () => import('@/views/ShopView.vue'),
  },
  {
    path: '/leaderboard',
    name: 'leaderboard',
    component: () => import('@/views/LeaderboardView.vue'),
  },
  {
    path: '/settings',
    name: 'settings',
    component: () => import('@/views/SettingsView.vue'),
  },
  {
    path: '/help',
    name: 'help',
    component: () => import('@/views/HelpView.vue'),
    meta: { public: true },
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/views/AboutView.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: { public: true },
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
});

router.beforeEach(async (to) => {
  const auth = useAuthStore();

  if (!auth.isReady) {
    await auth.fetchCurrentUser();
  }

  if (!to.meta.public && !auth.isAuthenticated) {
    return { name: 'login' };
  }

  if (to.name === 'login' && auth.isAuthenticated) {
    return { path: '/' };
  }

  if (to.name === 'account' && auth.isAuthenticated && auth.user?.account !== null) {
    return { path: '/' };
  }

  if (auth.isAuthenticated && auth.user && auth.user.account === null && to.name !== 'account') {
    return { name: 'account' };
  }
});

export default router;

<script setup lang="ts">
import { menuService } from '@/services/menuService';
import { useAuthStore } from '@/stores/auth';
import { RouterLink } from 'vue-router';

const authStore = useAuthStore();
</script>

<template>
  <nav class="dock" v-show="authStore.isAuthenticated">
    <RouterLink
      v-for="item in menuService.getMenuFooter()"
      :key="item.id"
      :to="item.url"
      activeClass="dock-active text-primary"
    >
      <component :is="item.icon" v-if="item.icon" class="size-5" />
      <span class="dock-label" v-text="item.title"></span>
    </RouterLink>
  </nav>
</template>

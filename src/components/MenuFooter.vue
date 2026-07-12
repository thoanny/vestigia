<script setup lang="ts">
import { menuService } from '@/services/menuService';
import { RouterLink } from 'vue-router';
</script>

<template>
  <nav class="dock">
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

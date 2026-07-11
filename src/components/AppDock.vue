<script setup lang="ts">
import { IconInbox, IconMap, IconSettings, IconUser } from '@tabler/icons-vue';
import { RouterLink } from 'vue-router';

const menu = [
  {
    id: 'home',
    url: '/',
    icon: IconUser,
    title: 'Personnage',
  },
  {
    id: 'explore',
    url: '/explore',
    icon: IconMap,
    title: 'Exploration',
  },
  {
    id: 'inbox',
    url: '/inbox',
    icon: IconInbox,
    title: 'Messagerie',
  },
  {
    id: 'settings',
    url: '/settings',
    icon: IconSettings,
    title: 'Paramètres',
  },
];
</script>

<template>
  <nav class="dock">
    <RouterLink
      v-for="item in menu"
      :key="item.id"
      :to="item.url"
      activeClass="dock-active text-primary"
    >
      <component :is="item.icon" v-if="item.icon" class="size-5" />
      <span class="dock-label" v-text="item.title"></span>
    </RouterLink>
  </nav>
</template>

<script setup lang="ts">
import { IconDots } from '@tabler/icons-vue';
import { ref } from 'vue';
import { RouterLink } from 'vue-router';

import { menuService } from '@/services/menuService';

const menuModal = ref();
</script>

<template>
  <div class="navbar bg-base-100 border-b border-base-content/5 fixed top-0 z-1">
    <div class="flex-1">
      <RouterLink to="/" class="btn btn-ghost text-xl px-3">Vestigia</RouterLink>
    </div>
    <div class="flex-none">
      <button class="btn btn-square btn-ghost" @click="menuModal.showModal()">
        <IconDots class="size-5" />
      </button>
    </div>
  </div>

  <dialog ref="menuModal" class="modal modal-top">
    <div class="modal-box rounded-none p-0">
      <ul class="menu bg-base-100 rounded-box w-full gap-y-1">
        <li v-for="item in menuService.getMenuHeader()" :key="item.id">
          <RouterLink
            :to="item.url"
            @click="menuModal.close()"
            activeClass="bg-primary text-primary-content"
          >
            <component :is="item.icon" class="size-5" v-if="item.icon" />
            {{ item.title }}
          </RouterLink>
        </li>
      </ul>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

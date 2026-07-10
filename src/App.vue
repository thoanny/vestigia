<script setup lang="ts">
import { healthService } from '@/services/healthService';
import { onMounted } from 'vue';

onMounted(() => {
  healthService.init();
});
</script>

<template>
  <header>HEADER</header>
  <main>
    <RouterView />
  </main>
  <footer>FOOTER</footer>
</template>

<style scoped></style>

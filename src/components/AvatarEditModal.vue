<template>
  <div>
    <div class="avatar avatar-placeholder" @click="avatarEditModal.show()">
      <div class="bg-primary text-primary-content mask mask-squircle w-12">
        <span class="text-xl">
          {{ authStore.user?.nickname ? Array.from(authStore.user.nickname)[0] : 'I' }}
        </span>
      </div>
    </div>
    <dialog ref="avatarEditModal" class="modal modal-top">
      <div class="modal-box max-w-[19rem] mx-auto flex flex-col gap-4">
        <h3 class="text-lg font-bold">Modifier l'avatar</h3>
        <div class="aspect-square w-full bg-base-300 rounded-box mx-auto mask mask-squircle">
          <AvatarRenderer :config="avatarConfig" />
        </div>
        <AvatarPicker v-model:config="avatarConfig" />
        <div class="modal-action">
          <form method="dialog" class="w-full">
            <button class="btn btn-block btn-primary">Fermer</button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { type AvatarConfig } from '@/types/avatar';
import { ref } from 'vue';
import AvatarPicker from './AvatarPicker.vue';
import AvatarRenderer from './AvatarRenderer.vue';

/**
 * INSPIRATIONS
 * https://github.com/dapi-labs/react-nice-avatar
 * https://getavataaars.com/
 * https://github.com/RobertBroersma/beanheads
 * https://www.openpeeps.com
 */

const avatarConfig = ref<AvatarConfig>({
  body: '21',
  head: '40',
  face: '23',
  // hairs: '01',
  // accessory: '01',
});

const avatarEditModal = ref();

const authStore = useAuthStore();
</script>

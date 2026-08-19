<template>
  <div>
    <div class="avatar avatar-placeholder" @click="avatarEditModal.show()">
      <div class="bg-base-300 mask mask-squircle w-16">
        <AvatarRenderer :config="avatarConfig" />
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
            <button
              class="btn btn-block btn-primary"
              @click.prevent="handleSubmit"
              :disabled="isLoading"
            >
              <span class="loading loading-spinner" v-if="isLoading"></span>
              {{ isLoading ? 'Veuillez patienter...' : 'Enregistrer' }}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  </div>
</template>

<script setup lang="ts">
import { apiClient } from '@/services/apiClient.ts';
import { useAuthStore } from '@/stores/auth';
import { type AvatarConfig } from '@/types/avatar';
import { ref } from 'vue';
import AvatarPicker from './AvatarPicker.vue';
import AvatarRenderer from './AvatarRenderer.vue';

const auth = useAuthStore();
const isLoading = ref(false);

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const res = await apiClient.post('/update-avatar', { ...form.value });
    if (!res.ok) {
      isLoading.value = false;
      throw new Error('Error');
    }
    await auth.fetchCurrentUser();
    avatarEditModal.value.close();
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

/**
 * INSPIRATIONS
 * https://github.com/dapi-labs/react-nice-avatar
 * https://getavataaars.com/
 * https://github.com/RobertBroersma/beanheads
 * https://www.openpeeps.com
 */

const avatarConfig = ref<AvatarConfig>({
  body: auth.user?.character?.avatarBody || '01',
  head: auth.user?.character?.avatarHead || '01',
  face: auth.user?.character?.avatarFace || '01',
  hairs: auth.user?.character?.avatarHairs || '',
  accessory: auth.user?.character?.avatarAccessory || '',
});

const form = ref({
  avatar: avatarConfig,
});

const avatarEditModal = ref();
</script>

<template>
  <div>
    <h1 class="text-primary">Créez votre compte Vestigia</h1>

    <fieldset class="fieldset">
      <legend class="fieldset-legend">Pseudonyme</legend>
      <input
        type="text"
        class="input"
        :class="{
          'input-error': error,
        }"
        @input="error = ''"
        placeholder="JohnDoe"
        v-model="form.nickname"
        required
      />
      <p class="label text-error" v-if="error">{{ error }}</p>
    </fieldset>

    <div class="flex flex-col gap-4 mt-4">
      <div class="aspect-square w-48 bg-base-300 rounded-box mx-auto mask mask-squircle">
        <AvatarRenderer :config="avatarConfig" />
      </div>
      <div class="card bg-base-100">
        <div class="card-body">
          <AvatarPicker v-model:config="avatarConfig" />
        </div>
      </div>
    </div>

    <button
      class="btn btn-primary btn-block mt-4"
      @click="handleSubmit"
      :disabled="isLoading || !form.nickname || form.nickname.length < 5"
    >
      <span class="loading loading-spinner" v-if="isLoading"></span>
      {{ isLoading ? 'Veuillez patienter' : 'Créer le compte' }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import AvatarPicker from '@/components/AvatarPicker.vue';
import AvatarRenderer from '@/components/AvatarRenderer.vue';
import { apiClient } from '@/services/apiClient';
import { useAuthStore } from '@/stores/auth';
import type { AvatarConfig } from '@/types/avatar';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const router = useRouter();
const auth = useAuthStore();
const error = ref('');

const avatarConfig = ref<AvatarConfig>({
  body: '21',
  head: '40',
  face: '23',
  hairs: '',
  accessory: '',
});

const form = ref({
  nickname: '',
  avatar: avatarConfig,
});

const handleSubmit = async () => {
  isLoading.value = true;
  try {
    const res = await apiClient.post('/create-account', { ...form.value });
    if (!res.ok) {
      if (res.status === 409) {
        error.value = 'Ce pseudonyme est déjà utilisé';
      }
      console.log(res.status);
      throw new Error('Error');
    }
    await auth.fetchCurrentUser();
    router.push('/');
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.input {
  width: 100%;
}
</style>

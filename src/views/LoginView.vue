<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { IconEye, IconEyeOff } from '@tabler/icons-vue';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const auth = useAuthStore();

const email = ref('');
const password = ref('');
const nickname = ref('');
const mode = ref<'login' | 'register'>('login');
const hidePassword = ref(true);

async function handleSubmit() {
  try {
    if (mode.value === 'login') {
      await auth.login(email.value, password.value);
    } else {
      await auth.register(nickname.value, email.value, password.value);
    }
    router.push('/');
  } catch {}
}

function toggleMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login';
  auth.error = null;
}
</script>

<template>
  <div class="card card-sm border border-base-300 bg-base-100">
    <div class="card-body">
      <h1 class="card-title">{{ mode === 'login' ? 'Connexion' : 'Inscription' }}</h1>

      <form @submit.prevent="handleSubmit" class="flex flex-col gap-2">
        <fieldset class="fieldset" v-if="mode === 'register'">
          <label class="label" for="nickname">Pseudonyme</label>
          <input
            type="text"
            id="nickname"
            class="input w-full"
            placeholder=""
            v-model="nickname"
            required
            autocomplete="nickname"
          />
        </fieldset>

        <fieldset class="fieldset">
          <label for="email" class="label">Adresse e-mail</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            autocomplete="email"
            class="input w-full"
          />
        </fieldset>

        <fieldset class="fieldset">
          <label for="password" class="label">Mot de passe</label>
          <div class="input w-full">
            <input
              id="password"
              v-model="password"
              :type="hidePassword ? 'password' : 'text'"
              required
              autocomplete="current-password"
              class="grow w-full"
            />
            <label class="swap">
              <input type="checkbox" v-model="hidePassword" />
              <IconEye class="swap-off size-5" />
              <IconEyeOff class="swap-on size-5" />
            </label>
          </div>
        </fieldset>

        <div role="alert" class="alert alert-error alert-soft" v-if="auth.error">
          <span>{{ auth.error }}</span>
        </div>

        <button type="submit" :disabled="auth.isLoading" class="btn btn-primary mt-2">
          <span class="loading loading-spinner loading-sm" v-if="auth.isLoading"></span>
          {{ auth.isLoading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : "S'inscrire" }}
        </button>
      </form>

      <button type="button" class="btn btn-link" @click="toggleMode">
        {{ mode === 'login' ? "Pas de compte ? S'inscrire" : 'Déjà un compte ? Se connecter' }}
      </button>
    </div>
  </div>
</template>

<style scoped></style>

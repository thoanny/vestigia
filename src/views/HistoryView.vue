<template>
  <div>
    <h1>Historique des pas</h1>
    <div
      class="aspect-square rounded-box bg-base-200 flex items-center justify-center"
      v-if="isLoading"
    >
      Chargement en cours...
    </div>
    <Bar :data="data" :options="options" v-else />

    <div class="flex gap-2 flex-col mt-4" v-if="steps.length > 0">
      <div
        class="card card-xs bg-base-100 border border-base-300"
        v-for="day in list"
        :key="day.date"
      >
        <div class="card-body flex-row justify-between">
          <div class="font-bold uppercase">
            {{
              new Date(day.date!).toLocaleDateString('fr-FR', {
                weekday: 'long',
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })
            }}
          </div>
          <div>{{ day.steps }}</div>
        </div>
      </div>
    </div>

    <!-- <pre>{{ steps }}</pre> -->
  </div>
</template>

<script setup lang="ts">
import { healthService, type DailySteps } from '@/services/healthService';
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from 'chart.js';
import { computed, onMounted, ref } from 'vue';
import { Bar } from 'vue-chartjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const isLoading = ref<boolean>(false);
const steps = ref<DailySteps[]>([]);

const data = computed(() => {
  return {
    type: 'bar',
    labels: steps.value.map((step) => {
      if (!step.date) return '';
      return new Date(step.date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
      });
    }),
    datasets: [
      {
        data: steps.value.map((step) => step.steps),
        label: 'Nombre de pas',
        backgroundColor: 'oklch(45% 0.24 277.023)',
        borderRadius: Number.MAX_VALUE,
        borderSkipped: false,
      },
    ],
    options: {
      animation: false,
      transitions: {
        active: {
          animation: {
            duration: 0,
          },
        },
      },
    },
  };
});

const options = {
  responsive: true,
  aspectRatio: 1,
  scales: {
    y: {
      beginAtZero: true,
    },
  },
  animation: {
    duration: 0,
  },
};

const list = computed(() => {
  return [...steps.value].reverse();
});

onMounted(async () => {
  isLoading.value = true;
  await healthService
    .getStepsHistory(14)
    .then((data) => (steps.value = data))
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

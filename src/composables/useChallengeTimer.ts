import { useCharacterStore } from '@/stores/character';
import { computed, onMounted, onUnmounted, ref } from 'vue';

const CLOCK_INTERVAL_MS = 1_000;
const POLL_INTERVAL_MS = 5_000;

export function useChallengeTimer() {
  const store = useCharacterStore();
  const now = ref(Date.now());

  let clockId: ReturnType<typeof setInterval> | undefined;
  let pollId: ReturnType<typeof setInterval> | undefined;
  let removeListener: (() => void) | undefined;

  const poll = () => {
    return; // TODO : réactiver les challenges
    // console.log('poll');
    // store.refreshChallengeSteps();
    // store.checkChallengeTimeout();
  };

  onMounted(async () => {
    // TODO : réactiver les challenges
    // poll();
    // clockId = setInterval(() => {
    //   now.value = Date.now();
    // }, CLOCK_INTERVAL_MS);
    // pollId = setInterval(poll, POLL_INTERVAL_MS);
    // const listener = await App.addListener('appStateChange', ({ isActive }) => {
    //   if (isActive) {
    //     now.value = Date.now();
    //     poll();
    //   }
    // });
    // removeListener = () => listener.remove();
  });

  onUnmounted(() => {
    // if (clockId) clearInterval(clockId);
    // if (pollId) clearInterval(pollId);
    // removeListener?.();
  });

  const remainingMs = computed(() => {
    if (!store.activeChallengeDeadline) return 0;
    return Math.max(0, store.activeChallengeDeadline - now.value);
  });

  const countdownLabel = computed(() => {
    const totalSeconds = Math.ceil(remainingMs.value / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  });

  const stepsStatusLabel = computed(() => {
    const target = store.activeChallenge?.steps ?? 0;
    return `${stepsRemaining.value} / ${target} pas`;
  });

  const stepsRemaining = computed(() =>
    Math.max(0, (store.activeChallenge?.steps ?? 0) - (store.activeChallenge?.currentSteps ?? 0)),
  );

  return { countdownLabel, stepsStatusLabel, stepsRemaining };
}

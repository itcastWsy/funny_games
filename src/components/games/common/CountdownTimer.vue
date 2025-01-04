<template>
  <div class="countdown" :class="{ 'warning': seconds <= 3 }">
    剩余时间: {{ seconds }}秒
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps<{
  duration: number;
}>();

const emit = defineEmits<{
  (e: 'timeUp'): void;
}>();

const seconds = ref(props.duration);
let timer: number;

onMounted(() => {
  seconds.value = props.duration;
  timer = setInterval(() => {
    if (seconds.value > 0) {
      seconds.value--;
      if (seconds.value === 0) {
        clearInterval(timer);
        emit('timeUp');
      }
    }
  }, 1000);
});

onUnmounted(() => {
  clearInterval(timer);
});
</script>

<style scoped>
.countdown {
  position: fixed;
  top: 56px;
  left: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  z-index: 1;
  font-weight: bold;
}

.warning {
  background: rgba(255, 0, 0, 0.7);
  animation: pulse 1s infinite;
}

@keyframes pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
<template>
  <div 
    class="game-area"
    :class="gameAreaClass"
    @click="onClick"
  >
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  state: string;
}>();

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const gameAreaClass = computed(() => ({
  'waiting': props.state === 'waiting',
  'ready': props.state === 'ready',
  'active': props.state === 'active',
  'clicked': props.state === 'clicked'
}));

const onClick = () => emit('click');
</script>

<style scoped>
.game-area {
  height: calc(100vh - 46px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 20px;
  transition: background-color 0.1s;
}

.game-area.waiting {
  background-color: #fff;
}

.game-area.ready {
  background-color: #ff4444;
  color: white;
}

.game-area.active {
  background-color: #07c160;
  color: white;
  cursor: pointer;
}

.game-area.clicked {
  background-color: #fff;
}
</style>
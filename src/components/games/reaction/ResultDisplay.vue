<template>
  <div class="result">
    <h2>你的反应时间</h2>
    <p class="reaction-time">{{ time }}ms</p>
    <p class="rating">{{ rating }}</p>
    <slot></slot>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { getRating } from '../../../utils/gameUtils';

const props = defineProps<{
  time: number;
}>();

const rating = computed(() => getRating(props.time));
</script>

<style scoped>
.reaction-time {
  font-size: 48px;
  font-weight: bold;
  color: #1989fa;
  margin: 16px 0;
}

.rating {
  font-size: 20px;
  color: #07c160;
  font-weight: bold;
  margin-bottom: 24px;
}
</style>
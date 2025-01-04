<template>
  <div class="reaction-game">
    <van-nav-bar
      title="反应测试"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    
    <GameArea :state="gameState" @click="handleClick">
      <!-- 等待开始 -->
      <template v-if="gameState === 'waiting'">
        <h2>准备开始</h2>
        <p>屏幕变绿时立即点击!</p>
        <van-button type="primary" @click.stop="startGame">开始测试</van-button>
      </template>
      
      <!-- 准备阶段 -->
      <template v-if="gameState === 'ready'">
        <h2>等待...</h2>
        <p>看到绿色时立即点击</p>
      </template>
      
      <!-- 点击阶段 -->
      <template v-if="gameState === 'active'">
        <h2>立即点击!</h2>
      </template>
      
      <!-- 结果显示 -->
      <template v-if="gameState === 'clicked'">
        <ResultDisplay :time="reactionTime">
          <van-button type="primary" @click.stop="startGame">再试一次</van-button>
        </ResultDisplay>
      </template>
      
      <!-- 提前点击 -->
      <template v-if="gameState === 'early'">
        <h2>太早了!</h2>
        <p>请等待屏幕变成绿色</p>
        <van-button type="primary" @click.stop="startGame">重新开始</van-button>
      </template>
    </GameArea>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import GameArea from '../../components/games/reaction/GameArea.vue';
import ResultDisplay from '../../components/games/reaction/ResultDisplay.vue';
import { updateGameStats } from '../../utils/gameUtils';

type GameState = 'waiting' | 'ready' | 'active' | 'clicked' | 'early';

const gameState = ref<GameState>('waiting');
const startTime = ref(0);
const reactionTime = ref(0);
let timeoutId: number;

const startGame = () => {
  gameState.value = 'ready';
  const delay = Math.floor(Math.random() * 4000) + 2000;
  
  timeoutId = setTimeout(() => {
    gameState.value = 'active';
    startTime.value = Date.now();
  }, delay);
};

const handleClick = () => {
  if (gameState.value === 'waiting') return;
  
  if (gameState.value === 'ready') {
    clearTimeout(timeoutId);
    gameState.value = 'early';
    return;
  }
  
  if (gameState.value === 'active') {
    reactionTime.value = Date.now() - startTime.value;
    gameState.value = 'clicked';
    updateGameStats('反应测试', reactionTime.value);
  }
};
</script>

<style scoped>
.reaction-game {
  height: 100vh;
  background: #f7f8fa;
}
</style>
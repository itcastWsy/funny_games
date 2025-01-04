<template>
  <div class="bubble-pop">
    <van-nav-bar
      title="泡泡爆破"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="game-container">
      <div class="score-board">
        分数: {{ score }}
      </div>

      <CountdownTimer 
        v-if="gameStarted" 
        :duration="30" 
        @timeUp="endGame"
      />
      
      <div 
        v-for="bubble in bubbles" 
        :key="bubble.id"
        class="bubble"
        :style="bubbleStyle(bubble)"
        @click="popBubble(bubble.id)"
      ></div>
      
      <div v-if="!gameStarted" class="start-screen">
        <van-button type="primary" @click="startGame">开始游戏</van-button>
      </div>
      
      <div v-if="gameOver" class="game-over">
        <h2>游戏结束</h2>
        <p class="final-score">最终得分: {{ score }}</p>
        <van-button type="primary" @click="startGame">再玩一次</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue';
import CountdownTimer from '../../components/games/common/CountdownTimer.vue';
import { updateGameStats } from '../../utils/gameUtils';

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

const score = ref(0);
const bubbles = ref<Bubble[]>([]);
const gameStarted = ref(false);
const gameOver = ref(false);
let bubbleInterval: number;

const createBubble = (): Bubble => ({
  id: Math.random(),
  x: Math.random() * 80,
  y: Math.random() * 80,
  size: Math.random() * 30 + 20
});

const bubbleStyle = (bubble: Bubble) => ({
  left: `${bubble.x}%`,
  top: `${bubble.y}%`,
  width: `${bubble.size}px`,
  height: `${bubble.size}px`
});

const startGame = () => {
  score.value = 0;
  bubbles.value = [];
  gameStarted.value = true;
  gameOver.value = false;
  
  bubbleInterval = setInterval(() => {
    if (bubbles.value.length < 10) {
      bubbles.value.push(createBubble());
    }
  }, 1000);
};

const popBubble = (id: number) => {
  if (!gameStarted.value || gameOver.value) return;
  
  const index = bubbles.value.findIndex(b => b.id === id);
  if (index !== -1) {
    bubbles.value.splice(index, 1);
    score.value += 10;
  }
};

const endGame = () => {
  gameOver.value = true;
  gameStarted.value = false;
  clearInterval(bubbleInterval);
  updateGameStats('泡泡爆破', score.value);
};

onUnmounted(() => {
  clearInterval(bubbleInterval);
});
</script>

<style scoped>
.bubble-pop {
  height: 100vh;
  background: #f7f8fa;
}

.game-container {
  height: calc(100vh - 46px);
  position: relative;
  overflow: hidden;
}

.score-board {
  position: fixed;
  top: 56px;
  right: 10px;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  z-index: 1;
}

.bubble {
  position: absolute;
  background: rgba(25, 137, 250, 0.6);
  border-radius: 50%;
  cursor: pointer;
  transition: transform 0.2s;
}

.bubble:hover {
  transform: scale(1.1);
}

.start-screen,
.game-over {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.final-score {
  font-size: 24px;
  color: #1989fa;
  margin: 20px 0;
}
</style>
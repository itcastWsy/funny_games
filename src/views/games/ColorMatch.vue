<template>
  <div class="color-match">
    <van-nav-bar
      title="颜色匹配"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="game-container">
      <div class="score-board">
        分数: {{ score }}
      </div>
      
      <div class="color-display">
        <div class="color-text" :style="{ color: colors[colorIndex] }">
          {{ colorNames[textIndex] }}
        </div>
      </div>
      
      <div class="buttons">
        <van-button 
          type="primary" 
          size="large"
          @click="checkMatch(true)"
        >
          匹配
        </van-button>
        <van-button 
          type="danger" 
          size="large"
          @click="checkMatch(false)"
        >
          不匹配
        </van-button>
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
import { ref } from 'vue';
import { updateGameStats } from '../../utils/gameUtils';

const colors = ['#f44336', '#2196f3', '#4caf50', '#ffeb3b'];
const colorNames = ['红色', '蓝色', '绿色', '黄色'];

const score = ref(0);
const colorIndex = ref(0);
const textIndex = ref(0);
const gameOver = ref(false);
let timeoutId: number;

const startGame = () => {
  score.value = 0;
  gameOver.value = false;
  nextRound();
};

const nextRound = () => {
  colorIndex.value = Math.floor(Math.random() * colors.length);
  textIndex.value = Math.floor(Math.random() * colorNames.length);
  
  clearTimeout(timeoutId);
  timeoutId = setTimeout(() => {
    endGame();
  }, 2000);
};

const checkMatch = (isMatch: boolean) => {
  const actualMatch = colorIndex.value === textIndex.value;
  if (isMatch === actualMatch) {
    score.value += 10;
    nextRound();
  } else {
    endGame();
  }
};

const endGame = () => {
  gameOver.value = true;
  clearTimeout(timeoutId);
  updateGameStats('颜色匹配', score.value);
};

startGame();
</script>

<style scoped>
.color-match {
  height: 100vh;
  background: #f7f8fa;
}

.game-container {
  height: calc(100vh - 46px);
  padding: 16px;
  background: #fff;
  display: flex;
  flex-direction: column;
}

.score-board {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  margin-bottom: 16px;
}

.color-display {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.color-text {
  font-size: 48px;
  font-weight: bold;
}

.buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin: 20px 0;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(255, 255, 255, 0.95);
  padding: 20px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.final-score {
  font-size: 24px;
  color: #1989fa;
  margin: 20px 0;
}
</style>
<template>
  <div class="memory-game">
    <van-nav-bar
      title="记忆翻牌"
      left-text="返回"
      left-arrow
      @click-left="$router.back()"
    />
    
    <div class="game-container">
      <div class="score-board">
        翻牌次数: {{ flips }}
      </div>

      <CountdownTimer 
        v-if="countdownStarted && !gameComplete" 
        :duration="30" 
        @timeUp="timeUp"
      />
      
      <div class="cards-grid">
        <div 
          v-for="card in cards" 
          :key="card.id"
          class="card"
          :class="{ flipped: card.isFlipped }"
          @click="flipCard(card)"
        >
          <div class="card-inner">
            <div class="card-front"></div>
            <div class="card-back">{{ card.value }}</div>
          </div>
        </div>
      </div>
      
      <div v-if="!gameStarted" class="start-screen">
        <van-button type="primary" @click="startGame">开始游戏</van-button>
      </div>
      
      <div v-if="gameComplete" class="game-over">
        <h2>{{ timeIsUp ? '时间到！' : '恭喜完成!' }}</h2>
        <p class="final-score">总共翻牌: {{ flips }}次</p>
        <van-button type="primary" @click="startGame">再玩一次</van-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import CountdownTimer from '../../components/games/common/CountdownTimer.vue';
import { updateGameStats } from '../../utils/gameUtils';

interface Card {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const cards = ref<Card[]>([]);
const flips = ref(0);
const gameStarted = ref(false);
const countdownStarted = ref(false);
const gameComplete = ref(false);
const timeIsUp = ref(false);
let flippedCards: Card[] = [];

const createCards = () => {
  const values = ['🎮', '🎲', '🎯', '🎨', '🎭', '🎪', '🎫', '🎪'];
  const pairs = [...values, ...values];
  return pairs
    .sort(() => Math.random() - 0.5)
    .map((value, index) => ({
      id: index,
      value,
      isFlipped: false,
      isMatched: false
    }));
};

const startGame = () => {
  cards.value = createCards();
  flips.value = 0;
  gameStarted.value = true;
  countdownStarted.value = false;
  gameComplete.value = false;
  timeIsUp.value = false;
  flippedCards = [];
};

const flipCard = (card: Card) => {
  if (!gameStarted.value || gameComplete.value || 
      card.isFlipped || card.isMatched || 
      flippedCards.length >= 2) return;

  // 第一次翻牌时开始倒计时
  if (!countdownStarted.value) {
    countdownStarted.value = true;
  }

  card.isFlipped = true;
  flippedCards.push(card);
  
  if (flippedCards.length === 2) {
    flips.value++;
    checkMatch();
  }
};

const checkMatch = () => {
  setTimeout(() => {
    const [card1, card2] = flippedCards;
    if (card1.value === card2.value) {
      card1.isMatched = true;
      card2.isMatched = true;
      
      if (cards.value.every(card => card.isMatched)) {
        gameComplete.value = true;
        updateGameStats('记忆翻牌', flips.value);
      }
    } else {
      card1.isFlipped = false;
      card2.isFlipped = false;
    }
    flippedCards = [];
  }, 1000);
};

const timeUp = () => {
  timeIsUp.value = true;
  gameComplete.value = true;
  cards.value.forEach(card => {
    card.isFlipped = true;
  });
  updateGameStats('记忆翻牌', flips.value);
};

startGame();
</script>

<style scoped>
.memory-game {
  height: 100vh;
  background: #f7f8fa;
}

.game-container {
  height: calc(100vh - 46px);
  padding: 16px;
}

.score-board {
  text-align: center;
  padding: 10px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 5px;
  margin-bottom: 16px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 10px;
  margin: 20px auto;
  max-width: 400px;
}

.card {
  aspect-ratio: 1;
  perspective: 1000px;
  cursor: pointer;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 0.5s;
}

.card.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border-radius: 8px;
  background: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.card-front {
  background: #1989fa;
}

.card-back {
  transform: rotateY(180deg);
}

.start-screen,
.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
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
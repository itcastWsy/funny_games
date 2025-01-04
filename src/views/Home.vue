<template>
  <div class="home">
    <van-nav-bar title="趣味游戏" />
    
    <div class="game-list">
      <van-cell-group inset>
        <van-cell 
          v-for="game in games" 
          :key="game.id"
          :title="game.name"
          :label="game.description"
          is-link
          :to="game.route"
          @click="handleGameClick(game)"
        >
          <template #icon>
            <div class="game-icon">
              <van-icon :name="game.icon" size="32" />
            </div>
          </template>
        </van-cell>
      </van-cell-group>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const games = ref([
  {
    id: 1,
    name: '反应测试',
    description: '测试你的反应速度！',
    icon: 'fire',
    route: '/games/reaction'
  },
  {
    id: 2,
    name: '泡泡爆破',
    description: '点击泡泡，获得高分！',
    icon: 'cluster-o',
    route: '/games/bubble-pop'
  },
  {
    id: 3,
    name: '记忆翻牌',
    description: '考验你的记忆力！',
    icon: 'apps-o',
    route: '/games/memory-cards'
  },
  {
    id: 4,
    name: '颜色匹配',
    description: '快速判断颜色是否匹配！',
    icon: 'gem-o',
    route: '/games/color-match'
  }
]);

const handleGameClick = (game: any) => {
  // Additional handling if needed
};
</script>

<style scoped>
.home {
  padding-bottom: 50px;
}

.game-list {
  margin-top: 16px;
}

.game-icon {
  margin-right: 8px;
  display: flex;
  align-items: center;
}
</style>
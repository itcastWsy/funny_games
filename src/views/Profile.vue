<template>
  <div class="profile">
    <van-nav-bar title="个人中心" />
    
    <template v-if="isLoggedIn">
      <div class="user-info">
        <van-image
          round
          width="80"
          height="80"
          :src="userInfo.avatar"
          :fallback="defaultAvatar"
        />
        <h2 class="username">{{ userInfo.username }}</h2>
      </div>

      <van-cell-group inset title="游戏统计">
        <van-cell
          v-for="summary in gameSummaries"
          :key="summary.gameName"
          :title="summary.gameName"
        >
          <template #value>
            <div class="game-stats">
              <div>最佳: {{ summary.bestScore }}</div>
              <div>场次: {{ summary.totalGames }}</div>
              <div>平均: {{ summary.averageScore }}</div>
            </div>
          </template>
        </van-cell>
      </van-cell-group>

      <div class="logout-btn">
        <van-button round block type="danger" @click="handleLogout">
          退出登录
        </van-button>
      </div>
    </template>

    <template v-else>
      <div class="login-section">
        <van-form @submit="onSubmit">
          <van-cell-group inset>
            <van-field
              v-model="username"
              name="username"
              label="用户名"
              placeholder="请输入用户名"
              :rules="[{ required: true, message: '请填写用户名' }]"
            />
            <van-field
              v-model="password"
              type="password"
              name="password"
              label="密码"
              placeholder="请输入密码(不少于6位)"
              :rules="passwordRules"
            />
          </van-cell-group>
          <div class="submit-btn">
            <van-button round block type="primary" native-type="submit">
              {{ isRegistering ? '注册' : '登录' }}
            </van-button>
          </div>
        </van-form>
        <van-button 
          class="switch-btn" 
          block 
          plain 
          @click="isRegistering = !isRegistering"
        >
          {{ isRegistering ? '已有账号？去登录' : '没有账号？去注册' }}
        </van-button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { validateAuth, register, login } from '../utils/authUtils';
import { getGameSummaries } from '../utils/gameUtils';
import { useIntervalFn } from '@vueuse/core';
import { useUserStore } from '../stores/user';
import type { GameSummary } from '@/types/game';
import type { FieldRule } from 'vant';
import { showToast } from 'vant';

const userStore = useUserStore();
const isLoggedIn = ref(false);
const isRegistering = ref(false);
const username = ref('');
const password = ref('');
const gameSummaries = ref<GameSummary[]>([
  {
    gameName: '反应测试',
    bestScore: 0,
    totalGames: 0,
    averageScore: 0
  },
  {
    gameName: '泡泡爆破',
    bestScore: 0,
    totalGames: 0,
    averageScore: 0
  },
  {
    gameName: '记忆翻牌',
    bestScore: 0,
    totalGames: 0,
    averageScore: 0
  },
  {
    gameName: '颜色匹配',
    bestScore: 0,
    totalGames: 0,
    averageScore: 0
  }
]);

const defaultAvatar = 'https://fastly.jsdelivr.net/npm/@vant/assets/cat.jpeg';

const userInfo = ref({
  username: '',
  avatar: defaultAvatar
});

const passwordRules: FieldRule[] = [
  { required: true, message: '请输入密码' },
  { pattern: /.{6,}/, message: '密码不能少于6位' }
];

const onSubmit = async (values: any) => {
  const error = validateAuth(values.username, values.password);
  if (error) {
    showToast(error);
    return;
  }

  try {
    if (isRegistering.value) {
      // 注册逻辑
      const success = register(values);
      if (success) {
        showToast('注册成功');
        // 注册成功后自动登录
        await handleLogin(values);
      }
    } else {
      // 登录逻辑
      await handleLogin(values);
    }
  } catch (err) {
    showToast(err instanceof Error ? err.message : '操作失败');
  }
};

const handleLogin = async (values: any) => {
  const success = login(values);
  if (success) {
    isLoggedIn.value = true;
    userInfo.value.username = values.username;
    userStore.login(values.username);
    // 初始化游戏数据
    initializeGameData(values.username);
    showToast('登录成功');
    loadUserData();
  } else {
    throw new Error('登录失败');
  }
};

const handleLogout = () => {
  localStorage.removeItem('currentUser');
  userStore.logout();
  isLoggedIn.value = false;
  userInfo.value.username = '';
  gameSummaries.value = gameSummaries.value.map(summary => ({
    ...summary,
    bestScore: 0,
    totalGames: 0,
    averageScore: 0
  }));
  showToast('已退出登录');
};

const initializeGameData = (username: string) => {
  // 如果用户是首次登录，初始化游戏数据
  if (!localStorage.getItem(`${username}_reactionScores`)) {
    localStorage.setItem(`${username}_reactionScores`, '[]');
  }
  if (!localStorage.getItem(`${username}_bubblePopScores`)) {
    localStorage.setItem(`${username}_bubblePopScores`, '[]');
  }
};

const loadUserData = () => {
  const currentUser = localStorage.getItem('currentUser');
  if (currentUser) {
    isLoggedIn.value = true;
    userInfo.value.username = currentUser;
    userStore.login(currentUser);
    gameSummaries.value = getGameSummaries(currentUser);
  }
};

// 定期刷新游戏统计数据
const refreshGameStats = () => {
  if (isLoggedIn.value) {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      gameSummaries.value = getGameSummaries(currentUser);
    }
  }
};

// 每5秒刷新一次统计数据
useIntervalFn(refreshGameStats, 5000);

onMounted(() => {
  loadUserData();
});
</script>

<style scoped>
.profile {
  padding-bottom: 50px;
}

.user-info {
  padding: 20px;
  text-align: center;
  background: white;
}

.username {
  margin-top: 12px;
  font-size: 18px;
  color: #323233;
}

.login-section {
  padding: 20px;
}

.submit-btn {
  margin: 16px;
}

.switch-btn {
  margin-top: 8px;
}

.logout-btn {
  margin: 20px 16px;
}

.game-stats {
  display: flex;
  gap: 10px;
  font-size: 12px;
  color: #666;
}
</style>
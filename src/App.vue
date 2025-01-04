<template>
  <div class="app-container">
    <router-view></router-view>
    <van-tabbar v-model="activeTab" route>
      <van-tabbar-item to="/" icon="home-o">首页</van-tabbar-item>
      <van-tabbar-item to="/profile" icon="user-o">我的</van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const activeTab = ref(0);
</script>

<style>
.app-container {
  min-height: 100vh;
  background-color: #f7f8fa;
}
</style>
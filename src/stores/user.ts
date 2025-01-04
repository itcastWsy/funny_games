import { defineStore } from 'pinia';
import type { GameRecord } from '@/types/game';

export const useUserStore = defineStore('user', {
  state: () => ({
    username: '',
    isLoggedIn: false,
    gameRecords: [] as GameRecord[]
  }),
  
  actions: {
    login(username: string) {
      this.isLoggedIn = true;
      this.username = username;
      this.loadGameRecords();
    },
    
    logout() {
      this.isLoggedIn = false;
      this.username = '';
      this.gameRecords = [];
    },
    
    loadGameRecords() {
      const reactionScores = JSON.parse(localStorage.getItem(`${this.username}_reactionScores`) || '[]');
      const bubblePopScores = JSON.parse(localStorage.getItem(`${this.username}_bubblePopScores`) || '[]');
      
      this.gameRecords = [
        ...reactionScores.map((score: number) => ({
          gameName: '反应测试',
          score,
          timestamp: Date.now()
        })),
        ...bubblePopScores.map((score: number) => ({
          gameName: '泡泡爆破',
          score,
          timestamp: Date.now()
        }))
      ].sort((a, b) => b.score - a.score);
    }
  }
});
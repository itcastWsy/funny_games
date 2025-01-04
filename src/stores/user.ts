import { defineStore } from 'pinia';

export const useUserStore = defineStore('user', {
  state: () => ({
    isLoggedIn: false,
    userInfo: {
      username: '',
      avatar: ''
    },
    gameRecords: []
  }),
  
  actions: {
    login(username: string) {
      this.isLoggedIn = true;
      this.userInfo.username = username;
      this.loadGameRecords();
    },
    
    logout() {
      this.isLoggedIn = false;
      this.userInfo.username = '';
      this.gameRecords = [];
    },
    
    loadGameRecords() {
      const reactionScores = JSON.parse(localStorage.getItem('reactionScores') || '[]');
      const bubblePopScores = JSON.parse(localStorage.getItem('bubblePopScores') || '[]');
      
      this.gameRecords = [
        ...reactionScores.map((score: number) => ({
          gameName: '反应测试',
          score
        })),
        ...bubblePopScores.map((score: number) => ({
          gameName: '泡泡爆破',
          score
        }))
      ].sort((a, b) => b.score - a.score);
    }
  }
});
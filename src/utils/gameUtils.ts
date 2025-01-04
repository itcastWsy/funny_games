import { showSuccessToast } from 'vant';
import type { GameSummary } from '@/types/game';

interface GameScore {
  score: number;
  date: string;
}

interface GameSummary {
  gameName: string;
  bestScore: number;
  totalGames: number;
  averageScore: number;
}

export const getRating = (time: number): string => {
  if (time < 200) return '神级反应!';
  if (time < 300) return '超快!';
  if (time < 400) return '很好!';
  if (time < 500) return '不错!';
  return '继续努力!';
};

export const updateGameStats = (gameName: string, score: number): void => {
  const username = localStorage.getItem('currentUser');
  if (!username) return;

  const key = `${username}_${gameName.toLowerCase()}_scores`;
  const scores: GameScore[] = JSON.parse(localStorage.getItem(key) || '[]');
  
  scores.push({
    score,
    date: new Date().toISOString()
  });
  
  localStorage.setItem(key, JSON.stringify(scores));
  showSuccessToast('成绩已保存');
};

export function getGameSummaries(username: string): GameSummary[] {
  const reactionScores = JSON.parse(localStorage.getItem(`${username}_reactionScores`) || '[]');
  const bubblePopScores = JSON.parse(localStorage.getItem(`${username}_bubblePopScores`) || '[]');
  const memoryCardsScores = JSON.parse(localStorage.getItem(`${username}_memoryCardsScores`) || '[]');
  const colorMatchScores = JSON.parse(localStorage.getItem(`${username}_colorMatchScores`) || '[]');

  return [
    {
      gameName: '反应测试',
      bestScore: reactionScores.length > 0 ? Math.min(...reactionScores) : 0,
      totalGames: reactionScores.length,
      averageScore: reactionScores.length > 0 
        ? Math.round(reactionScores.reduce((a: number, b: number) => a + b, 0) / reactionScores.length) 
        : 0
    },
    {
      gameName: '泡泡爆破',
      bestScore: bubblePopScores.length > 0 ? Math.max(...bubblePopScores) : 0,
      totalGames: bubblePopScores.length,
      averageScore: bubblePopScores.length > 0 
        ? Math.round(bubblePopScores.reduce((a: number, b: number) => a + b, 0) / bubblePopScores.length) 
        : 0
    },
    {
      gameName: '记忆翻牌',
      bestScore: memoryCardsScores.length > 0 ? Math.max(...memoryCardsScores) : 0,
      totalGames: memoryCardsScores.length,
      averageScore: memoryCardsScores.length > 0 
        ? Math.round(memoryCardsScores.reduce((a: number, b: number) => a + b, 0) / memoryCardsScores.length) 
        : 0
    },
    {
      gameName: '颜色匹配',
      bestScore: colorMatchScores.length > 0 ? Math.max(...colorMatchScores) : 0,
      totalGames: colorMatchScores.length,
      averageScore: colorMatchScores.length > 0 
        ? Math.round(colorMatchScores.reduce((a: number, b: number) => a + b, 0) / colorMatchScores.length) 
        : 0
    }
  ];
}

export function saveGameScore(username: string, gameName: string, score: number): void {
  const key = `${username}_${gameName}Scores`;
  const scores = JSON.parse(localStorage.getItem(key) || '[]');
  scores.push(score);
  localStorage.setItem(key, JSON.stringify(scores));
}

const initializeGameData = (username: string) => {
  // 如果用户是首次登录，初始化所有游戏数据
  const games = ['reaction', 'bubblePop', 'memoryCards', 'colorMatch'];
  games.forEach(game => {
    const key = `${username}_${game}Scores`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, '[]');
    }
  });
};
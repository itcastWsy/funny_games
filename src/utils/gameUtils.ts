import { showSuccessToast } from 'vant';

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

export const getGameSummaries = (username: string): GameSummary[] => {
  const games = ['反应测试', '泡泡爆破', '记忆翻牌', '颜色匹配'];
  
  return games.map(gameName => {
    const key = `${username}_${gameName.toLowerCase()}_scores`;
    const scores: GameScore[] = JSON.parse(localStorage.getItem(key) || '[]');
    
    if (scores.length === 0) {
      return {
        gameName,
        bestScore: 0,
        totalGames: 0,
        averageScore: 0
      };
    }

    const allScores = scores.map(s => s.score);
    
    return {
      gameName,
      bestScore: Math.min(...allScores),
      totalGames: scores.length,
      averageScore: Math.round(allScores.reduce((a, b) => a + b, 0) / scores.length)
    };
  });
};
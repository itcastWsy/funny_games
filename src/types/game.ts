export interface GameSummary {
  gameName: string;
  bestScore: number;
  totalGames: number;
  averageScore: number;
}

export interface GameRecord {
  gameName: string;
  score: number;
  timestamp: number;
} 
export type GameStatus = 'MENU' | 'PLAYING' | 'GAME_OVER';

export interface Position {
  x: number;
  y: number;
  z: number;
}

export interface Projectile {
  id: string;
  position: Position;
}

export interface GameState {
  status: GameStatus;
  score: number;
  highScore: number;
  speed: number;
  shipPosition: Position;
  projectiles: Projectile[];
  setShipPosition: (pos: Position) => void;
  setStatus: (status: GameStatus) => void;
  addScore: (amount: number) => void;
  resetGame: () => void;
  increaseSpeed: () => void;
  inputVector: { x: number; y: number };
  setInputVector: (x: number, y: number) => void;
  fireProjectile: () => void;
  removeProjectile: (id: string) => void;
}

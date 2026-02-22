import { create } from 'zustand';
import { GameState } from './types';

export const useGameStore = create<GameState>((set) => ({
  status: 'MENU',
  score: 0,
  highScore: parseInt(localStorage.getItem('neon_horizon_highscore') || '0'),
  speed: 0.5,
  shipPosition: { x: 0, y: 1, z: 0 },
  projectiles: [],
  inputVector: { x: 0, y: 0 },

  setShipPosition: (pos) => set({ shipPosition: pos }),
  setStatus: (status) => set({ status }),
  addScore: (amount) => set((state) => {
    const newScore = state.score + amount;
    const newHighScore = Math.max(newScore, state.highScore);
    if (newHighScore > state.highScore) {
      localStorage.setItem('neon_horizon_highscore', newHighScore.toString());
    }
    return { score: newScore, highScore: newHighScore };
  }),
  resetGame: () => set((state) => ({ 
    status: 'PLAYING', 
    score: 0, 
    speed: 0.5, 
    shipPosition: { x: 0, y: 1, z: 0 },
    projectiles: [],
    inputVector: { x: 0, y: 0 }
  })),
  increaseSpeed: () => set((state) => ({ speed: Math.min(state.speed + 0.0005, 1.5) })),
  setInputVector: (x, y) => set({ inputVector: { x, y } }),
  fireProjectile: () => set((state) => {
    if (state.status !== 'PLAYING') return state;
    
    // Simple cooldown check (e.g., 200ms)
    const now = Date.now();
    const lastFire = (state as any).lastFireTime || 0;
    if (now - lastFire < 200) return state;

    const newProjectile = {
      id: Math.random().toString(36).substring(7),
      position: { ...state.shipPosition }
    };
    return { 
      projectiles: [...state.projectiles, newProjectile],
      lastFireTime: now
    } as any;
  }),
  removeProjectile: (id) => set((state) => ({
    projectiles: state.projectiles.filter(p => p.id !== id)
  })),
}));

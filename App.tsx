import React, { useEffect, useState } from 'react';
import GameScene from './components/GameScene';
import Joystick from './components/Joystick';
import InputManager from './components/InputManager';
import { useGameStore } from './store';
import { Play, RotateCcw, Trophy } from 'lucide-react';

const App: React.FC = () => {
  const { status, score, highScore, resetGame, fireProjectile } = useGameStore();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden select-none">
      <InputManager />
      
      {/* 3D Scene Background */}
      <div className="absolute inset-0 z-0">
        <GameScene />
      </div>

      {/* HUD - Score */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 font-retro text-cyan-400">
        <div className="text-xl drop-shadow-[0_0_5px_rgba(0,255,255,0.8)]">
          SCORE: {Math.floor(score).toString().padStart(6, '0')}
        </div>
        <div className="text-sm text-pink-500 drop-shadow-[0_0_5px_rgba(255,0,255,0.8)]">
          HI: {Math.floor(highScore).toString().padStart(6, '0')}
        </div>
      </div>

      {/* Menu Overlay */}
      {status === 'MENU' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/60 backdrop-blur-sm">
          <h1 className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-cyan-300 to-purple-600 mb-8 font-retro drop-shadow-[0_0_15px_rgba(128,0,255,0.8)] tracking-tighter text-center px-4">
            NEON<br/>HORIZON
          </h1>
          <button 
            onClick={resetGame}
            className="group relative px-8 py-4 bg-transparent border-2 border-cyan-500 text-cyan-500 font-bold text-xl md:text-2xl uppercase tracking-widest hover:bg-cyan-500 hover:text-black transition-all duration-300 font-retro"
          >
            <span className="flex items-center gap-2">
              <Play className="w-6 h-6" /> Start Mission
            </span>
            <div className="absolute inset-0 bg-cyan-400 opacity-20 group-hover:animate-pulse"></div>
          </button>
          
          <div className="mt-12 text-center text-purple-300 opacity-80 font-sans max-w-md px-6">
            <p className="mb-2 uppercase tracking-widest text-sm">Controls</p>
            {isMobile ? (
               <p>Use the virtual joystick to steer. Tap the FIRE button to shoot.</p>
            ) : (
               <p>Use ARROW KEYS or WASD to move. SPACE to fire.</p>
            )}
            <p className="mt-2 text-xs text-purple-400">Avoid the neon obstacles.</p>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {status === 'GAME_OVER' && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-red-900/40 backdrop-blur-sm">
          <h2 className="text-5xl md:text-7xl font-black text-red-500 mb-2 font-retro drop-shadow-[0_0_10px_#ff0000]">
            CRASHED
          </h2>
          <div className="text-2xl text-white mb-8 font-retro flex flex-col items-center gap-2">
            <span>SCORE: {Math.floor(score)}</span>
            {score >= highScore && score > 0 && (
                <span className="text-yellow-400 text-sm animate-pulse flex items-center gap-1">
                    <Trophy size={16} /> NEW HIGH SCORE!
                </span>
            )}
          </div>
          <button 
            onClick={resetGame}
            className="px-8 py-4 bg-red-600 text-white font-bold text-xl uppercase tracking-widest hover:bg-red-500 hover:scale-105 transition-all duration-200 font-retro shadow-[0_0_20px_#ff0000]"
          >
            <span className="flex items-center gap-2">
              <RotateCcw className="w-6 h-6" /> Retry
            </span>
          </button>
        </div>
      )}

      {/* Mobile Controls */}
      {status === 'PLAYING' && isMobile && (
        <>
          <Joystick />
          <button 
            onPointerDown={() => fireProjectile()}
            className="absolute bottom-12 right-12 z-20 w-20 h-20 rounded-full bg-cyan-500/20 border-4 border-cyan-500 flex items-center justify-center text-cyan-500 font-retro text-xs active:bg-cyan-500 active:text-black transition-colors"
          >
            FIRE
          </button>
        </>
      )}
      
      {/* CRT Scanline Effect Overlay (CSS) */}
      <div className="pointer-events-none absolute inset-0 z-30 opacity-10 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%] bg-repeat"></div>
      <div className="pointer-events-none absolute inset-0 z-30 opacity-20 radial-gradient(circle, rgba(0,0,0,0) 60%, rgba(0,0,0,0.4) 100%)"></div>
    </div>
  );
};

export default App;
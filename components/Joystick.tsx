import React, {  useRef, useState, useEffect } from 'react';
import { useGameStore } from '../store';

const Joystick: React.FC = () => {
  const setInputVector = useGameStore((state) => state.setInputVector);
  const containerRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  const handleStart = (clientX: number, clientY: number) => {
    setActive(true);
    setOrigin({ x: clientX, y: clientY });
    setPosition({ x: 0, y: 0 });
    setInputVector(0, 0);
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!active) return;
    
    const maxRadius = 50;
    let dx = clientX - origin.x;
    let dy = clientY - origin.y;
    
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > maxRadius) {
      const angle = Math.atan2(dy, dx);
      dx = Math.cos(angle) * maxRadius;
      dy = Math.sin(angle) * maxRadius;
    }

    setPosition({ x: dx, y: dy });
    
    // Normalize -1 to 1
    // Invert Y because screen Y is down, game Y is up
    setInputVector(dx / maxRadius, -(dy / maxRadius));
  };

  const handleEnd = () => {
    setActive(false);
    setPosition({ x: 0, y: 0 });
    setInputVector(0, 0);
  };

  // Mouse handlers
  const onMouseDown = (e: React.MouseEvent) => handleStart(e.clientX, e.clientY);
  const onMouseMove = (e: MouseEvent) => handleMove(e.clientX, e.clientY);
  const onMouseUp = () => handleEnd();

  // Touch handlers
  const onTouchStart = (e: React.TouchEvent) => {
    // Prevent default to stop scrolling
    // e.preventDefault(); 
    const touch = e.touches[0];
    handleStart(touch.clientX, touch.clientY);
  };
  const onTouchMove = (e: TouchEvent) => {
    if(!active) return;
    // e.preventDefault();
    const touch = e.touches[0];
    handleMove(touch.clientX, touch.clientY);
  };
  const onTouchEnd = (e: TouchEvent) => handleEnd();

  useEffect(() => {
    if (active) {
      window.addEventListener('mousemove', onMouseMove);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('touchmove', onTouchMove, { passive: false });
      window.addEventListener('touchend', onTouchEnd);
    } else {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [active]);

  return (
    <div 
      className="absolute bottom-8 left-8 w-32 h-32 rounded-full border-2 border-cyan-500/30 flex items-center justify-center z-50 touch-none"
      ref={containerRef}
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      <div 
        className={`w-12 h-12 rounded-full bg-cyan-500 shadow-[0_0_15px_#00ffff] transition-transform duration-75 ${active ? 'opacity-80' : 'opacity-40'}`}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`
        }}
      />
      {!active && <div className="absolute text-cyan-500/50 text-xs bottom-2 pointer-events-none">DRAG</div>}
    </div>
  );
};

export default Joystick;
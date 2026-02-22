import React, { useEffect } from 'react';
import { useGameStore } from '../store';

const InputManager = () => {
  const setInputVector = useGameStore(state => state.setInputVector);
  const fireProjectile = useGameStore(state => state.fireProjectile);
  const status = useGameStore(state => state.status);

  useEffect(() => {
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false,
      ' ': false
    };

    const updateVector = () => {
      let x = 0;
      let y = 0;
      if (keys.ArrowLeft || keys.a) x -= 1;
      if (keys.ArrowRight || keys.d) x += 1;
      if (keys.ArrowUp || keys.w) y += 1;
      if (keys.ArrowDown || keys.s) y -= 1;
      setInputVector(x, y);
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        fireProjectile();
      }
      if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        (keys as any)[e.key] = true;
        updateVector();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (Object.prototype.hasOwnProperty.call(keys, e.key)) {
        (keys as any)[e.key] = false;
        updateVector();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [setInputVector]);

  return null;
};

export default InputManager;
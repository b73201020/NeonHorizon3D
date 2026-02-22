import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import World from './World';
import Spaceship from './Spaceship';
import Obstacles from './Obstacles';
import Projectiles from './Projectiles';
import { useGameStore } from '../store';

const SceneContent = () => {
  const status = useGameStore(state => state.status);
  
  return (
    <>
        <World />
        <Spaceship />
        <Projectiles />
        {status === 'PLAYING' && <Obstacles />}
        
        <EffectComposer disableNormalPass>
            <Bloom luminanceThreshold={0.2} mipmapBlur intensity={1.5} radius={0.6} />
            <ChromaticAberration offset={[0.002, 0.002]} />
            <Noise opacity={0.05} blendFunction={BlendFunction.OVERLAY} />
        </EffectComposer>
    </>
  );
};

const GameScene = () => {
  return (
    <Canvas shadows dpr={[1, 2]} gl={{ antialias: false, alpha: false }}>
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  );
};

export default GameScene;
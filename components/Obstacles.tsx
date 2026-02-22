import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { InstancedMesh, Object3D, Vector3 } from 'three';
import { useGameStore } from '../store';

const COUNT = 30;
const SPAWN_DISTANCE = -80;

const Obstacles = () => {
  const meshRef = useRef<InstancedMesh>(null);
  const { speed, status, shipPosition, setStatus, addScore, increaseSpeed } = useGameStore();
  const dummy = useMemo(() => new Object3D(), []);
  
  // Store obstacles data: x, y, z, active, passed
  const obstacles = useRef(
    new Array(COUNT).fill(0).map(() => ({
      position: new Vector3((Math.random() - 0.5) * 16, Math.random() * 5, SPAWN_DISTANCE - Math.random() * 50),
      scale: Math.random() * 0.5 + 0.5,
      rotationSpeed: { x: Math.random(), y: Math.random() },
      active: false
    }))
  );

  // Initial distribution
  useEffect(() => {
    obstacles.current.forEach((obs, i) => {
        obs.position.z = SPAWN_DISTANCE + (i * (80 / COUNT));
        obs.active = true;
    });
  }, []);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;

    const gameSpeed = speed * 40 * delta;
    
    // Player hitbox approximation
    const shipRadius = 0.5;

    obstacles.current.forEach((obs, i) => {
      // Move Obstacle
      obs.position.z += gameSpeed;

      // Rotate Obstacle
      dummy.position.copy(obs.position);
      dummy.scale.setScalar(obs.scale);
      dummy.rotation.x += obs.rotationSpeed.x * delta;
      dummy.rotation.y += obs.rotationSpeed.y * delta;
      dummy.updateMatrix();
      
      if (meshRef.current) {
        meshRef.current.setMatrixAt(i, dummy.matrix);
      }

      // Collision Detection
      // Only check if close enough in Z to save calculation
      if (Math.abs(obs.position.z - shipPosition.z) < 1) {
          const dx = obs.position.x - shipPosition.x;
          const dy = obs.position.y - shipPosition.y;
          const dist = Math.sqrt(dx*dx + dy*dy);
          
          if (dist < (shipRadius + obs.scale * 0.5)) {
              setStatus('GAME_OVER');
          }
      }

      // Scoring & Respawn
      if (obs.position.z > 5) {
        // Passed player
        addScore(10);
        increaseSpeed();
        
        // Respawn far away
        obs.position.z = SPAWN_DISTANCE - Math.random() * 20;
        obs.position.x = (Math.random() - 0.5) * 16;
        obs.position.y = Math.random() * 5 + 0.5;
        obs.scale = Math.random() * 0.8 + 0.4;
      }
    });

    if (meshRef.current) {
      meshRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, COUNT]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00aaaa" 
        emissiveIntensity={0.8} 
        wireframe={true}
        toneMapped={false}
      />
    </instancedMesh>
  );
};

export default Obstacles;
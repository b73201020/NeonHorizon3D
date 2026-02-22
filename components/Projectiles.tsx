import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGameStore } from '../store';
import * as THREE from 'three';

const ProjectileItem = ({ id, initialPosition }: { id: string; initialPosition: { x: number; y: number; z: number } }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const removeProjectile = useGameStore(state => state.removeProjectile);
  const speed = 2; // Projectile speed

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.z -= speed;
      
      // Remove if too far
      if (meshRef.current.position.z < -100) {
        removeProjectile(id);
      }
    }
  });

  return (
    <mesh ref={meshRef} position={[initialPosition.x, initialPosition.y, initialPosition.z]} rotation={[Math.PI / 2, 0, 0]}>
      <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
      <meshStandardMaterial 
        color="#00ffff" 
        emissive="#00ffff" 
        emissiveIntensity={5} 
        toneMapped={false}
      />
      <pointLight color="#00ffff" intensity={0.5} distance={2} />
    </mesh>
  );
};

const Projectiles = () => {
  const projectiles = useGameStore(state => state.projectiles);

  return (
    <>
      {projectiles.map((p) => (
        <ProjectileItem key={p.id} id={p.id} initialPosition={p.position} />
      ))}
    </>
  );
};

export default Projectiles;

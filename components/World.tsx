import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Stars, Plane } from '@react-three/drei';
import { Mesh, Color } from 'three';
import { useGameStore } from '../store';

const World = () => {
  const gridRef = useRef<Mesh>(null);
  const grid2Ref = useRef<Mesh>(null);
  const { speed, status } = useGameStore();
  
  // Animate the grid to create the illusion of forward movement
  useFrame((state, delta) => {
    if (status === 'PLAYING' || status === 'MENU') {
        const moveSpeed = status === 'MENU' ? 10 : speed * 40; // Base speed multiplier
        
        if (gridRef.current) {
            gridRef.current.position.z += moveSpeed * delta;
            if (gridRef.current.position.z > 20) {
                gridRef.current.position.z = -80;
            }
        }
        if (grid2Ref.current) {
            grid2Ref.current.position.z += moveSpeed * delta;
            if (grid2Ref.current.position.z > 20) {
                grid2Ref.current.position.z = -80;
            }
        }
    }
  });

  return (
    <>
      <color attach="background" args={['#050510']} />
      <fog attach="fog" args={['#050510', 10, 50]} />
      
      {/* The Sun */}
      <mesh position={[0, 8, -60]}>
        <circleGeometry args={[20, 64]} />
        <meshBasicMaterial color={new Color("#ff00cc")} />
      </mesh>
      {/* Sun glow layer */}
      <mesh position={[0, 8, -61]}>
         <circleGeometry args={[22, 32]} />
         <meshBasicMaterial color={new Color("#8800ff")} transparent opacity={0.5} />
      </mesh>

      {/* Retro Grid Floor - Using two planes to loop seamlessly */}
      <group position={[0, -2, 0]}>
        <gridHelper args={[100, 50, 0xff00ff, 0x800080]} position={[0, 0, -30]} ref={gridRef} />
        <gridHelper args={[100, 50, 0xff00ff, 0x800080]} position={[0, 0, -80]} ref={grid2Ref} />
        
        {/* Reflective Plane below grid for depth */}
        <Plane args={[100, 200]} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, -50]}>
             <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} />
        </Plane>
      </group>

      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      
      {/* Ambient Lighting */}
      <ambientLight intensity={0.5} color="#401060" />
      <pointLight position={[10, 10, 10]} intensity={1} color="#00ffff" />
      <pointLight position={[-10, 10, -10]} intensity={1} color="#ff00ff" />
    </>
  );
};

export default World;
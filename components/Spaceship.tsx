import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Vector3, Group } from 'three';
import { useGameStore } from '../store';
import { PerspectiveCamera } from '@react-three/drei';

const Spaceship = () => {
  const shipRef = useRef<Group>(null);
  const { setShipPosition, status, inputVector } = useGameStore();
  const position = useRef(new Vector3(0, 1, 0));
  const velocity = useRef(new Vector3(0, 0, 0));
  const tilt = useRef(0);

  useFrame((state, delta) => {
    if (status !== 'PLAYING') return;

    // Keyboard controls
    const speed = 15;
    let dx = inputVector.x;
    let dy = inputVector.y;

    // Combine keyboard with joystick
    // We poll keyboard directly here to avoid React render loops
    const keys = {
      ArrowUp: false,
      ArrowDown: false,
      ArrowLeft: false,
      ArrowRight: false,
      w: false,
      s: false,
      a: false,
      d: false
    };
    
    // Note: In a real app we might put key listeners in a useEffect in the parent, 
    // but reading inputVector from store handles the joystick. 
    // We'll add keyboard augmentation here.
    // However, to keep it clean, let's assume inputVector is THE source of truth.
    // The InputManager component will handle writing keys to inputVector.
    
    // Smooth movement
    position.current.x += dx * speed * delta;
    position.current.y += dy * speed * delta;

    // Boundaries
    position.current.x = Math.max(-8, Math.min(8, position.current.x));
    position.current.y = Math.max(0.5, Math.min(6, position.current.y));

    // Tilt effect (banking)
    const targetTilt = -dx * 0.8;
    tilt.current += (targetTilt - tilt.current) * 5 * delta;

    if (shipRef.current) {
      shipRef.current.position.copy(position.current);
      shipRef.current.rotation.z = tilt.current;
      shipRef.current.rotation.x = dy * 0.2; // Pitch slightly
    }

    setShipPosition({ x: position.current.x, y: position.current.y, z: position.current.z });
  });

  return (
    <group ref={shipRef} position={[0, 1, 0]}>
      {/* Main Body */}
      <mesh castShadow receiveShadow>
        <coneGeometry args={[0.5, 2, 4]} />
        <meshStandardMaterial color="#222" roughness={0.4} metalness={0.8} />
      </mesh>
      
      {/* Engine Glow */}
      <mesh position={[0, -0.8, 0.2]}>
        <cylinderGeometry args={[0.2, 0.1, 0.5, 8]} />
        <meshBasicMaterial color="#00ffff" />
      </mesh>

      {/* Cockpit */}
      <mesh position={[0, 0.2, 0.3]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.4, 0.4, 0.8]} />
        <meshStandardMaterial color="#111" roughness={0.2} metalness={1} emissive="#ff00ff" emissiveIntensity={0.2} />
      </mesh>

      {/* Wings */}
      <mesh position={[0, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
         <bufferGeometry>
            <float32BufferAttribute attach="attributes-position" count={3} array={new Float32Array([
              -1.5, -0.5, 0,
              1.5, -0.5, 0,
              0, 1.0, 0
            ])} itemSize={3} />
         </bufferGeometry>
         <meshStandardMaterial color="#333" side={2} />
      </mesh>
      
      {/* Wing Glow strips */}
      <mesh position={[-0.8, -0.2, 0.2]} rotation={[Math.PI / 2, 0, -0.2]}>
         <boxGeometry args={[0.05, 1.2, 0.05]} />
         <meshBasicMaterial color="#ff00ff" />
      </mesh>
       <mesh position={[0.8, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0.2]}>
         <boxGeometry args={[0.05, 1.2, 0.05]} />
         <meshBasicMaterial color="#ff00ff" />
      </mesh>

      <PerspectiveCamera makeDefault position={[0, 2, 6]} fov={60} rotation={[-0.2,0,0]} />
    </group>
  );
};

export default Spaceship;
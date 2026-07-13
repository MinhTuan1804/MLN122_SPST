import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useGameStore } from '../store/gameStore';
import * as THREE from 'three';

// --- Background Factory Structure ---
const FactoryBackground: React.FC = () => {
  return (
    <group position={[0, 0, -4]}>
      {/* Back Wall */}
      <mesh position={[0, 2, -2]} receiveShadow>
        <planeGeometry args={[25, 15]} />
        <meshStandardMaterial color="#2B2622" roughness={0.9} metalness={0.1} />
      </mesh>
      
      {/* Giant Pillars */}
      {[-6, -2, 2, 6].map((x, i) => (
        <mesh key={`pillar-${i}`} position={[x, 2, -1]} castShadow receiveShadow>
          <boxGeometry args={[1.5, 15, 1.5]} />
          <meshStandardMaterial color="#1C1814" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Horizontal Beams */}
      {[0, 4, 8].map((y, i) => (
        <mesh key={`beam-${i}`} position={[0, y, -0.5]} castShadow receiveShadow>
          <boxGeometry args={[20, 0.5, 1]} />
          <meshStandardMaterial color="#110F0E" roughness={0.7} metalness={0.6} />
        </mesh>
      ))}
      
      {/* Distant Pipes */}
      {[-4, -1, 3, 5].map((x, i) => (
        <mesh key={`pipe-${i}`} position={[x, 2, -1.8]} castShadow receiveShadow>
          <cylinderGeometry args={[0.3, 0.3, 15, 16]} />
          <meshStandardMaterial color="#3D291F" roughness={0.4} metalness={0.7} />
        </mesh>
      ))}
    </group>
  );
};

// 1. Upgraded Gear Component with realistic bevels/shafts
const Gear: React.FC<{
  position: [number, number, number];
  radius: number;
  teeth: number;
  speedMultiplier: number;
  rotationDirection: number;
  color: string;
}> = ({ position, radius, teeth, speedMultiplier, rotationDirection, color }) => {
  const gearRef = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * rotationDirection * speedMultiplier;
    }
  });

  const toothAngle = (Math.PI * 2) / teeth;
  const toothWidth = radius * 0.22;
  const toothHeight = radius * 0.32;
  const toothDepth = 0.45;

  return (
    <group position={position} ref={gearRef}>
      {/* Central wheel rim */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[radius * 0.78, radius * 0.84, 0.35, 16]} />
        <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
      </mesh>
      
      {/* Central shaft hub */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[radius * 0.22, radius * 0.22, 0.42, 8]} />
        <meshStandardMaterial color="#2B2622" roughness={0.5} metalness={0.9} />
      </mesh>
      {/* Inner shaft hole pin */}
      <mesh position={[0, 0, 0.02]}>
        <cylinderGeometry args={[radius * 0.1, radius * 0.1, 0.45, 8]} />
        <meshStandardMaterial color="#110F0E" roughness={0.8} />
      </mesh>

      {/* Spokes (Industrial curved web look) */}
      {[0, 1, 2].map((i) => (
        <mesh key={i} rotation={[0, 0, (i * Math.PI) / 3]}>
          <boxGeometry args={[radius * 1.55, radius * 0.12, 0.22]} />
          <meshStandardMaterial color={color} roughness={0.4} metalness={0.9} />
        </mesh>
      ))}

      {/* Teeth */}
      {Array.from({ length: teeth }).map((_, idx) => {
        const angle = idx * toothAngle;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        return (
          <mesh
            key={idx}
            position={[x, y, 0]}
            rotation={[0, 0, angle]}
            castShadow
          >
            <boxGeometry args={[toothHeight, toothWidth, toothDepth]} />
            <meshStandardMaterial color={color} roughness={0.3} metalness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
};

// 2. Steam Boiler & Piston Mechanism (Watt Steam Engine)
const SteamPistonMechanism: React.FC<{ isResolving: boolean; gearSpeed: number }> = ({ isResolving, gearSpeed }) => {
  const pistonRef = useRef<THREE.Mesh>(null);
  const rodRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycleSpeed = isResolving ? 8.0 : gearSpeed;
    const movement = Math.sin(time * cycleSpeed) * 0.35;

    // Animate Piston head
    if (pistonRef.current) {
      pistonRef.current.position.x = movement;
    }
    // Animate Piston connecting rod pivot
    if (rodRef.current) {
      rodRef.current.position.x = movement;
      rodRef.current.rotation.z = Math.cos(time * cycleSpeed) * 0.15;
    }
  });

  return (
    <group position={[-1.6, -0.6, -0.8]}>
      {/* 2a. Copper Boiler Tank */}
      <mesh position={[-0.8, 0.8, -0.4]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 1.4, 16]} />
        <meshStandardMaterial color="#A55A3A" roughness={0.2} metalness={0.8} /> {/* Copper */}
      </mesh>
      {/* Boiler iron reinforcing bands */}
      {[-0.5, 0, 0.5].map((zOffset) => (
        <mesh key={zOffset} position={[-0.8 + zOffset, 0.8, -0.4]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.46, 0.46, 0.08, 16]} />
          <meshStandardMaterial color="#2B2622" roughness={0.4} metalness={0.8} />
        </mesh>
      ))}

      {/* 2b. Steam Piping Connecting Boiler to Cylinder */}
      <mesh position={[-0.8, 0.6, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.6, 8]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
      </mesh>
      <mesh position={[-0.4, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.07, 0.07, 0.8, 8]} />
        <meshStandardMaterial color="#D4AF37" roughness={0.3} metalness={0.8} />
      </mesh>

      {/* 2c. Piston Cylinder (Chamber) */}
      <mesh position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.22, 0.6, 12]} />
        <meshStandardMaterial color="#4A4E52" roughness={0.4} metalness={0.9} />
      </mesh>

      {/* 2d. Piston Steel Rod (Inside Chamber, sliding) */}
      <mesh ref={pistonRef} position={[0.2, 0.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 0.8, 8]} />
        <meshStandardMaterial color="#8E9399" roughness={0.2} metalness={0.9} />
      </mesh>

      {/* 2e. Connecting Rod linkage arm */}
      <group ref={rodRef} position={[0.6, 0.3, 0]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <boxGeometry args={[0.04, 0.7, 0.08]} />
          <meshStandardMaterial color="#5A5E62" roughness={0.3} metalness={0.8} />
        </mesh>
        {/* Joint pin */}
        <mesh position={[0, 0.32, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.04, 0.04, 0.12, 8]} />
          <meshStandardMaterial color="#D4AF37" roughness={0.3} />
        </mesh>
      </group>
    </group>
  );
};

// 3. Upgraded Victorian Low-Poly Worker Component
const VictorianWorker: React.FC<{
  index: number;
  position: [number, number, number];
  conflictRate: number;
  vestColor: string;
}> = ({ index, position, conflictRate, vestColor }) => {
  const rightArmRef = useRef<THREE.Group>(null);
  const leftArmRef = useRef<THREE.Group>(null);
  const headRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    const cycle = time * 3.2 + index * 0.4;
    
    // Animate head bobbing slightly (breathing)
    if (headRef.current) {
      headRef.current.rotation.y = Math.sin(cycle * 0.3) * 0.08;
      headRef.current.rotation.x = 0.08 + Math.cos(cycle * 0.3) * 0.04;
    }

    // Animate arms based on conflict level
    if (rightArmRef.current) {
      if (conflictRate > 40) {
        // High tension: raised arm waving fist or red banner aggressively
        rightArmRef.current.rotation.x = -Math.PI / 1.25 + Math.sin(cycle * 1.5) * 0.35;
      } else {
        // Calm: arm swaying relaxed at side
        rightArmRef.current.rotation.x = Math.sin(cycle * 0.5) * 0.08;
      }
    }

    if (leftArmRef.current) {
      if (conflictRate > 65) {
        // Extremely high conflict: wave both fists
        leftArmRef.current.rotation.x = -Math.PI / 1.35 + Math.cos(cycle * 1.4) * 0.3;
      } else {
        // Calm/exhausted: arm hangs down
        leftArmRef.current.rotation.x = -Math.sin(cycle * 0.4) * 0.06;
      }
    }
  });

  return (
    <group position={position}>
      {/* 3a. Torso (Shirt) */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
        <meshStandardMaterial color="#E6DFD3" roughness={0.8} /> {/* Beige Victorian cotton shirt */}
      </mesh>

      {/* 3b. Vest overlay (Wearing a typical Victorian worker vest) */}
      <mesh position={[0, 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.21, 0.42, 8]} />
        <meshStandardMaterial color={vestColor} roughness={0.7} />
      </mesh>

      {/* Vest front button details (tiny gold-ish boxes) */}
      {[0.08, 0, -0.08].map((yOffset) => (
        <mesh key={yOffset} position={[0, 0.42 + yOffset, 0.16]}>
          <boxGeometry args={[0.015, 0.02, 0.015]} />
          <meshStandardMaterial color="#B3923B" metalness={0.7} />
        </mesh>
      ))}

      {/* Suspender straps (dark vertical bands) */}
      {[-0.08, 0.08].map((xOffset) => (
        <mesh key={xOffset} position={[xOffset, 0.43, 0.155]}>
          <boxGeometry args={[0.03, 0.4, 0.01]} />
          <meshStandardMaterial color="#2B2622" roughness={0.8} />
        </mesh>
      ))}

      {/* 3c. Neck */}
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.06, 0.07, 0.08, 8]} />
        <meshStandardMaterial color="#F2E1C1" roughness={0.6} />
      </mesh>

      {/* 3d. Head with Flat Cap group */}
      <group ref={headRef} position={[0, 0.88, 0]}>
        {/* Head Sphere */}
        <mesh castShadow>
          <sphereGeometry args={[0.14, 10, 10]} />
          <meshStandardMaterial color="#F2E1C1" roughness={0.5} />
        </mesh>
        
        {/* flat cap brim/body (typical baker boy hat) */}
        <mesh position={[0, 0.12, -0.02]} rotation={[0.15, 0, 0]} castShadow>
          <cylinderGeometry args={[0.17, 0.17, 0.06, 12]} />
          <meshStandardMaterial color="#3D454A" roughness={0.8} />
        </mesh>
        {/* flat cap peak visor */}
        <mesh position={[0, 0.08, 0.13]} rotation={[0.3, 0, 0]}>
          <boxGeometry args={[0.18, 0.015, 0.08]} />
          <meshStandardMaterial color="#2B2E33" roughness={0.9} />
        </mesh>
      </group>

      {/* 3e. Right Arm (Raised or swinging) */}
      <group ref={rightArmRef} position={[0.2, 0.6, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.042, 0.38, 6]} />
          <meshStandardMaterial color="#E6DFD3" roughness={0.8} />
        </mesh>
        {/* Fist / Hand */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#F2E1C1" roughness={0.5} />
        </mesh>
        {/* If leader (first worker), attach a red banner flag */}
        {index === 0 && (
          <group position={[0, -0.42, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
            {/* Flagpole */}
            <mesh position={[0, 0.5, 0]}>
              <cylinderGeometry args={[0.012, 0.012, 1.2, 6]} />
              <meshStandardMaterial color="#8E5E38" roughness={0.7} />
            </mesh>
            {/* Red Banner */}
            <mesh position={[0.22, 0.9, 0]} rotation={[0, 0, 0]}>
              <boxGeometry args={[0.42, 0.28, 0.015]} />
              <meshStandardMaterial color="#C83E2D" roughness={0.9} />
            </mesh>
          </group>
        )}
      </group>

      {/* 3f. Left Arm */}
      <group ref={leftArmRef} position={[-0.2, 0.6, 0]}>
        <mesh position={[0, -0.18, 0]} castShadow>
          <cylinderGeometry args={[0.048, 0.042, 0.38, 6]} />
          <meshStandardMaterial color="#E6DFD3" roughness={0.8} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.38, 0]}>
          <sphereGeometry args={[0.04, 6, 6]} />
          <meshStandardMaterial color="#F2E1C1" roughness={0.5} />
        </mesh>
      </group>
    </group>
  );
};

// 4. Worker Crowd Manager
const WorkerCrowd: React.FC<{
  organicComposition: number;
  conflictRate: number;
}> = ({ organicComposition, conflictRate }) => {
  // Workers shrink in number as organic composition (machines) increases
  const workerCount = Math.max(3, Math.min(18, Math.round(26 / Math.max(1, organicComposition))));

  // Pre-generate vest colors to avoid rerender color flickering
  const workerConfigs = useMemo(() => {
    const list = [];
    const rows = Math.ceil(Math.sqrt(workerCount));
    const cols = Math.ceil(workerCount / rows);
    const spacingX = 0.65;
    const spacingZ = 0.6;
    const colors = ['#2B2A27', '#453B32', '#2E3539', '#3B3C36', '#4F4F4F', '#382F2D'];

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (list.length >= workerCount) break;
        const x = 1.8 + c * spacingX - (cols * spacingX) / 3;
        const z = r * spacingZ - (rows * spacingZ) / 2;
        const y = -1.5; // ground
        const vestColor = colors[(r * cols + c) % colors.length];
        list.push({
          pos: [x, y, z] as [number, number, number],
          vestColor
        });
      }
    }
    return list;
  }, [workerCount]);

  return (
    <group>
      {workerConfigs.map((cfg, idx) => (
        <VictorianWorker
          key={idx}
          index={idx}
          position={cfg.pos}
          conflictRate={conflictRate}
          vestColor={cfg.vestColor}
        />
      ))}
    </group>
  );
};

// 3D Steam & Spark Particles Component
const SteamParticles: React.FC<{ conflictRate: number }> = ({ conflictRate }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const particleCount = Math.round((conflictRate / 100) * 120 + 30);

  const [positions, speeds] = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    const sp = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 1.5;
      pos[i * 3 + 1] = -1.5 + Math.random() * 3.5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.5;
      sp[i] = 0.5 + Math.random() * 1.5;
    }
    return [pos, sp];
  }, [particleCount]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const positionAttr = pointsRef.current.geometry.attributes.position;
      const count = positionAttr.count;

      for (let i = 0; i < count; i++) {
        let y = positionAttr.getY(i);
        y += delta * speeds[i] * (1 + conflictRate / 50);
        
        if (y > 2.5) {
          y = -1.5;
          positionAttr.setX(i, (Math.random() - 0.5) * 1.5);
          positionAttr.setZ(i, (Math.random() - 0.5) * 1.5);
        }
        positionAttr.setY(i, y);
      }
      positionAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
        />
      </bufferGeometry>
      <pointsMaterial
        color={conflictRate > 50 ? '#C83E2D' : '#E4D5B7'}
        size={0.12}
        transparent
        opacity={0.6}
        sizeAttenuation
      />
    </points>
  );
};

// 3D Clash Sparks System
const ClashSparks: React.FC<{ active: boolean }> = ({ active }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = 150;

  const [positions, velocities] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 1] = -1.0 + (Math.random() - 0.5) * 0.2;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 0.2;

      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const speed = 2.0 + Math.random() * 4.0;
      vel[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
      vel[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 3.0; // upwards
      vel[i * 3 + 2] = Math.cos(phi) * speed;
    }
    return [pos, vel];
  }, [active]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      const posAttr = pointsRef.current.geometry.attributes.position;
      for (let i = 0; i < count; i++) {
        if (!active) {
          posAttr.setY(i, -10); // Hide below screen
          continue;
        }

        let x = posAttr.getX(i);
        let y = posAttr.getY(i);
        let z = posAttr.getZ(i);

        x += velocities[i * 3] * delta;
        y += velocities[i * 3 + 1] * delta;
        z += velocities[i * 3 + 2] * delta;

        velocities[i * 3 + 1] -= 9.8 * delta;

        if (y < -1.6) {
          x = (Math.random() - 0.5) * 0.2;
          y = -1.0 + (Math.random() - 0.5) * 0.2;
          z = (Math.random() - 0.5) * 0.2;

          const theta = Math.random() * Math.PI * 2;
          const phi = Math.acos(Math.random() * 2 - 1);
          const speed = 2.0 + Math.random() * 4.0;
          velocities[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
          velocities[i * 3 + 1] = Math.sin(phi) * Math.sin(theta) * speed + 3.0;
          velocities[i * 3 + 2] = Math.cos(phi) * speed;
        }

        posAttr.setX(i, x);
        posAttr.setY(i, y);
        posAttr.setZ(i, z);
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#FFAA00" size={0.07} transparent opacity={0.95} sizeAttenuation />
    </points>
  );
};

// Animated Gears Group (Translates on resolve)
const GearsGroup: React.FC<{ isResolving: boolean; gearSpeed: number }> = ({ isResolving, gearSpeed }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      const targetX = isResolving ? -0.4 : -1.8;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, delta * 3.5);
    }
  });
  return (
    <group ref={ref} position={[-1.8, 0, 0]}>
      {/* 3 interlocking gears dệt */}
      <Gear
        position={[0, 0.3, 0]}
        radius={0.75}
        teeth={12}
        speedMultiplier={gearSpeed}
        rotationDirection={1}
        color="#C49B30" // Brass
      />
      <Gear
        position={[1.02, -0.32, 0]}
        radius={0.42}
        teeth={8}
        speedMultiplier={gearSpeed * (12 / 8)}
        rotationDirection={-1}
        color="#8B5B30" // Copper
      />
      <Gear
        position={[-0.75, -0.55, 0]}
        radius={0.46}
        teeth={8}
        speedMultiplier={gearSpeed * (12 / 8)}
        rotationDirection={-1}
        color="#4A4E52" // Iron
      />
    </group>
  );
};

// Animated Workers Group (Translates on resolve)
const WorkersGroup: React.FC<{ isResolving: boolean; organicComposition: number; conflictRate: number }> = ({ isResolving, organicComposition, conflictRate }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (ref.current) {
      const targetX = isResolving ? -1.0 : 0;
      ref.current.position.x = THREE.MathUtils.lerp(ref.current.position.x, targetX, delta * 3.5);
    }
  });
  return (
    <group ref={ref}>
      <WorkerCrowd
        organicComposition={organicComposition}
        conflictRate={conflictRate}
      />
    </group>
  );
};

// Root scene shaker for resolve phase impact
const SceneContainer: React.FC<{ children: React.ReactNode; isResolving: boolean }> = ({ children, isResolving }) => {
  const ref = useRef<THREE.Group>(null);
  useFrame(() => {
    if (ref.current) {
      if (isResolving) {
        ref.current.position.x = (Math.random() - 0.5) * 0.05;
        ref.current.position.y = (Math.random() - 0.5) * 0.05;
        ref.current.position.z = (Math.random() - 0.5) * 0.05;
      } else {
        ref.current.position.set(0, 0, 0);
      }
    }
  });
  return <group ref={ref}>{children}</group>;
};

export const ConflictScene: React.FC = () => {
  const { currentTurnState, phase } = useGameStore();
  const { organicComposition, conflictRate } = currentTurnState;

  const isResolving = phase === 'resolve';
  const gearSpeed = isResolving ? 8.0 : (1.0 + conflictRate / 15);

  return (
    <div
      className="absolute inset-0 w-full h-full rounded-xl border border-paper-aged/15 overflow-hidden bg-cover bg-center"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(18, 15, 13, 0.75), rgba(18, 15, 13, 0.85)), url('/assets/images/victorian_mill_bg.png')`,
        boxShadow: `inset 0 0 35px rgba(0,0,0,0.9), 0 0 15px ${isResolving ? 'rgba(200, 62, 45, 0.25)' : 'rgba(0,0,0,0)'}`,
        transition: 'box-shadow 0.5s ease',
      }}
    >
      <Canvas
        shadows
        camera={{ position: [0, 0.2, 4.4], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
      >
        <fog attach="fog" args={['#18120F', 3, 15]} />
        
        {/* Increased ambient light */}
        <ambientLight intensity={1.2} color={conflictRate > 50 ? '#C83E2D' : '#FFE8C5'} />
        
        <pointLight
          position={[0, 0.5, 1]}
          intensity={1.5 + (conflictRate / 100) * 1.5 + (isResolving ? 3.0 : 0)}
          color={conflictRate > 50 || isResolving ? '#FF4D3D' : '#FFE270'}
          distance={12}
        />
        
        {/* Dedicated warm light specifically illuminating the machinery on the Left */}
        <pointLight
          position={[-2.4, 0.8, 1.2]}
          intensity={3.5}
          color="#FFE8C5" // Soft warm golden light to make copper boiler & brass gears shine
          distance={8}
          castShadow
        />

        {/* Dedicated light specifically illuminating the workers on the Right */}
        <pointLight
          position={[2.4, 0.8, 1.2]}
          intensity={2.8}
          color="#FFE8C5" // Balanced neutral warm light for worker bodies
          distance={8}
        />

        <directionalLight
          position={[-3, 5, 2.5]}
          intensity={1.8}
          castShadow
          shadow-mapSize={[1024, 1024]}
        />

        <SceneContainer isResolving={isResolving}>
          <FactoryBackground />
          
          {/* Steam Boiler Piston Mechanism (Tư Bản) */}
          <SteamPistonMechanism isResolving={isResolving} gearSpeed={gearSpeed} />

          {/* Capitalist Side (Interlocking Industrial Gears) */}
          <GearsGroup isResolving={isResolving} gearSpeed={gearSpeed} />

          {/* Worker Side (Detailed crowd with caps and vests) */}
          <WorkersGroup
            isResolving={isResolving}
            organicComposition={organicComposition}
            conflictRate={conflictRate}
          />

          {/* Center Steam/Spark particles */}
          <SteamParticles conflictRate={conflictRate} />
          
          {/* Spark Explosion at the Center Clash Point */}
          <ClashSparks active={isResolving} />

          {/* Transparent Floor that catches shadows, overlaying the CSS background image */}
          <mesh position={[0, -1.6, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <planeGeometry args={[10, 10]} />
            <shadowMaterial opacity={0.45} />
          </mesh>
        </SceneContainer>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 3}
          maxAzimuthAngle={Math.PI / 12}
          minAzimuthAngle={-Math.PI / 12}
        />
      </Canvas>

      {/* Tiny indicators hud */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center text-[9px] font-mono text-paper-aged/50 z-20 pointer-events-none">
        <span>3D SIMULATION ENGAGED</span>
        <span>DRAG TO PAN CAMERA CHẬM</span>
      </div>
    </div>
  );
};

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import Camera from "./Camera";
import { Platform } from "./Platform";
import { Player } from "./Player";
import * as React from "react";

export const App = () => (
  <>
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} />
      <Camera />
      <Physics debug>
        <Player position={[0, 2, 0]} />
        <Platform position={[0, 0, 0]} args={[11, 1, 1]} />
        <Platform position={[-50, 5, 0]} args={[1, 10, 1]} />
        <Platform position={[-5, 25, 0]} args={[1, 50, 1]} />
        <Platform position={[5, 25, 0]} args={[1, 50, 1]} />
        {[...Array(10)].map((_, i) => (
          <Platform
            key={i}
            args={[10, 0.1, 1]}
            position={[randFloatSpread(10), i * 4 + 4, 0]}
            oneWay={true}
          />
        ))}
      </Physics>
    </Canvas>
  </>
);

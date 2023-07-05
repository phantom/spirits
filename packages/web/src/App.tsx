import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import Camera from "./Camera";
import { Platform } from "./Platform";
import { Player } from "./Player";
import { MobileControls } from "./MobileControls";

export const App = () => (
  <>
    <MobileControls />
    <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 5]} />
      <Camera />
      <Physics debug>
        <Player position={[0, 2, 0]} />
        <Platform position={[0, 0, 0]} args={[100, 1, 1]} />
        <Platform position={[0, 2, 0]} args={[5, 0.1, 1]} oneWay={true} />
        <Platform position={[-50, 5, 0]} args={[1, 10, 1]} />
        <Platform position={[-10, 5, 0]} args={[1, 10, 1]} />
        {[...Array(10)].map((_, i) => (
          <Platform
            key={i}
            args={[10, 0.1, 1]}
            position={[randFloatSpread(i * 0.5 + 15) + 10, i * 2, 0]}
            oneWay={true}
          />
        ))}
      </Physics>
    </Canvas>
  </>
);

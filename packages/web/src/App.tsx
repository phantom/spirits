import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Camera from "./Camera";
import { OrbitControls } from "@react-three/drei";
import { Platform } from "./Platform";
import { Player } from "./Player";
import * as React from "react";
import { useStore } from "./store";
import { Spike } from "./Spike";
import { useProviderProps } from "./utils/useProviderProps";
import { useControls } from "leva";
import { NoProvider } from "./NoProvider";
import getProvider from "./utils/getProvider";
import ConnectRow from "./ConnectRow";
import { RotatingPlatform } from "./RotatingPlatform";
import { Entities } from "./Entities";

// =============================================================================
// Constants
// =============================================================================

const provider = getProvider();

// =============================================================================
// Main Component
// =============================================================================

export const App = () => {
  const providerProps = useProviderProps();
  const { publicKey, connectedMethods, handleConnect } = providerProps;

  const score = useStore((store) => store.player.score);

  if (!provider) {
    return <NoProvider />;
  }

  return (
    <>
      {/* Provider Connection */}
      <ConnectRow
        publicKey={publicKey}
        connectedMethods={connectedMethods}
        connect={handleConnect}
      />

      <div>
        <h1>Score: {score}</h1>
      </div>
      <Canvas orthographic>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 5]} />
        <Camera />
        {/* <OrbitControls /> */}
        <Physics debug>
          <Player position={[0, 2, 0]} />
          <Spike position={[4, 4, 0]} />
          <Platform position={[0, 0, 0]} args={[11, 1, 1]} />
          <Platform position={[-50, 5, 0]} args={[1, 10, 1]} />
          <Platform position={[-5, 25, 0]} args={[1, 50, 1]} />
          <Platform position={[5, 25, 0]} args={[1, 50, 1]} />

          <Platform position={[0, 6, 0]} args={[10, 0.1, 1]} oneWay={true} />

          <RotatingPlatform position={[-1.5, 10, 0]} args={[6, 1, 1]} />
          <Platform position={[-1.5, 18, 0]} args={[7, 1, 1]} />
          <Platform position={[2, 14, 0]} args={[1, 9, 1]} />

          <Platform position={[0, 20, 0]} args={[3, 1, 1]} />
          <Platform position={[1.5, 21.5, 0]} args={[1, 4, 1]} />
          <Platform position={[-1.5, 21.5, 0]} args={[1, 4, 1]} />
          <Platform position={[0, 23, 0]} args={[3, 1, 1]} />

          <Platform position={[0, 26, 0]} args={[10, 0.1, 1]} oneWay={true} />

          <Platform position={[0, 30, 0]} args={[3, 1, 1]} />
          <Platform position={[1.5, 31.5, 0]} args={[1, 4, 1]} />
          <Platform position={[-1.5, 31.5, 0]} args={[1, 4, 1]} />
          <Platform position={[0, 33, 0]} args={[3, 1, 1]} />

          {/* Currently spawns coins */}
          <Entities />
        </Physics>
      </Canvas>
    </>
  );
};

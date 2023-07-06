import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import Camera from "./Camera";
import { OrbitControls } from "@react-three/drei";
import { Platform } from "./Platform";
import { Player } from "./Player";
import * as React from "react";
import { useStore } from "./store";
import { useProviderProps } from "./utils/useProviderProps";
import { NoProvider } from "./NoProvider";
import getProvider from "./utils/getProvider";
import ConnectRow from "./ConnectRow";
import { RotatingPlatform } from "./RotatingPlatform";
import { Entities } from "./Entities";
import { FloatingSpike } from "./FloatingSpike";

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

          <Platform position={[0, -0.5, 0]} args={[15, 1, 1]} />
          <Platform position={[-7, 50, 0]} args={[1, 100, 1]} />
          <Platform position={[7, 50, 0]} args={[1, 100, 1]} />
          <Platform position={[0, 8, 0]} args={[15, 0.1, 1]} oneWay={true} />

          <Platform position={[-3, 2, 0]} args={[1, 4, 1]} />

          <Platform position={[0, 20, 0]} args={[15, 0.1, 1]} oneWay={true} />
          <Platform position={[3, 12, 0]} args={[1, 8, 1]} />

          <Platform position={[0, 36, 0]} args={[15, 0.1, 1]} oneWay={true} />
          <Platform position={[-3, 28, 0]} args={[1, 8, 1]} />

          <Platform position={[0, 36, 0]} args={[15, 0.1, 1]} oneWay={true} />
          <Platform position={[3, 42, 0]} args={[1, 4, 1]} />
          <Platform position={[-3, 46, 0]} args={[1, 4, 1]} />
          <Platform position={[3, 50, 0]} args={[1, 4, 1]} />

          <Platform position={[0, 54, 0]} args={[15, 0.1, 1]} oneWay={true} />
          {/* Spawns coins and spikes */}
          <Entities />
        </Physics>
      </Canvas>
    </>
  );
};

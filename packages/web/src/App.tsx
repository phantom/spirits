import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { randFloatSpread } from "three/src/math/MathUtils.js";
import Camera from "./Camera";
import { Platform } from "./Platform";
import { Player } from "./Player";
import * as React from "react";
import { Coins } from "./Coin";
import { useStore } from "./store";
import { Spike } from "./Spike";
import { useProviderProps } from "./utils/useProviderProps";
import { NoProvider } from "./NoProvider";
import getProvider from "./utils/getProvider";
import ConnectRow from "./ConnectRow";

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

  const platforms = React.useMemo(() => {
    return [...Array(10)].map((_, i) => (
      <Platform
        key={i}
        args={[10, 0.1, 1]}
        position={[0, i * 4 + 4, 0]}
        oneWay={true}
      />
    ));
  }, []);

  const coins = React.useMemo(() => {
    return [...Array(10)].map((_, i) => (
      <Coins key={i} position={[3 + randFloatSpread(2), i * 4 + 8, 0]} />
    ));
  }, []);

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
      <Canvas camera={{ position: [0, 5, 12], fov: 50 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 5]} />
        <Camera />
        <Physics>
          <Player position={[0, 2, 0]} />
          <Platform position={[0, 0, 0]} args={[11, 1, 1]} />
          <Platform position={[-50, 5, 0]} args={[1, 10, 1]} />
          <Platform position={[-5, 25, 0]} args={[1, 50, 1]} />
          <Platform position={[5, 25, 0]} args={[1, 50, 1]} />

          <Platform position={[0, 4, 0]} args={[10, 0.1, 1]} oneWay={true} />

          <Platform position={[-1.5, 8, 0]} args={[7, 1, 1]} />
          <Platform position={[-1.5, 16, 0]} args={[7, 1, 1]} />
          <Platform position={[2, 12, 0]} args={[1, 9, 1]} />

          {coins}

          <Platform position={[0, 20, 0]} args={[3, 1, 1]} />
          <Platform position={[1.5, 21.5, 0]} args={[1, 4, 1]} />
          <Platform position={[-1.5, 21.5, 0]} args={[1, 4, 1]} />
          <Platform position={[0, 23, 0]} args={[3, 1, 1]} />

          <Platform position={[0, 26, 0]} args={[10, 0.1, 1]} oneWay={true} />

          <Platform position={[0, 30, 0]} args={[3, 1, 1]} />
          <Platform position={[1.5, 31.5, 0]} args={[1, 4, 1]} />
          <Platform position={[-1.5, 31.5, 0]} args={[1, 4, 1]} />
          <Platform position={[0, 33, 0]} args={[3, 1, 1]} />
        </Physics>
      </Canvas>
    </>
  );
};

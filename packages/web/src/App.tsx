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
import { Vector3 } from "three";
import getProvider from "./utils/getProvider";
import ConnectRow from "./ConnectRow";
import { PassThroughPlatform } from "./PassThroughPlatform";
import { Entities } from "./Entities";
import { FloatingSpike } from "./FloatingSpike";
import { useControls } from "leva";
import Editor from "./Editor";
import { useEffect, useLayoutEffect, useRef } from "react";
import { Snake } from "./Snake";
import { RotatingPlatform } from "./RotatingPlatform";

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
  const height = useStore((store) => store.player.height);
  const isLevelEditing = useStore((store) => store.game.isLevelEditing);
  const set = useStore((store) => store.set);

  const _ = useControls(
    {
      isLevelEditing: {
        value: false,
        onChange: (value: boolean) => {
          set((store) => {
            store.game.isLevelEditing = value;
          });
        },
      },
      ...(!isLevelEditing &&
        {
          // debugPhysics: false,
          // type: {
          //   value: controlsType,
          //   options: ControlsEnum,
          //   onChange: (value) => {
          //     set((store) => {
          //       store.controls.type = value;
          //     });
          //   },
          // },
        }),
    },
    [isLevelEditing]
  );

  React.useEffect(() => {
    if (!isLevelEditing) {
      set((store) => {
        store?.player.ref?.current?.setTranslation(new Vector3(0, 2, 0), false);
        store?.player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
      });
    }
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
        <h1>Max Height: {height}</h1>
      </div>

      <Canvas orthographic>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 5]} />

        <Camera />
        {isLevelEditing ? (
          <Editor />
        ) : (
          <>
            <Physics debug>
              <Player position={[0, 2, 0]} />
              <Snake
                position={[-3, 10, 0]}
                width={4}
                height={5}
                snakeLength={7}
              />

              {/* Spawns coins and spikes */}
              <Entities />

              <RotatingPlatform length={4} width={4} numBlocks={3} />
            </Physics>
          </>
        )}
      </Canvas>
    </>
  );
};

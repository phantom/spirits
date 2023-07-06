import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import * as React from "react";
import { Vector3 } from "three";
import Camera from "./Camera";
import ConnectRow from "./ConnectRow";
import Editor from "./Editor";
import { Entities } from "./Entities";
import { NoProvider } from "./NoProvider";
import { Player } from "./Player";
import { useStore } from "./store";
import getProvider from "./utils/getProvider";
import { useProviderProps } from "./utils/useProviderProps";
import { SpikedPlatform } from "./SpikedPlatform";
import { Coin } from "./Coin";
import { Snake } from "./Snake";

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
  const height = useStore((store) => store.player.maxHeight);
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

  return (
    <>
      {/* Provider Connection */}
      {provider && (
        <ConnectRow
          publicKey={publicKey}
          connectedMethods={connectedMethods}
          connect={handleConnect}
        />
      )}

      <div>
        <h1>Score: {score}</h1>
        <h1>Max Height: {height}</h1>
      </div>
      <Leva collapsed={true} />

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
              <Coin key={"123"} position={[0, 2, 0]} remove={() => {}} />
              <Snake
                position={[-3, 12, 0]}
                width={5}
                height={4}
                snakeLength={4}
                numSnakes={1}
              />{" "}
              {/* Spawns coins, spikes, platforms */}
              <Entities />
            </Physics>
          </>
        )}
      </Canvas>
    </>
  );
};

import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva, useControls } from "leva";
import React, { useState, useEffect, useRef } from "react";
import { Vector3 } from "three";
import Camera from "./Camera";
import ConnectRow from "./ConnectRow";
import Editor from "./Editor";
import { Entities } from "./Entities";
import { Player } from "./Player";
import { useStore } from "./store";
import getProvider from "./utils/getProvider";
import { useProviderProps } from "./utils/useProviderProps";
import { Coin } from "./Coin";
import { Snake } from "./Snake";
import { Background } from "./Background";
import { SpikedPlatform } from "./SpikedPlatform";
import { Enemy } from "./Enemy";
import { Trophy } from "./Trophy";
import background from "./sounds/background.mp3";

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
  const isGamePaused = useStore((store) => store.game.isPaused);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

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
    setIsPlaying(true);
  }, []);

  return (
    <>
      <div>
        {isPlaying && (
          <audio autoPlay loop>
            <source src={"/sounds/backgroundMusic.mp3"} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
      {/* Provider Connection */}
      {provider && (
        <ConnectRow
          publicKey={publicKey}
          connectedMethods={connectedMethods}
          connect={handleConnect}
        />
      )}

      <div className="absolute z-50 flex justify-between w-full p-2">
        <div className="flex gap-2">
          <div className="bg-[#232326] px-6 py-2 rounded-lg text-white font-bold">
            🪙 {score}
          </div>
          <div className="bg-[#232326] px-4 py-2 rounded-lg text-white font-bold">
            🔼 {height}
          </div>
        </div>
        <button
          className="bg-[#232326] px-4 py-2 rounded-lg text-white font-bold"
          onClick={() => {
            alert("pause");
          }}
        >
          {isGamePaused ? "Play" : "Pause"}
        </button>
      </div>

      <Canvas orthographic>
        <color attach={"background"} args={["#232326"]} />
        <React.Suspense fallback={null}>
          <Background />

          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 5]} />

          <Camera />
          {isLevelEditing ? (
            <Editor />
          ) : (
            <>
              <Physics debug>
                <Player position={[0, 2, 0]} playMusic={handlePlay} />

                {/* Spawns coins, spikes, platforms */}
                <Entities />
              </Physics>
            </>
          )}
        </React.Suspense>
      </Canvas>

      <div className="absolute bottom-0 right-0">
        <Leva collapsed={true} fill />
      </div>
    </>
  );
};

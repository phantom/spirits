import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva, button, useControls } from "leva";
import * as React from "react";
import { MathUtils } from "three";
import Camera from "./Camera";
import ConnectRow from "./ConnectRow";
import Editor from "./Editor";
import { Entities } from "./Entities";
import { Player } from "./Player";
import { useStore } from "./store";
import getProvider from "./utils/getProvider";
import { useProviderProps } from "./utils/useProviderProps";
import { Background } from "./Background";
import { levels } from "./levels";

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
  const isGamePaused = useStore((store) => store.game.isPaused);
  const isLevelFinished = useStore((store) => store.level.levelFinished);
  const [isPlaying, setIsPlaying] = React.useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  React.useEffect(() => {
    const resetHandler = (e) => {
      // if r get's pressed, reset
      if (e.key === "r") {
        resetPlayer();
      }
    };

    window.addEventListener("keydown", resetHandler);
    return () => {
      window.removeEventListener("keydown", resetHandler);
    };
  }, []);

  const set = useStore((store) => store.set);
  const resetPlayer = useStore((store) => store.player.reset);
  const loadLevel = useStore((store) => store.level.loadLevel);

  set((store) => {
    store.player.publicKey = publicKey;
  });

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
      loadLevelFromName: button(() => {
        const name = prompt("level name") ?? "";
        const level = levels[name];
        loadLevel(level);
      }),
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
      resetPlayer();
    }
  }, []);

  return (
    <>
      {isPlaying && (
        <audio autoPlay loop>
          <source src={"/sounds/backgroundMusic.mp3"} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      )}
      {/* Provider Connection */}
      {/* {provider && (
        <ConnectRow
          publicKey={publicKey}
          connectedMethods={connectedMethods}
          connect={handleConnect}
        />
      )} */}

      {isGamePaused ? (
        <div>
          <div className="absolute z-50 bg-[#232326] flex items-center justify-center h-full w-full p-2">
            <div className="p-8  rounded-lg flex flex-col gap-4 text-white">
              {!isLevelFinished ? (
                <>
                  <h1 className="text-white text-4xl font-bold">Spirit Jump</h1>
                  <span>content here</span>
                  <button
                    className="bg-[#6E56CF] px-4 py-2 rounded-lg text-white font-bold"
                    onClick={() => {
                      set((store) => {
                        store.game.isPaused = false;
                      });
                    }}
                  >
                    {score > 0 ? "Resume" : "Start"}
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <h1 className="text-white text-6xl font-bold mb-2">GG</h1>
                  <span>You Climbed</span>
                  <div className="flex gap-4 mb-4">
                    <span className="text-2xl font-bold">{height}m</span>
                    <span className="text-2xl font-bold">{score} coins</span>
                  </div>

                  <h2 className="text-white text-4xl font-bold mb-4">
                    You Earned
                  </h2>
                  <img src="/images/coin.png" className="w-20 h-20 mb-4" />
                  <button
                    className="bg-[#6E56CF] px-4 py-2  mb-2  rounded-lg text-white font-bold"
                    onClick={() => {
                      alert("claim");
                    }}
                  >
                    Claim
                  </button>
                  <button
                    className="bg-[#6E56CF] px-4 py-2 rounded-lg text-white font-bold"
                    onClick={() => {
                      resetPlayer();
                      set((store) => {
                        store.game.isPaused = false;
                        store.level.levelFinished = false;
                      });
                    }}
                  >
                    Restart
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="absolute z-50 flex justify-between w-full p-2">
            <div className="flex gap-2">
              <div className="bg-[#232326] px-6 py-2 rounded-lg text-white font-bold">
                🪙 {score}
              </div>
              <div className="bg-[#232326] px-4 py-2 rounded-lg text-white font-bold">
                🔼 {height}
              </div>
            </div>
            <div className="flex gap-2">
              <button
                className="bg-[#232326] px-4 py-2 rounded-lg text-white font-bold"
                onClick={() => {
                  resetPlayer();
                }}
              >
                🔄{""}
              </button>
              <button
                className="bg-[#232326] px-4 py-2 rounded-lg text-white font-bold"
                onClick={() => {
                  set((store) => {
                    store.game.isPaused = true;
                  });
                }}
              >
                Menu
              </button>
            </div>
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
        </>
      )}

      <div className="absolute bottom-0 right-0">
        <Leva collapsed={true} fill />
      </div>
    </>
  );
};

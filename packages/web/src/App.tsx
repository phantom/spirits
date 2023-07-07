import { Canvas, useLoader } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva, button, useControls } from "leva";
import * as React from "react";
import { MathUtils, TextureLoader } from "three";
import Camera from "./Camera";
import Editor from "./Editor";
import { Entities } from "./Entities";
import { Player } from "./Player";
import { useStore } from "./store";
import getProvider from "./utils/getProvider";
import { useProviderProps } from "./utils/useProviderProps";
import { Background } from "./Background";
import { levels } from "./levels";
import { Airdrop } from "./types";
import Confetti from "react-confetti";

// =============================================================================
// Constants
// =============================================================================

const provider = getProvider();

// =============================================================================
// Main Component
// =============================================================================

export const App = () => {
  const providerProps = useProviderProps();
  const { publicKey, handleConnect } = providerProps;

  console.log("publicKey", publicKey?.toString());

  const score = useStore((store) => store.player.score);
  const height = useStore((store) => store.player.maxHeight);
  const isLevelEditing = useStore((store) => store.game.isLevelEditing);
  const isGamePaused = useStore((store) => store.game.isPaused);
  const isLevelFinished = useStore((store) => store.level.levelFinished);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [airdrop, setAirdrop] = React.useState<Airdrop>();
  const [loadingAirdrop, setLoadingAirdrop] = React.useState(false);

  useLoader(TextureLoader, "/sprites/spritesheet.png", () => {
    // console.log("loaded");
  });

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

  const fetchAirdrop = async () => {
    setLoadingAirdrop(true);
    const res = await fetch(
      `https://fmeabzbszutxkewzxuwb.supabase.co/functions/v1/reward?pubkey=${publicKey}`
    );
    const airdrop: Airdrop = await res.json();
    setAirdrop(airdrop);
    setLoadingAirdrop(false);
  };

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
            {airdrop && (
              <Confetti
                width={window.innerWidth}
                height={window.innerHeight}
                numberOfPieces={100}
                friction={0.99}
              />
            )}
            <div className="p-8  rounded-lg flex flex-col gap-4 text-white items-center">
              {isLevelFinished ? (
                <>
                  <img
                    src="/screen/splash-screen.png"
                    className="w-40 h-40 mb-4"
                  />
                  <h1 className="text-white text-5xl font-bold">Spirit Jump</h1>
                  <span>Earn rewards by completing challenges every day</span>
                  <span>
                    Click / tap to play. Press R to restart from the last
                    checkpoint
                  </span>
                  <button
                    className="bg-[#6E56CF] px-4 py-2 rounded-full w-full text-white font-bold"
                    onClick={() => {
                      handleConnect();
                    }}
                  >
                    Connect Wallet
                  </button>
                  <button
                    className={`bg-[#6E56CF] px-4 py-2 rounded-full w-full text-white font-bold ${
                      publicKey === null ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={publicKey === null}
                    onClick={() => {
                      set((store) => {
                        store.game.isPaused = false;
                      });
                    }}
                  >
                    {score > 0 ? "Resume" : "Play"}
                  </button>
                  <br></br>
                  {publicKey ? (
                    <span>
                      Connected to{" "}
                      {`${publicKey?.toString().substring(0, 10)}...`}
                    </span>
                  ) : (
                    <span>Not connected</span>
                  )}
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
                  {airdrop ? (
                    <img src={airdrop.image} className="w-40 h-40 mb-4" />
                  ) : loadingAirdrop ? (
                    <div className="w-40 h-40 mb-4 relative rounded-lg overflow-hidden animate-spin">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white opacity-0 animate-pulse"></div>
                    </div>
                  ) : (
                    <div className="w-40 h-40 mb-4 relative rounded-lg overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white opacity-0 animate-pulse"></div>
                    </div>
                  )}
                  {!airdrop ? (
                    <button
                      className="bg-[#6E56CF] px-4 py-2 w-full mb-2  rounded-lg text-white font-bold"
                      onClick={() => {
                        fetchAirdrop();
                      }}
                    >
                      Claim
                    </button>
                  ) : (
                    <button
                      className="bg-[#6E56CF] px-4 py-2 w-full mb-2  rounded-lg text-white font-bold"
                      onClick={() => {}}
                    >
                      Play Again
                    </button>
                  )}
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
              ) : isGamePaused ? null : (
                <>
                  <Physics>
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

import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Group, MathUtils, Vector3 } from "three";
import { useStore } from "./store";
import { Coin } from "./Coin";
import React from "react";
import { button, useControls } from "leva";
import { FloatingSpike } from "./FloatingSpike";
import { SpikedPlatform } from "./SpikedPlatform";
import { Platform, PlatformSprite } from "./Platform";
import { Snake } from "./Snake";
import { Enemy } from "./Enemy";
import { Checkpoint } from "./Checkpoint";
import { Trophy } from "./Trophy";
import { Tip } from "./Tip";
import { Decor } from "./Decor";

const coinsCount = 25;
const spikesCount = 4;

export const Entities = () => {
  const set = useStore((store) => store.set);
  const blueprints = useStore((store) => store.level.entities);

  const entities = useRef(new Map());
  const entitiesRef = useRef<Group | null>(null);

  const [, setNumber] = useState<string | number>(0);
  const refresh = () => {
    setNumber(Math.random());
  };

  const spawnCoins = useCallback(() => {
    [...Array(coinsCount)].map(() => {
      const uuid = MathUtils.generateUUID();
      entities.current.set(
        uuid,
        <Coin
          position={
            new Vector3(MathUtils.randFloatSpread(5), Math.random() * 50, 0)
          }
          rotation={new Euler().fromArray([Math.PI / 2, 0, 0])}
          key={uuid}
          remove={() => {
            entities.current.delete(uuid);
          }}
        />
      );
    });
    refresh();
  }, []);

  const spawnSpikes = useCallback(() => {
    [...Array(spikesCount)].map(() => {
      const uuid = MathUtils.generateUUID();
      entities.current.set(
        uuid,
        <FloatingSpike
          position={
            new Vector3(
              MathUtils.randFloatSpread(5),
              Math.random() * 44 + 12,
              0
            )
          }
          key={uuid}
        />
      );
    });
    refresh();
  }, []);

  // Controls for testing
  // useControls({ spawnCoins: button(spawnCoins) });
  // useControls({ spawnSpikes: button(spawnSpikes) });

  // useEffect(() => {
  //   if (entities.current.size === 0) {
  //     spawnCoins();
  //     spawnSpikes();
  //   }
  // }, [set, spawnCoins, spawnSpikes]);

  useEffect(() => {
    blueprints.forEach((blueprint) => {
      const uuid = MathUtils.generateUUID();

      switch (blueprint.type) {
        case "coin":
          entities.current.set(
            uuid,
            <Coin
              position={blueprint.position}
              rotation={blueprint.rotation}
              key={uuid}
              remove={() => {
                entities.current.delete(uuid);
              }}
            />
          );
          break;
        case "snake":
          entities.current.set(
            uuid,
            <Snake
              position={blueprint.position}
              rotation={blueprint.rotation}
              key={uuid}
              width={blueprint.scale[0]}
              height={blueprint.scale[1]}
              snakeLength={blueprint.snakeLength ?? 5}
              numSnakes={blueprint.numSnakes ?? 1}
            />
          );
          break;
        case "enemy":
          entities.current.set(
            uuid,
            <Enemy key={uuid} position={blueprint.position} />
          );
          break;
        case "checkpoint":
          entities.current.set(
            uuid,
            <Checkpoint key={uuid} position={blueprint.position} />
          );
          break;
        case "square-platform":
        case "vertical-platform":
        case "vertical-platform-small":
        case "platform-section":
        case "platform-small":
        case "platform":
          entities.current.set(
            uuid,
            <Platform
              key={uuid}
              oneWay={(blueprint as any)?.oneWay}
              position={blueprint.position}
              args={blueprint.scale}
              sprite={blueprint.type}
            />
          );
          break;
        case "spiked-platform":
          entities.current.set(
            uuid,
            <SpikedPlatform
              key={uuid}
              position={new Vector3(...blueprint.position)}
              orientation={(blueprint as any)?.orientation}
            />
          );
          break;
        case "trophy":
          entities.current.set(
            uuid,
            <Trophy
              key={uuid}
              position={new Vector3(...blueprint.position)}
              scale={blueprint.scale}
            />
          );
          break;
        case "tip":
          entities.current.set(
            uuid,
            <Tip
              key={uuid}
              position={new Vector3(...blueprint.position)}
              scale={blueprint.scale}
            />
          );
          break;
        case "decor":
          entities.current.set(
            uuid,
            <Decor
              key={uuid}
              position={new Vector3(...blueprint.position)}
              scale={blueprint.scale}
            />
          );
      }
    });
    refresh();
  }, [blueprints]);

  return (
    <group ref={entitiesRef}>{Array.from(entities.current.values())}</group>
  );
};

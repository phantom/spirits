import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Group, MathUtils, Vector3 } from "three";
import { useStore } from "./store";
import { Coin } from "./Coin";
import React from "react";
import { button, useControls } from "leva";
import { Spike } from "./Spike";

const coinsCount = 25;
const spikesCount = 10;

export const Entities = () => {
  const set = useStore((store) => store.set);

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
        <Spike
          position={
            new Vector3(MathUtils.randFloatSpread(5), Math.random() * 50, 0)
          }
          rotation={new Euler().fromArray([Math.PI / 2, 0, 0])}
          key={uuid}
        />
      );
    });
    refresh();
  }, []);

  // Controls for testing
  useControls({ spawnCoins: button(spawnCoins) });
  useControls({ spawnSpikes: button(spawnSpikes) });

  useEffect(() => {
    if (entities.current.size === 0) {
      spawnCoins();
      spawnSpikes();
      set((store: any) => {
        store.level.entities = entitiesRef;
      });
    }
  }, [set, spawnCoins, spawnSpikes]);

  return (
    <group ref={entitiesRef}>{Array.from(entities.current.values())}</group>
  );
};
import { useCallback, useEffect, useRef, useState } from "react";
import { Euler, Group, MathUtils, Vector3 } from "three";
import { useStore } from "./store";
import { Coin } from "./Coin";
import React from "react";
import { button, useControls } from "leva";

const coinsCount = 25;

export const Entities = () => {
  const set = useStore((store) => store.set);

  const entities = useRef(new Map());
  const entitiesRef = useRef<Group | null>(null);

  const [, setNumber] = useState<string | number>(0);
  const refresh = () => {
    setNumber(Math.random());
  };

  console.log("Entities", entities);

  const spawnCoins = useCallback(() => {
    console.log("Spawning");

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

  useControls({ spawnCoins: button(spawnCoins) });

  useEffect(() => {
    if (entities.current.size === 0) {
      spawnCoins();
      set((store: any) => {
        store.level.entities = entitiesRef;
      });
    }
  }, [set, spawnCoins]);

  return (
    <group ref={entitiesRef}>{Array.from(entities.current.values())}</group>
  );
};

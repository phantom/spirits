import { RapierRigidBody } from "@react-three/rapier";
import { PublicKey } from "@solana/web3.js";
import CameraControls from "camera-controls";
import { enableMapSet, setAutoFreeze } from "immer";
import { createRef, MutableRefObject, RefObject } from "react";
import { Mesh, Vector2, Vector3, MathUtils, Quaternion } from "three";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import {
  checkpointsTestLevel,
  endLevel,
  firstLevel,
  levels,
  testRoom,
  tutorialLevel,
} from "./levels";

setAutoFreeze(false);
enableMapSet();

export type ActionType = "up" | "down" | "left" | "right" | "jump";

export type PlayerState =
  | "idle"
  | "moving"
  | "attacking"
  | "jumping"
  | "falling"
  | "dead"
  | "victory"
  | "sliding";

export type EntityType =
  | "platform"
  | "checkpoint"
  | "spiked-platform"
  | "coin"
  | "spike"
  | "snake"
  | "enemy"
  | "trophy"
  | "vertical-platform"
  | "vertical-platform-small"
  | "platform-section"
  | "tip"
  | "square-platform";

export type Entity = {
  type: EntityType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  color?: string;
  id: string;

  // platform specific
  oneWay?: boolean;
  orientation?: string;
};

export type Level = {
  entities: Map<string, Entity>;
  floor: MutableRefObject<Mesh | null> | null;
  checkpoint: Vector3;
  levelFinished: boolean;
  loadLevel: (entities: any[]) => void;
};

export type Actions = {
  [key in ActionType]: {
    value: number;
    startedAt: number | null;
    force?: number;
    pressure?: number;
  };
};

export type Store = {
  player: {
    state: PlayerState;
    ref: RefObject<RapierRigidBody> | null;
    score: number;
    maxHeight: number;
    scoredCoinsRef: RefObject<Set<string>> | null;
    publicKey: PublicKey | null;
    reset: () => void;
  };
  level: Level;
  camera: {
    controls: RefObject<CameraControls> | null;
    movement: MutableRefObject<Vector2>;
  };
  controls: {
    direction: MutableRefObject<Vector3>;
  };
  game: {
    isPaused: boolean;
    isPlaying: boolean;
    isLevelEditing: boolean;
  };
  set: (fn: (state: Store) => void | Store) => void;
};

export const useStore = create(
  immer<Store>((set, get) => ({
    player: {
      state: "moving",
      ref: null,
      score: 0,
      maxHeight: 0,
      scoredCoinsRef: createRef<Set<string>>() as MutableRefObject<Set<string>>,
      publicKey: null,
      reset: () => {
        const checkpoint = get().level.checkpoint.clone();

        get().player.ref?.current?.setTranslation(
          checkpoint.equals(new Vector3())
            ? new Vector3()
            : checkpoint.add(new Vector3(0, -1.5, 0)),
          false
        );
        get().player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
        get().player.ref?.current?.setAngvel(new Vector3(0, 0, 0), false);
        get().player.ref?.current?.setRotation(new Quaternion(), false);

        get().player.state = "moving";
      },
    },
    level: {
      entities: new Map(),
      floor: null,
      checkpoint: new Vector3(0, 0, 0),
      levelFinished: false,
      loadLevel: (entities: any) => {
        // set((store) => {
        get().level.entities = new Map([
          ...entities.map((entity, index) => {
            const uuid = MathUtils.generateUUID();
            return [
              uuid,
              {
                ...entity,
                id: uuid,
              },
            ];
          }),
        ]);

        get().player.reset();
      },
    },
    game: {
      isLoaded: false,
      isPaused: true,
      isPlaying: true,
      isLevelEditing: false,
    },
    camera: {
      controls: null,
      movement: createRef<Vector2>() as MutableRefObject<Vector2>,
    },
    controls: {
      direction: createRef<Vector3>() as MutableRefObject<Vector3>,
      actions: createRef<Actions>(),
    },
    set: (fn: (state: Store) => void | Store) => {
      set(fn as any);
    },
  }))
);

useStore.setState((store) => {
  store.camera.movement.current = new Vector2();

  let height = 0;

  const entities = [
    tutorialLevel,
    // testRoom, // custom room starting with checkpoint
    // testRoom, // custom room starting with checkpoint
    // testRoom, // custom room starting with checkpoint
    // testRoom, // custom room starting with checkpoint
    // testRoom, // custom room starting with checkpoint
    endLevel,
  ].reduce((agg, init) => {
    const newEntities = init.map((e) => {
      return {
        ...e,
        position: [e.position[0], e.position[1] + height, e.position[2]],
      };
    });
    const additionalHeight = init.sort(
      (a, b) => b.position[1] - a.position[1]
    )[0].position[1];
    height += additionalHeight;

    return [...agg, ...(newEntities as any)];
  }, []) as unknown as any[];

  // side, top and bottom platforms get automatically added
  entities.push(
    {
      position: [-8, height / 2 - 1, 0],
      scale: [1, height, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [8, height / 2 - 1, 0],
      scale: [1, height, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [0, -1, 0],
      scale: [17, 1, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [-8, height + 3, 0],
      scale: [1, 8, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [8, height + 3, 0],
      scale: [1, 8, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [0, height + 7, 0],
      scale: [17, 1, 1],
      type: "platform",
      rotation: [0, 0, 0],
    }
  );

  store.level.loadLevel(entities as any);
});

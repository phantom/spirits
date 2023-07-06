// import { RigidBodyApi } from "@react-three/rapier";
import { RapierRigidBody } from "@react-three/rapier";
import CameraControls from "camera-controls";
import { setAutoFreeze } from "immer";
import { createRef, MutableRefObject, RefObject } from "react";
import { Mesh, Vector2, Vector3, MathUtils } from "three";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

setAutoFreeze(false);

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

export type EntityType = "platform" | "coin" | "spike";

export type Entity = {
  type: EntityType;
  position: [number, number, number];
  rotation?: [number, number, number];
  scale: [number, number, number];
  color?: string;
  id: string;

  // platform specific
  oneWay?: boolean;
};

export type Level = {
  entities: Map<string, Entity>;
  floor: MutableRefObject<Mesh | null> | null;
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
  immer<Store>((set) => ({
    player: {
      state: "moving",
      ref: null,
      score: 0,
      maxHeight: 0,
      scoredCoinsRef: createRef<Set<string>>() as MutableRefObject<Set<string>>,
    },
    level: {
      entities: new Map(),
      floor: null,
    },
    game: {
      isPaused: false,
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
  store.controls.direction.current = new Vector3(0, 0, 1);

  const level: any = [
    { position: [0, -0.5, 0], scale: [17, 1, 1], type: "platform" },
    { position: [-8, 50, 0], scale: [1, 100, 1], type: "platform" },
    { position: [8, 50, 0], scale: [1, 100, 1], type: "platform" },
    {
      position: [0, 8, 0],
      scale: [15, 0.1, 1],
      type: "platform",
      oneWay: true,
    },
    { position: [-3, 2, 0], scale: [1, 4, 1], type: "platform" },
    {
      position: [0, 20, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
    { position: [3, 12, 0], scale: [1, 8, 1], type: "platform" },
    {
      position: [0, 36, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
    { position: [-3, 28, 0], scale: [1, 8, 1], type: "platform" },
    {
      position: [0, 36, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
    { position: [3, 42, 0], scale: [1, 4, 1], type: "platform" },
    { position: [-3, 46, 0], scale: [1, 4, 1], type: "platform" },
    { position: [3, 50, 0], scale: [1, 4, 1], type: "platform" },
    {
      position: [0, 54, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
  ];

  store.level.entities = new Map([
    ...level.map((entity, index) => {
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
});

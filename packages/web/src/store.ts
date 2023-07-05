// import { RigidBodyApi } from "@react-three/rapier";
import { RapierRigidBody } from "@react-three/rapier";
import CameraControls from "camera-controls";
import { setAutoFreeze } from "immer";
import { createRef, MutableRefObject, RefObject } from "react";
import { Mesh, Vector2, Vector3 } from "three";
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

export type EntityType = "coin";

export type Entity = {
  type: EntityType;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: [number, number, number];
  color: string;
  id: string;
};

export type Level = {
  entities: Entity[];
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
    },
    level: {
      entities: [],
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
  store.controls.actions.current = {
    down: {
      value: 0,
      startedAt: 0,
    },
    up: {
      value: 0,
      startedAt: 0,
    },
    left: {
      value: 0,
      startedAt: 0,
    },
    right: {
      value: 0,
      startedAt: 0,
    },
    jump: {
      value: 0,
      startedAt: 0,
    },
  };
});

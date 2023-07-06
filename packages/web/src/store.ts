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

export type EntityType =
  | "platform"
  | "spiked-platform"
  | "coin"
  | "spike"
  | "snake"
  | "vertical-platform"
  | "vertical-platform-small"
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
    {
      position: [-8, -30, 0],
      scale: [1, 200, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [8, -30, 0],
      scale: [1, 200, 1],
      type: "platform",
      rotation: [0, 0, 0],
    },
    {
      position: [0, 5.322533964847794, 0],
      scale: [15, 0.1, 1],
      type: "platform",
      oneWay: true,
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      position: [0, 20, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
    {
      position: [0, 36, 0],
      scale: [15, 0.1, 1],
      oneWay: true,
      type: "platform",
    },
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
    {
      type: "platform",
      position: [0, -6.412917749024082, 7.57424949949359e-17],
      rotation: [0, 0, 0, "XYZ"],
      scale: [10, 1, 1],
    },
    {
      type: "vertical-platform-small",
      position: [-4.499381742499162, -5.844193797614366, 0],
      rotation: [0, 0, 0, "XYZ"],
      scale: [1, 2, 1],
    },
    {
      type: "vertical-platform-small",
      position: [4.5, -5.7225584853847895, 0],
      scale: [1, 2, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "snake",
      position: [-3.891601556343022, 8.893988830074525, 0],
      rotation: [0, 0, 0, "XYZ"],
      scale: [4, 3, 1],
    },
    {
      type: "snake",
      position: [4.119998203503693, 8.893988830074525, 0],
      scale: [4, 3, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [-0.02221057895379186, 6.497300460656101, 0],
      rotation: [0, 0, 0, "XYZ"],
      scale: [1, 1, 1],
    },
    {
      type: "coin",
      position: [4.559074388601773, 13.685183026470849, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [4.559074388601773, 17.74111719010204, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [-0.02221057895379186, 10.353211028853721, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [-0.08390797218855028, 21.849417803831358, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [-2.0659296234159097, 29.710784076978296, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "coin",
      position: [1.8419104059598934, 26.14319634068337, 0],
      scale: [1, 1, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "vertical-platform",
      position: [-3.452178695683413, 27.65106647242851, 0],
      rotation: [0, 0, 0, "XYZ"],
      scale: [1, 6, 1],
    },
    {
      type: "vertical-platform",
      position: [3.0779681057399877, 27.65106647242851, 0],
      scale: [1, 6, 1],
      rotation: [0, 0, 0, "XYZ"],
    },
    {
      type: "square-platform",
      position: [-0.06645426104332186, 15.276031419509122, 0],
      rotation: [0, 0, 0, "XYZ"],
      scale: [4, 4, 1],
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

import { useFrame } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  useRapier,
} from "@react-three/rapier";
import { useStore } from "./store";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";

export const Platform = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  args = [10, 1, 1],
  oneWay = false,
  ...props
}: RigidBodyProps & { oneWay?: boolean }) => {
  const ref = useRef<RapierRigidBody>(null);
  const playerRef = useStore((store) => store.player.ref);
  const movementRef = useStore((store) => store.controls.actions);

  useFrame(() => {
    const { down } = movementRef.current!;
    if (!down.value) return;

    // if player clicks down, we want the platofrm to go back to sensor. (if it's a oneway only)
    if (oneWay) {
      const collider = ref.current?.collider(ref.current.handle);
      collider?.setSensor(true);
    }
  });

  return (
    <RigidBody
      type="fixed"
      position={position}
      rotation={rotation}
      name="platform"
      ref={ref}
      sensor={oneWay ? true : false}
      onIntersectionEnter={({ other }) => {
        const { down } = movementRef.current!;
        if (!down.value && other.rigidBodyObject?.name === "player") {
          const collider = ref.current?.collider(ref.current.handle);

          if (
            oneWay &&
            (playerRef?.current?.translation().y ?? 0) >=
              (ref.current?.translation().y ?? 0) +
                (collider?.halfHeight() ?? 0) / 2 +
                other.collider.halfHeight()
          ) {
            collider?.setSensor(false);
          }
        }
      }}
      // if the player is above the platform when it's a sensor, we want to make it not a sensor
      onIntersectionExit={({ other }) => {
        if (other.rigidBodyObject?.name === "player") {
          const collider = ref.current?.collider(ref.current.handle);
          if (
            oneWay &&
            (playerRef?.current?.translation().y ?? 0) >
              (ref.current?.translation().y ?? 0) +
                (collider?.halfHeight() ?? 0)
          ) {
            collider?.setSensor(false);
          }
        }
      }}
      // if the player is jumping from below, we want to make it a sensor
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "player") {
          const collider = ref.current?.collider(ref.current.handle);
          if (
            oneWay &&
            (playerRef?.current?.translation().y ?? 0) <
              // idk if we need the halfhight here
              (ref.current?.translation().y ?? 0) +
                (collider?.halfHeight() ?? 0)
          ) {
            collider?.setSensor(true);
          }
        }
      }}
      {...props}
    >
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial color="lightblue" />
      </mesh>
    </RigidBody>
  );
};

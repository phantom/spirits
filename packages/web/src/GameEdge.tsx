import { useFrame, useLoader } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useRef } from "react";
import { useStore } from "./store";
import { TextureLoader } from "three";

export enum PlatformSprite {
  LargeHorizontal,
  SmallHorizontal,
  Square,
}

export const PlatformSpriteMap = {
  [PlatformSprite.LargeHorizontal]: "/sprites/platform-variants/large.png",
  [PlatformSprite.SmallHorizontal]: "/sprites/platform-variants/small.png",
  [PlatformSprite.Square]: "/sprites/platform-variants/square.png",
};

export const Platform = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  args = [10, 1, 1],
  oneWay = false,
  ...props
}: RigidBodyProps & {
  oneWay?: boolean;
  color?: THREE.Color;
  sprite?: PlatformSprite;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const playerRef = useStore((store) => store.player.ref);

  // useFrame(() => {

  //   // if player clicks down, we want the platofrm to go back to sensor. (if it's a oneway only)
  //   if (oneWay) {
  //     const collider = ref.current?.collider(ref.current.handle);
  //     collider?.setSensor(true);
  //   }
  // });

  const platformTexture = useLoader(
    TextureLoader,
    props.sprite
      ? PlatformSpriteMap[props.sprite] ??
          "/sprites/platform-variants/large.png"
      : "/sprites/platform-variants/large.png"
  );

  return (
    <RigidBody
      type="fixed"
      colliders="cuboid"
      position={position}
      rotation={rotation}
      name="platform"
      ref={ref}
      sensor={oneWay ? true : false}
      onIntersectionEnter={({ other }) => {
        if (other.rigidBodyObject?.name === "player") {
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
        <meshBasicMaterial
          map={platformTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
};

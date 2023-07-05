import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  quat,
  vec3,
} from "@react-three/rapier";
import { useControls } from "leva";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Vector3, Vector3Tuple } from "three";
import { ActionType, useStore } from "./store";

const keys: { [key: string]: ActionType } = {
  KeyS: "down",
  KeyA: "left",
  KeyD: "right",
  Space: "jump",
};

export const Player = ({
  position = [0, 0, 0],
}: {
  position: Vector3Tuple;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();

  const set = useStore((store) => store.set);
  const playerState = useStore((store) => store.player.state);
  const directionRef = useRef(new Vector3(1, 0, 0));

  const touchingFloor = useRef(false);
  const canJump = useRef(false);
  const lastJumpedAt = useRef(0);
  const didJumpRelease = useRef(true);
  const jumpPosition = useRef<Vector3>();
  const horizontalMovementAfterJump = useRef(0);

  const { camera } = useThree();
  const [flipX, setFlipX] = useState(false);

  const collisionMap = useRef<
    Map<string, { normal: Vector3Object; collider: RapierCollider }>
  >(new Map());

  const { speed, jumpHeight } = useControls({
    speed: 1,
    jumpHeight: 25,
  });

  useFrame(() => {
    const { current: player } = ref;
    if (!player) return;

    const linvel = directionRef.current;
    linvel.normalize();
    linvel.multiplyScalar(speed);

    player.setLinvel(linvel, true);
  });

  useEffect(() => {
    set((store) => {
      store.player.ref = ref;
    });
  }, []);

  return (
    <>
      <RigidBody
        ref={ref}
        name="player"
        position={position}
        enabledTranslations={[true, true, false]}
        lockRotations={true}
        ccd={true}
        onCollisionEnter={({ other, manifold }) => {
          if (
            other?.rigidBodyObject?.name === "platform" &&
            !collisionMap.current.has(other.collider.handle.toString())
          ) {
            touchingFloor.current = true;

            collisionMap.current.set(other.collider.handle.toString(), {
              normal: manifold.normal(),
              collider: other.collider,
            });

            if (Math.abs(manifold.normal().x) > 0.9) {
              console.log(manifold.normal());
              directionRef.current = directionRef.current.multiply(
                new Vector3(-1, 1, 1)
              );
            }
          }
        }}
        onCollisionExit={({ other }) => {
          if (other?.rigidBodyObject?.name === "platform") {
            touchingFloor.current = false;
            collisionMap.current.delete(other.collider.handle.toString());
          }
        }}
      >
        <CapsuleCollider args={[0.5, 0.5]} mass={1} />
        <mesh>
          <boxGeometry args={[1, 2, 1]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};

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
  const pointerDown = useRef(false);
  const lastJumpedAt = useRef(0);

  const touchingFloor = useRef(false);
  const canJump = useRef(false);
  const didJumpRelease = useRef(true);
  const jumpPosition = useRef<Vector3>();
  const horizontalMovementAfterJump = useRef(0);

  const { camera } = useThree();
  const [flipX, setFlipX] = useState(false);

  const collisionMap = useRef<
    Map<string, { normal: Vector3Object; collider: RapierCollider }>
  >(new Map());

  const { speed, jumpHeight } = useControls({
    speed: 5,
    jumpHeight: 25,
  });

  const { gl } = useThree();

  useEffect(() => {
    const pointerDownHandler = () => {
      pointerDown.current = true;
    };

    const pointerUpHandler = () => {
      pointerDown.current = false;
    };

    gl.domElement.addEventListener("pointerdown", pointerDownHandler);
    gl.domElement.addEventListener("pointerup", pointerUpHandler);
    return () => {
      gl.domElement.removeEventListener("pointerdown", pointerDownHandler);
      gl.domElement.removeEventListener("pointerup", pointerUpHandler);
    };
  });

  useFrame(() => {
    const { current: player } = ref;
    if (!player) return;

    const collisions = Array.from(collisionMap.current.values());
    const normal = collisions.reduce((acc, { normal: curr }) => {
      acc.x += curr.x;
      acc.y += curr.y;
      acc.z += curr.z;
      return acc;
    }, new Vector3(0, 0, 0)) as Vector3;

    normal.normalize();

    normal.y = -normal.y;

    const angle = normal.length() === 0 ? 0 : Math.atan2(normal.x, normal.y);

    const isPlatformJumpable = Math.abs(angle) <= (Math.PI / 3) * 2;

    const linvel = vec3(player.linvel());
    linvel.x = directionRef.current.x * speed;

    player.setLinvel(linvel, true);

    if (collisions.length > 0 && lastJumpedAt.current + 100 < Date.now()) {
      let state = playerState;
      const touchingFloor = collisions.some(
        ({ normal }) => Math.abs(normal.y) === 1
      );

      if (touchingFloor) {
        state = "moving";
      }

      const touchingWall = collisions.some(
        ({ normal }) => Math.abs(normal.x) === 1
      );

      if (touchingWall) {
        if (touchingFloor) {
          state = "moving";
        } else {
          state = "sliding";
        }
      }

      set((store) => {
        store.player.state = state;
      });
    }

    if (
      pointerDown.current &&
      collisions.length > 0 &&
      lastJumpedAt.current + 100 < Date.now()
    ) {
      const rotation = quat().setFromAxisAngle(
        new Vector3(0, 0, 1),
        angle * 0.3
      );

      const jumpVector = new Vector3(0, jumpHeight, 0).applyQuaternion(
        rotation
      );

      player.applyImpulse(jumpVector, true);

      console.log(jumpVector);

      // jump to other direction if angle is Math.PI / 2
      if (playerState === "sliding") {
        directionRef.current = directionRef.current.multiply(
          new Vector3(-1, 1, 1)
        );
      }

      set((store) => {
        store.player.state = "jumping";
      });
      lastJumpedAt.current = Date.now();
    }
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
            collisionMap.current.set(other.collider.handle.toString(), {
              normal: manifold.normal(),
              collider: other.collider,
            });

            const collisions = Array.from(collisionMap.current.values());

            const touchingFloor = collisions.some(
              ({ normal }) => Math.abs(normal.y) === 1
            );
            const touchingWall = collisions.some(
              ({ normal }) => Math.abs(normal.x) === 1
            );

            // flip the player if they're moving into the wall
            if (touchingWall && touchingFloor) {
              directionRef.current = directionRef.current.multiply(
                new Vector3(-1, 1, 1)
              );
            }
          }
        }}
        onCollisionExit={({ other }) => {
          if (other?.rigidBodyObject?.name === "platform") {
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

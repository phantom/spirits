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
import { lerp } from "three/src/math/MathUtils";

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
  const startedSlidingAt = useRef<number>();
  const didJumpRelease = useRef(true);
  const jumpsLeft = useRef(0);

  const touchingFloor = useRef(false);
  const canJump = useRef(false);
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

  useEffect(() => {
    if (playerState === "sliding") {
      startedSlidingAt.current = Date.now();
    } else {
      startedSlidingAt.current = undefined;
    }
  }, [playerState]);

  useFrame(() => {
    const { current: player } = ref;
    if (!player) return;

    let state = playerState;

    const collisions = Array.from(collisionMap.current.values());
    const linvel = vec3(player.linvel());

    // walk in the direction we're going
    linvel.x = directionRef.current.x * speed;

    const impulse = vec3();

    if (!didJumpRelease.current && !pointerDown.current) {
      didJumpRelease.current = true;
    }

    const touchingWall = collisions.some(
      ({ normal }) => Math.abs(normal.x) === 1
    );

    if (collisions.length > 0 && lastJumpedAt.current + 100 < Date.now()) {
      jumpsLeft.current = 2;

      const touchingFloor = collisions.some(
        ({ normal }) => Math.abs(normal.y) === 1
      );

      if (touchingFloor) {
        state = "moving";
      }

      if (touchingWall && !touchingFloor) {
        state = "sliding";
      }
    }

    player.setLinvel(linvel, true);

    if (
      jumpsLeft.current > 0 &&
      pointerDown.current &&
      didJumpRelease.current &&
      collisions.length > 0 &&
      lastJumpedAt.current + 100 < Date.now()
    ) {
      didJumpRelease.current = false;
      linvel.y = 0;
      impulse.y = jumpHeight;

      if (touchingWall) {
        directionRef.current = directionRef.current.multiply(
          new Vector3(-1, 1, 1)
        );
      }

      jumpsLeft.current -= 1;
      state = "jumping";
      lastJumpedAt.current = Date.now();
    }

    if (
      state === "jumping" &&
      jumpsLeft.current > 0 &&
      pointerDown.current &&
      didJumpRelease.current &&
      lastJumpedAt.current + 300 < Date.now()
    ) {
      didJumpRelease.current = false;
      linvel.y = 0;
      impulse.y = jumpHeight;
      jumpsLeft.current -= 1;
      lastJumpedAt.current = Date.now();
    }

    if (state === "sliding" || playerState === "sliding") {
      const diff = Date.now() - (startedSlidingAt.current ?? 0);
      const timeToMaxSlide = 1000;
      linvel.multiply(new Vector3(0, 1, 0));
      linvel.y = lerp(0, -speed, Math.min(diff / timeToMaxSlide, 0.9));
    }

    player.setLinvel(linvel, true);
    player.applyImpulse(impulse, true);

    set((store) => {
      store.player.state = state;
    });
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
        <CapsuleCollider args={[0.25, 0.5]} mass={2} />
        <mesh>
          <boxGeometry args={[1, 1.5, 1]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};

import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  vec3,
} from "@react-three/rapier";
import { useControls } from "leva";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Mesh, Vector3, Vector3Tuple } from "three";
import { lerp } from "three/src/math/MathUtils";
import { useStore } from "./store";

const width = 0.5;
const height = 4 / 6;

export const Player = ({
  position = [0, 0, 0],
}: {
  position: Vector3Tuple;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();

  const set = useStore((store) => store.set);
  const playerState = useStore((store) => store.player.state);
  const playerHeight = useStore((store) => store.player.maxHeight);
  const directionRef = useRef(new Vector3(1, 0, 0));
  const pointerDown = useRef(false);
  const lastJumpedAt = useRef(0);
  const startedSlidingAt = useRef<number>();
  const didJumpRelease = useRef(true);
  const jumpsLeft = useRef(0);
  const directionPointerRef = useRef<Mesh>(null);

  const touchingFloors = useRef(0);
  const touchingLefts = useRef(0);
  const touchingRights = useRef(0);

  const canJump = useRef(false);
  const jumpPosition = useRef<Vector3>();
  const horizontalMovementAfterJump = useRef(0);

  const { camera } = useThree();
  const [flipX, setFlipX] = useState(false);

  const collisionMap = useRef<
    Map<string, { normal: Vector3Object; collider: RapierCollider }>
  >(new Map());

  const { speed, jumpHeight, jumpDamping, fallDamping } = useControls({
    speed: 5,
    jumpHeight: {
      value: 50,
      min: 10,
      max: 500,
    },
    jumpDamping: {
      value: 0.96,
      min: 0,
      max: 1,
    },
    fallDamping: {
      value: 1.04,
      min: 0,
      max: 5,
    },
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

  const changeDirection = React.useCallback((dir?: Vector3) => {
    directionRef.current =
      dir ?? directionRef.current.multiply(new Vector3(-1, 1, 1));
    directionPointerRef
      .current!.position.copy(directionRef.current)
      .multiplyScalar(0.5);
  }, []);

  useEffect(() => {
    if (playerState === "sliding") {
      startedSlidingAt.current = Date.now();
    } else {
      startedSlidingAt.current = undefined;
    }
  }, [playerState]);

  useFrame((_, delta) => {
    const refreshCorrection = delta / (1 / 144);
    const { current: player } = ref;
    if (!player) return;

    let state = playerState;

    const touchingWall = touchingLefts.current || touchingRights.current;
    const linvel = vec3(player.linvel());

    linvel.x = directionRef.current.x * speed * refreshCorrection;

    const impulse = vec3();

    if (!didJumpRelease.current && !pointerDown.current) {
      didJumpRelease.current = true;
    }

    // check we do to not get stuck to the same wall you junmped from
    if (lastJumpedAt.current + 100 < Date.now()) {
      if (touchingFloors.current) {
        state = "moving";
        jumpsLeft.current = 2;
      }

      if (touchingWall && !touchingFloors.current) {
        state = "sliding";
        jumpsLeft.current = 2;
      }
    }

    if (
      playerState !== "jumping" &&
      jumpsLeft.current > 0 &&
      pointerDown.current &&
      didJumpRelease.current &&
      (touchingWall || touchingFloors.current) &&
      lastJumpedAt.current + 200 < Date.now()
    ) {
      didJumpRelease.current = false;
      linvel.y = 0;
      impulse.y = jumpHeight;

      jumpsLeft.current -= 1;
      state = "jumping";
      lastJumpedAt.current = Date.now();
    }

    if (
      playerState === "jumping" &&
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

    if (playerState === "sliding") {
      const diff = Date.now() - (startedSlidingAt.current ?? 0);
      linvel.multiply(new Vector3(0, 1, 0));
      linvel.y = lerp(
        player.linvel().y,
        -speed,
        diff > 20 ? 0.05 * refreshCorrection : 0
      );
    }

    player.setLinvel(linvel, true);
    player.applyImpulse(impulse, true);

    if (player.translation().y > playerHeight)
      set((store) => {
        store.player.maxHeight = Math.floor(player.translation().y);
      });

    set((store) => {
      store.player.state = state;
    });
  });

  useFrame((_, delta) => {
    const refreshCorrection = delta / (1 / 144);
    const y = ref.current?.linvel().y ?? 0;
    const diffY =
      y >= 0 ? y * jumpDamping : Math.max(y * fallDamping, -speed * 10);

    ref.current?.setLinvel(
      vec3(ref.current.linvel()).sub(
        new Vector3(0, (y - diffY) / refreshCorrection)
      ),
      true
    );
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
      >
        <CapsuleCollider
          args={[width / 2, height / 2]}
          mass={2}
          onCollisionEnter={() => {
            // fallback when we somehow miss the sensors
            changeDirection();
          }}
        />
        <CuboidCollider
          sensor={true}
          args={[width / 2, height * 0.6, 0.5]}
          position={[width / 2, (-height * 0.4) / 2, 0]}
          mass={0}
          onIntersectionEnter={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              changeDirection(new Vector3(-1, 0, 0));
              touchingRights.current += 1;
            }
          }}
          onIntersectionExit={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              if (touchingRights.current > 0) touchingRights.current -= 1;
            }
          }}
        />
        <CuboidCollider
          sensor={true}
          args={[width / 2, height * 0.6, 0.5]}
          position={[-width / 2, (-height * 0.4) / 2, 0]}
          mass={0}
          onIntersectionEnter={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              changeDirection(new Vector3(1, 0, 0));
              touchingLefts.current += 1;
            }
          }}
          onIntersectionExit={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              if (touchingLefts.current > 0) touchingLefts.current -= 1;
            }
          }}
        />
        <CuboidCollider
          sensor={true}
          args={[width / 4, height / 4, 0.5]}
          position={[0, -height, 0]}
          mass={0}
          onIntersectionEnter={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              touchingFloors.current = 1;
            }
          }}
          onIntersectionExit={({ other }) => {
            if (
              other?.rigidBodyObject?.name === "platform" &&
              !other.collider.isSensor()
            ) {
              if (touchingFloors.current > 0) touchingFloors.current -= 1;
            }
          }}
        />
        <mesh>
          <planeGeometry args={[0.5, (4 / 6) * 2]} />
          <meshStandardMaterial />
        </mesh>
        <mesh ref={directionPointerRef}>
          <boxGeometry args={[0.3, 1, 0.1]} />
          <meshStandardMaterial color="green" />
        </mesh>
      </RigidBody>
    </>
  );
};

import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  vec3,
} from "@react-three/rapier";
import { button, useControls } from "leva";
import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { Mesh, Vector3, Vector3Tuple } from "three";
import { lerp } from "three/src/math/MathUtils";
import { PlayerState, useStore } from "./store";
import { SpriteAnimator } from "@react-three/drei";

const animationMap: { [key: PlayerState]: string } = {
  ["idle"]: "idle",
  ["moving"]: "run",
  ["jumping"]: "jump",
  ["sliding"]: "RightWallslide",
};

export const Player = ({
  position = [0, 0, 0],
  playMusic,
}: {
  position: Vector3Tuple;
  playMusic: () => void;
}) => {
  const ref = useRef<RapierRigidBody>(null);

  const set = useStore((store) => store.set);
  const playerState = useStore((store) => store.player.state);
  const playerStateRef = useRef(playerState);
  const playerHeight = useStore((store) => store.player.maxHeight);
  const directionRef = useRef(new Vector3(1, 0, 0));
  const pointerDown = useRef(false);
  const lastJumpedAt = useRef(0);
  const startedSlidingAt = useRef<number>();
  const didJumpRelease = useRef(true);
  const jumpsLeft = useRef(0);
  const directionPointerRef = useRef<Mesh>(null);

  const collisionMap = useRef<
    Map<string, { normal: Vector3Object; collider: RapierCollider }>
  >(new Map());

  const { speed, jumpHeight, jumpDamping, fallDamping } = useControls({
    speed: 5,
    jumpHeight: {
      value: 20,
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
    restartPlayer: button(() => {
      ref.current?.setTranslation(vec3(), true);
      ref.current?.setLinvel(vec3(), true);
      ref.current?.setAngvel(vec3(), true);
    }),
  });

  const [flipX, setFlipX] = React.useState(false);

  const [frameName, setFrameName] = React.useState("idle");

  const onEnd = ({ currentFrameName, currentFrame }: any) => {
    if (currentFrameName === "jump") {
      setFrameName(animationMap["moving"]);
    }
  };

  useEffect(() => {
    setFrameName(animationMap[playerState]);
  }, [playerState]);

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
    directionRef.current.copy(
      dir ?? directionRef.current.clone().multiplyScalar(-1)
    );

    setFlipX(directionRef.current.x < 0);

    // directionPointerRef.current!.copy(directionRef.current).multiplyScalar(0.5);
  }, []);

  useEffect(() => {
    if (playerStateRef.current === "sliding") {
      startedSlidingAt.current = Date.now();
    } else {
      startedSlidingAt.current = undefined;
    }
  }, [playerState]);

  useFrame((_, delta) => {
    const { current: player } = ref;
    if (!player) return;

    let state = playerStateRef.current;

    const linvel = vec3(player.linvel());

    linvel.x = directionRef.current.x * speed;

    const impulse = vec3();

    if (!didJumpRelease.current && !pointerDown.current) {
      didJumpRelease.current = true;
    }

    if (
      playerState !== "jumping" &&
      jumpsLeft.current > 0 &&
      pointerDown.current &&
      didJumpRelease.current &&
      lastJumpedAt.current + 200 < Date.now()
    ) {
      didJumpRelease.current = false;
      linvel.y = 0;
      impulse.y = jumpHeight;

      jumpsLeft.current -= 1;
      if (state === "sliding") {
        changeDirection();
      }
      state = "jumping";
      lastJumpedAt.current = Date.now();
      playMusic();
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
      linvel.y = lerp(player.linvel().y, -speed, diff > 20 ? 0.05 : 0);
    }

    player.setLinvel(linvel, true);
    player.applyImpulse(impulse, true);

    console.log(state);
    if (player.translation().y > playerHeight)
      set((store) => {
        store.player.maxHeight = Math.floor(player.translation().y);
      });

    playerStateRef.current = state;
    set((store) => {
      store.player.state = playerStateRef.current;
    });
  });

  // useFrame((_, delta) => {
  //   if (
  //     playerStateRef.current === "sliding" ||
  //     playerStateRef.current === "jumping"
  //   ) {
  //     const refreshCorrection = delta / (1 / 60);
  //     // console.log(refreshCorrection);

  //     // apply down impulse the longer the player is jumping
  //     const impulse = vec3();
  //     const x = Math.min((Date.now() - lastJumpedAt.current) / 500, 1);

  //     impulse.y = x > 250 ? -jumpHeight * x * x * x * refreshCorrection : 0;
  //     ref.current?.applyImpulse(impulse, true);
  //   }
  // });

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

            let state = playerStateRef.current;
            const collisions = Array.from(collisionMap.current.values());

            const touchingFloor = collisions.some(
              ({ normal }) => Math.abs(normal.y) === 1
            );

            const touchingLeft = collisions.some(
              ({ normal }) => normal.x === -1
            );

            const touchingRight = collisions.some(
              ({ normal }) => normal.x === 1
            );

            if (touchingFloor) {
              state = "moving";
            }

            if ((touchingLeft || touchingRight) && !touchingFloor) {
              state = "sliding";
            }

            if (touchingFloor || touchingLeft || touchingRight) {
              jumpsLeft.current = 2;
            }

            if (
              state === "moving" &&
              playerState !== "jumping" &&
              touchingFloor &&
              (touchingRight || touchingLeft)
            ) {
              changeDirection(new Vector3(touchingRight ? -1 : 1, 0, 0));
            }

            playerStateRef.current = state;
            set((store) => {
              store.player.state = playerStateRef.current;
            });
          }
        }}
        onCollisionExit={({ other }) => {
          if (other?.rigidBodyObject?.name === "platform") {
            collisionMap.current.delete(other.collider.handle.toString());
          }
        }}
      >
        <CapsuleCollider args={[0.25, 4 / 6 / 2]} mass={2} />
        {/* <mesh>
          <planeGeometry args={[0.5, (4 / 6) * 2]} />
          <meshStandardMaterial />
        </mesh> */}
        {/* <mesh ref={directionPointerRef}>
          <boxGeometry args={[0.3, 1, 0.1]} />
          <meshStandardMaterial color="green" opacity={0} transparent={true} />
        </mesh> */}
        <SpriteAnimator
          flipX={flipX}
          scale={[2, 2, 2]}
          position={[0, 0, 0]}
          onLoopEnd={onEnd}
          frameName={frameName}
          fps={20}
          animationNames={[
            "idle",
            "run",
            "jump",
            "RightWallslide",
            "doublejump",
          ]}
          autoPlay={true}
          loop={true}
          alphaTest={0.01}
          textureImageURL={"./sprites/spritesheet.png"}
          textureDataURL={"./sprites/spritesheet.json"}
        />
      </RigidBody>
    </>
  );
};

import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  CuboidCollider,
  RapierCollider,
  RapierRigidBody,
  RigidBody,
  Vector3Object,
  quat,
  useRapier,
  vec3,
} from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Quaternion, Vector3, Vector3Tuple } from "three";
import { useStore, PlayerState, ActionType } from "./store";
import { Capsule } from "@react-three/drei";
import { act } from "react-dom/test-utils";

const keys: { [key: string]: ActionType } = {
  // KeyW: "jump",
  // ArrowUp: "jump",
  KeyS: "down",
  // ArrowDown: "down",
  KeyA: "left",
  // ArrowLeft: "left",
  KeyD: "right",
  // ArrowRight: "right",
  Space: "jump",
};

export const Player = ({
  position = [0, 0, 0],
}: {
  position: Vector3Tuple;
}) => {
  const ref = useRef<RapierRigidBody>(null);
  const { viewport } = useThree();
  const onCollisionEnter = () => (
    ref.current!.setTranslation({ x: 0, y: 0, z: 0 }, true),
    ref.current!.setLinvel({ x: 0, y: 10, z: 0 }, true)
  );

  const set = useStore((store) => store.set);
  const playerState = useStore((store) => store.player.state);
  const actionsRef = useStore((store) => store.controls.actions)!;

  const touchingFloor = useRef(false);
  const canJump = useRef(false);
  const lastJumpedAt = useRef(0);
  const didJumpRelease = useRef(true);
  const jumpPosition = useRef<Vector3>();
  const horizontalMovementAfterJump = useRef(0);

  const { camera } = useThree();
  const [flipX, setFlipX] = useState(false);

  const moveFieldByKey = (key: string): ActionType => keys[key];

  const collisionMap = useRef<{
    [key: string]: { normal: Vector3Object; collider: RapierCollider };
  }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      actionsRef.current![moveFieldByKey(e.code)] = {
        startedAt: Date.now(),
        value: 1,
      };
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      actionsRef.current![moveFieldByKey(e.code)] = {
        startedAt: Date.now(),
        value: 0,
      };
    };
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const { speed, jumpHeight, mass } = useControls({
    speed: 1,
    jumpHeight: 25,
    mass: 1,
  });

  useFrame(() => {
    const { current: player } = ref;
    if (!player) return;
    if (!actionsRef.current) return;

    const { down, left, right, jump } = actionsRef.current;
    // console.log(down, left, right, jump);

    const linvel = new Vector3(
      Number(right.value) - Number(left.value),
      -Number(down.value) * 0.25,
      0
    );
    linvel.multiplyScalar(speed);

    const collisions = Object.values(collisionMap.current);
    const normal = collisions.reduce((acc, { normal: curr }) => {
      acc.x += curr.x;
      acc.y += curr.y;
      acc.z += curr.z;
      return acc;
    }, new Vector3(0, 0, 0)) as Vector3;

    normal.normalize();

    normal.y = -normal.y;

    const angle = normal.length() === 0 ? 0 : Math.atan2(normal.x, normal.y);

    const isPlatformJumpable = Math.abs(angle) <= Math.PI / 2;

    if (!didJumpRelease.current && !jump.value) {
      didJumpRelease.current = true;
    }

    if (touchingFloor.current && !jump.value) {
      horizontalMovementAfterJump.current = 0;
      jumpPosition.current = undefined;

      if (isPlatformJumpable) {
        canJump.current = true;
      }

      if (!left && !right) {
        set((store) => {
          store.player.state = "idle";
        });
      } else {
        set((store) => {
          store.player.state = "moving";
        });
      }
    }

    if (
      touchingFloor.current &&
      Math.abs(Math.abs(angle) - Math.PI / 2) < 0.01
    ) {
      player.setTranslation(
        {
          ...player.translation(),
          y: player.translation().y - 0.02,
        },
        true
      );

      linvel.x = 0;

      set((store) => {
        store.player.state = "sliding";
      });
    }

    if (
      didJumpRelease.current &&
      canJump.current &&
      jump.value &&
      Date.now() - lastJumpedAt.current > 100
    ) {
      const rotation = quat().setFromAxisAngle(
        new Vector3(0, 0, 1),
        angle * 0.3
      );

      const jumpVector = new Vector3(0, jumpHeight, 0).applyQuaternion(
        rotation
      );

      player.applyImpulse(jumpVector, true);

      horizontalMovementAfterJump.current = player.linvel().x;
      canJump.current = false;
      lastJumpedAt.current = Date.now();

      didJumpRelease.current = false;
      jumpPosition.current = vec3(player.translation());

      set((store) => {
        store.player.state = "jumping";
      });
    }

    if (
      !touchingFloor.current &&
      playerState !== "jumping" &&
      (ref.current?.linvel()?.y ?? 0) < 0
    ) {
      set((store) => {
        store.player.state = "falling";
      });
    }

    if (horizontalMovementAfterJump.current) {
      linvel.x += horizontalMovementAfterJump.current * 0.05;
    }
    ref.current?.applyImpulse(linvel, true);
  });

  useFrame(() => {
    const { x, y, z } = ref.current?.linvel() || { x: 0, y: 0, z: 0 };
    ref.current?.setLinvel(
      {
        x: x * 0.9,
        y: y >= 0 ? y * 0.9 : (y - 0.1) * 1,
        z,
      },
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
        mass={mass}
        position={position}
        enabledTranslations={[true, true, false]}
        lockRotations={true}
        ccd={true}
        onCollisionEnter={({ other, manifold }) => {
          if (other?.rigidBodyObject?.name === "platform") {
            touchingFloor.current = true;
            collisionMap.current[other.collider.handle] = {
              normal: manifold.normal(),
              collider: other.collider,
            };
          }
        }}
        onCollisionExit={({ other }) => {
          if (other?.rigidBodyObject?.name === "platform") {
            touchingFloor.current = false;
            delete collisionMap.current[other.collider.handle];
          }
        }}
      >
        <CapsuleCollider args={[0.5, 0.5]} mass={0} />
        <mesh>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial />
        </mesh>
      </RigidBody>
    </>
  );
};

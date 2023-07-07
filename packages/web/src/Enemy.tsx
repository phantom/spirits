import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

export function Enemy(props: RigidBodyProps) {
  const store = useStore((store) => store);
  const ref = React.useRef<RapierRigidBody>(null);

  const enemyTexture = useLoader(TextureLoader, "/sprites/enemy.png");

  const resetPlayer = useStore((store) => store.player.reset);

  return (
    <RigidBody
      type="fixed"
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== "player") return;
        resetPlayer();
      }}
      ref={ref}
      {...props}
      linearVelocity={[1, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={enemyTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

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

  return (
    <RigidBody
      type="fixed"
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== "player") return;
        store?.player.ref?.current?.setTranslation(new Vector3(0, 2, 0), false);
        store?.player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
      }}
      ref={ref}
      {...props}
      linearVelocity={[1, 0, 0]}
    >
      <mesh>
        <boxGeometry args={[1, 1]} />
        <meshStandardMaterial map={enemyTexture} />
      </mesh>
    </RigidBody>
  );
}

import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";

export function Trophy(props: RigidBodyProps) {
  const ref = React.useRef<RapierRigidBody>(null);

  const trophyTexture = useLoader(TextureLoader, "/sprites/trophy.png");

  return (
    <RigidBody
      type="fixed"
      scale={props.scale}
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== "player") return;
        console.log("Trophy collected!");
        // TODO: Connect to Mitchell's airdrop endpoint
      }}
      ref={ref}
      {...props}
      linearVelocity={[1, 0, 0]}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={trophyTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as React from "react";
import {} from "./store";

export const Decor = (props: RigidBodyProps) => {
  const tipTexture = useLoader(TextureLoader, "/sprites/decor.png");

  return (
    <RigidBody name="decor" sensor={true} {...props}>
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={tipTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
};

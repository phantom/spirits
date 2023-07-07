import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

export const Background = () => {
  const texture = useLoader(THREE.TextureLoader, "/sprites/background.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3); // Adjust the repeat values as needed

  return (
    <group position={[0, 20, -10]} renderOrder={1}>
      <mesh position={[0, 0, 0]}>
        <planeGeometry args={[16, 100]} attach="geometry" />
        <meshStandardMaterial map={texture} attach="material" />
      </mesh>
    </group>
  );
};

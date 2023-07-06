import { useLoader } from "@react-three/fiber";
import * as THREE from "three";
import React from "react";

export const Background = () => {
  const texture = useLoader(THREE.TextureLoader, "src/sprites/background.png");
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(1, 3); // Adjust the repeat values as needed

  return (
    <mesh position={[0, 20, 0]}>
      <primitive object={new THREE.PlaneGeometry(18, 100)} attach="geometry" />
      <primitive
        object={new THREE.MeshBasicMaterial({ map: texture })}
        attach="material"
      />
    </mesh>
  );
};

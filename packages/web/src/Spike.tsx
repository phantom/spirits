import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";

// TODO: Change direction of player when it hits a spike
export function Spike(props: RigidBodyProps) {
  return (
    <RigidBody name="spike" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

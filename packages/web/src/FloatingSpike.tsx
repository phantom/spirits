import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { Vector3 } from "three";
import { useFrame } from "@react-three/fiber";

const xboundary = [-1, 1];

export function FloatingSpike(props: RigidBodyProps) {
  const store = useStore((store) => store);
  const ref = React.useRef<RapierRigidBody>(null);
  const resetPlayer = useStore((store) => store.player.reset);

  useFrame(() => {
    const { current: spike } = ref;
    if (!spike || !props.position) return;

    const linvel = vec3(spike.linvel());

    // Sweep back and forth
    const position = props.position as Vector3;
    if (spike.translation().x >= position.x + xboundary[1]) {
      linvel.x = -1;
    } else if (spike.translation().x <= position.x + xboundary[0]) {
      linvel.x = 1;
    }
    spike.setLinvel(linvel, true);

    // Rotation Velocity
    const angvel = vec3(spike.angvel());
    angvel.z = 3;
    spike.setAngvel(angvel, true);
  });

  return (
    <RigidBody
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== "player") return;
        resetPlayer();
      }}
      ref={ref}
      {...props}
      linearVelocity={[1, 0, 0]}
    >
      <mesh>
        <circleGeometry args={[0.5, 3]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

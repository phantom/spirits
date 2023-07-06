import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { Vector3 } from "three";

interface SpikedPlatformProps extends RigidBodyProps {
  position?: Vector3;
  platformSize?: Vector3;
  spikeSize?: Vector3;
}

export const SpikedPlatform = ({
  position = new Vector3(0, 0, 0),
  platformSize = new Vector3(1, 1, 0),
  spikeSize = new Vector3(1, 1, 0),
  ...props
}: SpikedPlatformProps) => {
  const store = useStore((store) => store);

  return (
    <group position={position}>
      <RigidBody name="platform" type="fixed" {...props}>
        <mesh>
          <boxGeometry args={platformSize.toArray()} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody
        name="spike"
        type="fixed"
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name !== "player") return;
          store?.player.ref?.current?.setTranslation(
            new Vector3(0, 2, 0),
            false
          );
          store?.player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
        }}
        {...props}
      >
        <mesh>
          <boxGeometry args={spikeSize.toArray()} />
          <meshStandardMaterial color="red" />
        </mesh>
      </RigidBody>
    </group>
  );
};

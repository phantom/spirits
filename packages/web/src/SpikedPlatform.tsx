import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { Vector3 } from "three";

interface SpikedPlatformProps extends RigidBodyProps {
  position?: Vector3;
  platformSize?: Vector3;
  spikeSize?: Vector3;
  orientation?: "top" | "bottom" | "left" | "right";
}

export const SpikedPlatform = ({
  position = new Vector3(),
  platformSize = new Vector3(1, 1.5, 0),
  spikeSize = new Vector3(1, 0.5, 0),
  orientation = "top",
  ...props
}: SpikedPlatformProps) => {
  const store = useStore((store) => store);

  // Calculate the spike position based on orientation
  let spikePosition;
  switch (orientation) {
    case "top":
      spikePosition = new Vector3(0, platformSize.y / 2 + spikeSize.y / 2, 0);
      break;
    case "bottom":
      spikePosition = new Vector3(
        0,
        -(platformSize.y / 2 + spikeSize.y / 2),
        0
      );
      break;
    case "left":
      spikePosition = new Vector3(
        -(platformSize.x / 2 + spikeSize.x / 2),
        0,
        0
      );
      break;
    case "right":
      spikePosition = new Vector3(platformSize.x / 2 + spikeSize.x / 2, 0, 0);
      break;
    default:
      spikePosition = new Vector3(0, platformSize.y / 2 + spikeSize.y / 2, 0);
      break;
  }

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
        position={spikePosition}
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

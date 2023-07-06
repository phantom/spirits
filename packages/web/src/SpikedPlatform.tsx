import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

interface SpikedPlatformProps extends RigidBodyProps {
  position?: Vector3;
  platformSize?: Vector3;
  spikeSize?: Vector3;
  orientation?: "top" | "bottom" | "left" | "right";
}

export const SpikedPlatform = ({
  position = new Vector3(),
  platformSize = new Vector3(2, 1, 0),
  spikeSize = new Vector3(1, 1, 0),
  orientation = "top",
  ...props
}: SpikedPlatformProps) => {
  const store = useStore((store) => store);

  const spikeTexture = useLoader(TextureLoader, "src/sprites/spike.png");
  const spikeMaterial = new SpriteMaterial({ map: spikeTexture });
  const spikeSprite = new Sprite(spikeMaterial);
  spikeSprite.scale.set(spikeSize.x, spikeSize.y, 1);

  const spikePosition = new Vector3();
  switch (orientation) {
    case "top":
      spikePosition.y += platformSize.y / 2 + spikeSize.y - 0.5;
      break;
    case "bottom":
      spikePosition.y -= platformSize.y / 2 + spikeSize.y;
      break;
    case "left":
      spikePosition.x -= platformSize.x / 2 + spikeSize.x;
      break;
    case "right":
      spikePosition.x += platformSize.x / 2 + spikeSize.x;
      break;
    default:
      spikePosition.y += platformSize.y / 2 + spikeSize.y;
      break;
  }

  console.log("Spike position", spikePosition);

  return (
    <group position={position}>
      <RigidBody name="platform" type="fixed" colliders="hull" {...props}>
        <mesh>
          <boxGeometry args={platformSize.toArray()} />
          <meshStandardMaterial color="gray" />
        </mesh>
      </RigidBody>
      <RigidBody
        name="spike"
        position={spikePosition}
        onCollisionEnter={({ other }) => {
          if (other.rigidBodyObject?.name !== "player") return;
          console.log("Colliding"); // Why is this not logging :(
          store?.player.ref?.current?.setTranslation(
            new Vector3(0, 2, 0),
            false
          );
          store?.player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
        }}
        {...props}
      >
        <primitive object={spikeSprite} />
      </RigidBody>
    </group>
  );
};

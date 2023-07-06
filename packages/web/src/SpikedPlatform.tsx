import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { Sprite, SpriteMaterial, TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

interface SpikedPlatformProps extends RigidBodyProps {
  position?: Vector3;
  platformSize?: Vector3;
  orientation?: "up" | "down" | "left" | "right";
}

export const SpikedPlatform = ({
  position = new Vector3(5, 2, 0),
  platformSize = new Vector3(1, 1, 0),
  orientation = "up",
  ...props
}: SpikedPlatformProps) => {
  const store = useStore((store) => store);

<<<<<<< HEAD
  const spikeTexture = useLoader(TextureLoader, "/sprites/spike.png");
  const spikeMaterial = new SpriteMaterial({ map: spikeTexture });
  const spikeSprite = new Sprite(spikeMaterial);
  spikeSprite.scale.set(spikeSize.x, spikeSize.y, 1);
=======
  const platformTexture = useLoader(
    TextureLoader,
    "src/sprites/platform-variants/large.png"
  );

  const spikeUp = useLoader(TextureLoader, "src/sprites/spike-up.png");
  const spikeDown = useLoader(TextureLoader, "src/sprites/spike-down.png");
  const spikeLeft = useLoader(TextureLoader, "src/sprites/spike-left.png");
  const spikeRight = useLoader(TextureLoader, "src/sprites/spike-right.png");
>>>>>>> 965e6c6 (use different orientations for spiked platform)

  const spikePosition = new Vector3();
  let spikeMaterial;

  switch (orientation) {
    case "up":
      spikePosition.y += platformSize.y / 2 + 0.5;
      spikeMaterial = new SpriteMaterial({ map: spikeUp });
      break;
    case "down":
      spikePosition.y -= platformSize.y / 2 + 0.5;
      spikeMaterial = new SpriteMaterial({ map: spikeDown });
      break;
    case "left":
      spikePosition.x -= platformSize.x / 2 + 0.5;
      spikeMaterial = new SpriteMaterial({ map: spikeLeft });
      break;
    case "right":
      spikePosition.x += platformSize.x / 2 + 0.5;
      spikeMaterial = new SpriteMaterial({ map: spikeRight });
      break;
  }
  const spikeSprite = new Sprite(spikeMaterial);

  return (
    <group position={position}>
      <RigidBody name="platform" type="fixed" colliders="hull" {...props}>
        <mesh>
          <boxGeometry args={platformSize.toArray()} />
          <meshStandardMaterial map={platformTexture} transparent={true} />
        </mesh>
      </RigidBody>
      <RigidBody
        name="spike"
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
          <boxGeometry args={[1, 1, 0]} />
          <primitive object={spikeSprite} />
        </mesh>
      </RigidBody>
    </group>
  );
};

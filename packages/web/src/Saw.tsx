import { useLoader } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";
import { Sprite, SpriteMaterial, Texture, TextureLoader, Vector2 } from "three";

// TODO: Change direction of player when it hits a spike
export function Saw(props: RigidBodyProps) {
  const spriteRef = React.useRef<Sprite>(null);
  const materialRef = React.useRef<SpriteMaterial>(null);

  const texture = useLoader(
    TextureLoader,
    "src/sprites/saw.png",
    (_) => null
  ) as Texture;

  React.useEffect(() => {
    const textureWidth = texture.image.width;
    const textureHeight = texture.image.height;

    const spriteSize = new Vector2(80, 153); // Size of the specific sprite
    const spritePosition = new Vector2(0, 0); // Position of the specific sprite on the texture

    // texture.repeat.set(spriteUvScale.x, spriteUvScale.y);
    texture.repeat.set(
      spriteSize.x / textureWidth,
      spriteSize.y / textureHeight
    );
    // texture.offset.set(spriteUvOffset.x, spriteUvOffset.y);
    texture.offset.set(
      spritePosition.x / textureWidth,
      spritePosition.y / textureHeight
    );

    const multiplier = 1.5;
    spriteRef.current?.scale.set(
      (multiplier * spriteSize.x) / spriteSize.y,
      multiplier,
      (multiplier * spriteSize.x) / spriteSize.y
    );

    texture.image.transparent = true;
    texture.image.depthwrite = false;
    texture.needsUpdate = true;
  }, [texture]);

  return (
    <RigidBody name="saw" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={"#ff0000"} />
      </mesh>
      <sprite ref={spriteRef}>
        <spriteMaterial
          attach="material"
          transparent={true}
          map={texture}
          ref={materialRef}
          rotation={0}
          // rotation={rotation}
        />
        {/* <spriteMaterial attach="material" /> */}
      </sprite>
    </RigidBody>
  );
}

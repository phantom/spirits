import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { TextureLoader, Vector3 } from "three";
import { useFrame, useLoader } from "@react-three/fiber";

const xboundary = [-3, 3];
export function Enemy(props: RigidBodyProps) {
  const store = useStore((store) => store);
  const ref = React.useRef<RapierRigidBody>(null);

  const enemyTexture = useLoader(TextureLoader, "/sprites/enemy.png");

  useFrame(() => {
    const { current: enemy } = ref;
    if (!enemy || !props.position) return;

    const linvel = vec3(enemy.linvel());

    // Sweep side to side
    const position = props.position as Vector3;

    if (linvel.x === 0) {
      linvel.x = 1;
    }
    if (enemy.translation().x >= position[0] + xboundary[1]) {
      linvel.x = -1;
    } else if (enemy.translation().x <= position[0] + xboundary[0]) {
      linvel.x = 1;
    }
    enemy.setLinvel(linvel, true);
  });

  return (
    <RigidBody
      name="enemy"
      onCollisionEnter={({ other }) => {
        if (other.rigidBodyObject?.name !== "player") return;
        store?.player.ref?.current?.setTranslation(new Vector3(0, 2, 0), false);
        store?.player.ref?.current?.setLinvel(new Vector3(0, 0, 0), false);
      }}
      ref={ref}
      {...props}
    >
      <mesh>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={enemyTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

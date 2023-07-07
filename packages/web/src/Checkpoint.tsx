import {
  CuboidCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { TextureLoader, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";

const scale = 446 / 397;

export function Checkpoint(props: RigidBodyProps) {
  const store = useStore((store) => store);
  const ref = React.useRef<RapierRigidBody>(null);
  const set = useStore((store) => store.set);

  const checkpointTexture = useLoader(TextureLoader, "/sprites/checkpoint.png");
  const checkpointCompletedTexture = useLoader(
    TextureLoader,
    "/sprites/checkpoint-completed.png"
  );

  const [isCapured, setCaptured] = React.useState(false);
  // const enemyTexture = useLoader(TextureLoader, "/sprites/enemy.png");

  return (
    <>
      <RigidBody type="fixed" ref={ref} {...props} linearVelocity={[1, 0, 0]}>
        <CuboidCollider
          args={[7.5, 1, 1]}
          sensor={true}
          onIntersectionEnter={() => {
            setCaptured(true);
            set((store) => {
              store.level.checkpoint = new Vector3().fromArray(
                props.position as number[]
              );
            });
          }}
        />
      </RigidBody>
      <mesh
        position={[
          props.position![0],
          props.position![1] + 0.9,
          props.position![2] - 0.1,
        ]}
      >
        {/* <boxGeometry args={[0.3, 1.3]} />
        <meshBasicMaterial color={isCapured ? "green" : "red"} /> */}
        <planeGeometry args={[5, 5 * scale]} />
        <meshStandardMaterial
          map={isCapured ? checkpointCompletedTexture : checkpointTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </>
  );
}

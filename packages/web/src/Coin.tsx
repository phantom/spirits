import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";

export function Coins(props: RigidBodyProps) {
  const [isCaptured, setIsCaptured] = React.useState(false);

  const set = useStore((store) => store.set);

  return (
    <RigidBody
      type="fixed"
      sensor={true}
      onIntersectionEnter={() => {
        if (!isCaptured) {
          set((store) => {
            store.player.score += 1;
          });
          setIsCaptured(true);
        }
      }}
      {...props}
    >
      <mesh scale={isCaptured ? 0 : 1}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gold" />
      </mesh>
    </RigidBody>
  );
}

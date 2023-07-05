import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";

interface CoinProps extends RigidBodyProps {
  remove: () => void;
}

export const Coin = (props: CoinProps) => {
  const set = useStore((store) => store.set);

  return (
    <RigidBody
      type="fixed"
      sensor={true}
      onIntersectionEnter={() => {
        set((store) => {
          store.player.score += 1;
        });
        props.remove();
      }}
      {...props}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gold" />
      </mesh>
    </RigidBody>
  );
};

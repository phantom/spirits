import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";

interface CoinProps extends RigidBodyProps {
  key: string;
  remove: () => void;
}

export const Coin = (props: CoinProps) => {
  const set = useStore((store) => store.set);
  const scoredCoinsRef = useStore((store) => store.player.scoredCoinsRef);

  return (
    <RigidBody
      name="coin"
      type="fixed"
      sensor={true}
      onIntersectionEnter={() => {
        props.remove();
        console.log("Coin collision detected."); // debug log
        if (!scoredCoinsRef?.current?.has(props.key)) {
          console.log("Incrementing score."); // debug log
          scoredCoinsRef?.current?.add(props.key);
          set((store) => {
            store.player.score += 1;
          });
        }
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

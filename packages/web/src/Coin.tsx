import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";
import { useStore } from "./store";
import { useFrame } from "@react-three/fiber";
import { Vector3 } from "three";

const yboundary = [-1, 1];

interface CoinProps extends RigidBodyProps {
  key: string;
  remove: () => void;
}

export const Coin = (props: CoinProps) => {
  const set = useStore((store) => store.set);
  const scoredCoinsRef = useStore((store) => store.player.scoredCoinsRef);
  const ref = React.useRef<RapierRigidBody>(null);

  useFrame(() => {
    const { current: coin } = ref;
    if (!coin || !props.position) return;

    const linvel = vec3(coin.linvel());

    // Sweep back and forth
    const position = props.position as Vector3;

    if (coin.translation().y >= position[1] + yboundary[1]) {
      linvel.y = -1;
    } else if (coin.translation().y <= position[1] + yboundary[0]) {
      linvel.y = 3;
    }
    coin.setLinvel(linvel, true);
  });

  return (
    <RigidBody
      name="coin"
      sensor={true}
      onIntersectionEnter={() => {
        props.remove();
        if (!scoredCoinsRef?.current?.has(props.key)) {
          scoredCoinsRef?.current?.add(props.key);
          set((store) => {
            store.player.score += 1;
          });
        }
      }}
      ref={ref}
      {...props}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="gold" />
      </mesh>
    </RigidBody>
  );
};

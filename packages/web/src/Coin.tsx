import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import { useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader } from "three";
import * as React from "react";
import { useStore } from "./store";

const yboundary = [-1, 1];

interface CoinProps extends RigidBodyProps {
  key: string;
  remove: () => void;
}

export const Coin = (props: CoinProps) => {
  const set = useStore((store) => store.set);
  const scoredCoinsRef = useStore((store) => store.player.scoredCoinsRef);
  const ref = React.useRef<RapierRigidBody>(null);

  const coinTexture = useLoader(TextureLoader, "src/sprites/coin.png");

  return (
    <RigidBody
      type="fixed"
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
        <planeGeometry args={[1, 1]} />
        <meshBasicMaterial
          map={coinTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
};

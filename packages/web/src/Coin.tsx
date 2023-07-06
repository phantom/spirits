import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import { useFrame, useLoader } from "@react-three/fiber";
import { RepeatWrapping, TextureLoader, Vector3 } from "three";
import * as React from "react";
import { useStore } from "./store";

const yboundary = [-0.2, 0.2];

const spritePaths = ["/sprites/coin.png", "/sprites/coin-shimmer.png"];

function chooseSprite() {
  return spritePaths[Math.floor(Math.random() * spritePaths.length)];
}

interface CoinProps extends RigidBodyProps {
  key: string;
  remove: () => void;
}

export const Coin = (props: CoinProps) => {
  const set = useStore((store) => store.set);
  const scoredCoinsRef = useStore((store) => store.player.scoredCoinsRef);
  const ref = React.useRef<RapierRigidBody>(null);
  const sprite = React.useMemo(() => chooseSprite(), []);

  const coinTexture = useLoader(TextureLoader, sprite);

  useFrame(() => {
    const { current: coin } = ref;
    if (!coin || !props.position) return;

    const linvel = vec3(coin.linvel());

    // Sweep back and forth
    const position = props.position as Vector3;

    if (linvel.y === 0) {
      linvel.y = 3;
    }
    if (coin.translation().y >= position[1] + yboundary[1]) {
      linvel.y = -1;
    } else if (coin.translation().y <= position[1] + yboundary[0]) {
      linvel.y = 1;
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
        <planeGeometry args={[0.75, 0.75]} />
        <meshBasicMaterial
          map={coinTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
};

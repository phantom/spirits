import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { TextureLoader } from "three";
import { useLoader } from "@react-three/fiber";
import { useStore } from "./store";

export function Trophy(props: RigidBodyProps) {
  const ref = React.useRef<RapierRigidBody>(null);

  const trophyTexture = useLoader(TextureLoader, "/sprites/trophy.png");

  const set = useStore((store) => store.set);
  const publicKey = useStore((store) => store.player.publicKey || "");
  const AIRDROP_ENDPOINT = `https://fmeabzbszutxkewzxuwb.supabase.co/functions/v1/reward?pubkey=${publicKey}`;

  // const [isCapured, setIsCaptured] = React.useState(false);

  const handleAirdrop = ({ other }) => {
    if (other.rigidBodyObject?.name !== "player") return;

    set((store) => {
      store.game.isPaused = true;
      store.level.levelFinished = true;
    });

    fetch(AIRDROP_ENDPOINT)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <RigidBody
      type="fixed"
      scale={props.scale}
      onCollisionEnter={handleAirdrop}
      ref={ref}
      {...props}
      linearVelocity={[1, 0, 0]}
    >
      <mesh scale={[2, 2, 2]}>
        <planeGeometry args={[1, 1]} />
        <meshStandardMaterial
          map={trophyTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

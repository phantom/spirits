import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useRef, useState, useEffect } from "react";

export const PassThroughPlatform = ({
  position = [0, 0, 0],
  rotation = [0, 0, 0],
  args = [10, 1, 1],
  ...props
}: RigidBodyProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const [passthrough, setPassthrough] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setPassthrough((prevPassthrough) => {
        const inversePasshrough = !prevPassthrough;
        const collider = ref.current?.collider(ref.current.handle);
        collider?.setSensor(inversePasshrough);
        return inversePasshrough;
      });
    }, 4000 + Math.random() * 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <RigidBody
      type="fixed"
      position={position}
      rotation={rotation}
      name="platform"
      ref={ref}
      sensor={passthrough}
      {...props}
    >
      <mesh>
        <boxGeometry args={args} />
        <meshStandardMaterial
          transparent
          color="darkgray"
          opacity={passthrough ? 0.5 : 1}
        />
      </mesh>
    </RigidBody>
  );
};

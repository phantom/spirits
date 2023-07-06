import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
} from "@react-three/rapier";
import * as React from "react";
import { useRef, useState, useEffect, useMemo } from "react";
import { Vector3 } from "three";

type RotatingPlatformProps = {
  length: number;
  width: number;
  numBlocks?: number;
  position?: [number, number, number];
} & RigidBodyProps;

export const RotatingPlatform = ({
  length,
  width,
  numBlocks = 1,
  position = [3, 3, 0],
  ...props
}: RotatingPlatformProps) => {
  const ref = useRef<RapierRigidBody>(null);
  const [blockPosition, setBlockPosition] = useState(position);
  const [stepIndex, setStepIndex] = useState(0);

  const blockPath: [number, number, number][] = useMemo(() => {
    const path: [number, number, number][] = [];
    // Top edge
    for (let i = 0; i < length; i++) {
      path.push([position[0] + i, position[1], position[2]]);
    }
    // Right edge
    for (let i = 1; i < width; i++) {
      path.push([position[0] + length - 1, position[1] + i, position[2]]);
    }
    // Bottom edge
    for (let i = 1; i < length; i++) {
      path.push([
        position[0] + length - 1 - i,
        position[1] + width - 1,
        position[2],
      ]);
    }
    // Left edge
    for (let i = 1; i < width - 1; i++) {
      path.push([position[0], position[1] + width - 1 - i, position[2]]);
    }
    return path;
  }, [length, width, position]);

  useEffect(() => {
    const interval = setInterval(() => {
      setBlockPosition(blockPath[stepIndex]);
      setStepIndex((stepIndex + 1) % blockPath.length);
    }, 1000); // Controls the speed

    return () => {
      clearInterval(interval);
    };
  }, [stepIndex, blockPath]);

  return (
    <RigidBody
      type="fixed"
      position={new Vector3(...blockPosition)}
      name="platform-block"
      ref={ref}
      {...props}
    >
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="darkgray" />
      </mesh>
    </RigidBody>
  );
};

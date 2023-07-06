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
  position = [2, 2, 0],
  ...props
}: RotatingPlatformProps) => {
  const ref = useRef<RapierRigidBody[]>([]);
  const [blockPositions, setBlockPositions] = useState<
    Array<[number, number, number]>
  >(() => {
    const initialPositions: [number, number, number][] = [];
    for (let i = 0; i < numBlocks; i++) {
      initialPositions.push([...position] as [number, number, number]);
    }
    return initialPositions;
  });
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
      setBlockPositions((prevPositions) => {
        const newPositions = [...prevPositions];
        const lastBlockPosition = newPositions.pop(); // Remove the last block
        newPositions.unshift(lastBlockPosition as [number, number, number]); // Place the last block at the front

        // Update the positions of the remaining blocks
        for (let i = 0; i < newPositions.length; i++) {
          newPositions[i] = blockPath[(stepIndex + i) % blockPath.length];
        }

        return newPositions;
      });

      setStepIndex((stepIndex + 1) % blockPath.length);
    }, 1000); // Controls the speed

    return () => {
      clearInterval(interval);
    };
  }, [stepIndex, blockPath]);

  return (
    <group>
      {blockPositions.map((blockPosition, index) => (
        <RigidBody
          key={index}
          type="fixed"
          position={new Vector3(...blockPosition)}
          name={`platform-block-${index}`}
          ref={(el) => {
            ref.current[index] = el as RapierRigidBody;
          }}
          {...props}
        >
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="darkgray" />
          </mesh>
        </RigidBody>
      ))}
    </group>
  );
};

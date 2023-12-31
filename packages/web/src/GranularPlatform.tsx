import { useLoader } from "@react-three/fiber";
import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";
import { TextureLoader } from "three";

enum SnakePartType {
  Head,
  Body,
  Transparent,
}

function getRectangleCoordinates(
  width: number,
  height: number
): [number, number][] {
  const coordinates: [number, number][] = [];

  // Calculate the centroid of the rectangle
  const centroidX = Math.floor(width / 2);
  const centroidY = Math.floor(height / 2);

  for (let x = 0; x < width; x++) {
    coordinates.push([x - centroidX, 0 - centroidY]);
  }

  for (let y = 1; y < height; y++) {
    coordinates.push([width - 1 - centroidX, y - centroidY]);
  }

  for (let x = width - 2; x >= 0; x--) {
    coordinates.push([x - centroidX, height - 1 - centroidY]);
  }

  for (let y = height - 2; y >= 1; y--) {
    coordinates.push([0 - centroidX, y - centroidY]);
  }

  return coordinates;
}

function rotateArrayByOne(arr: any[]): any[] {
  if (arr.length <= 1) {
    return arr.slice(); // Return a copy of the original array
  }

  const rotatedArray = [...arr]; // Create a shallow copy of the original array
  const firstElement = rotatedArray.shift(); // Remove the first element and store it

  rotatedArray.push(firstElement); // Add the first element at the end of the array
  return rotatedArray;
}

export function SnakeBody(
  props: RigidBodyProps & { width: number; height: number }
) {
  const platformTexture = useLoader(TextureLoader, "/sprites/snake-block.png");
  return (
    <RigidBody name="platform" type="fixed" sensor={false} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={platformTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

export function SnakeHead(
  props: RigidBodyProps & { width: number; height: number }
) {
  const platformTexture = useLoader(TextureLoader, "/sprites/snake-head.png");
  return (
    <RigidBody name="platform" type="fixed" sensor={false} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={platformTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

export function SnakeTransparent(
  props: RigidBodyProps & { width: number; height: number }
) {
  const platformTexture = useLoader(
    TextureLoader,
    "/sprites/snake-transparent.png"
  );
  return (
    <RigidBody name="platform" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial
          map={platformTexture}
          color={0xffffff}
          transparent={true}
        />
      </mesh>
    </RigidBody>
  );
}

// TODO: Change direction of player when it hits a spike
export function Snake(
  props: RigidBodyProps & {
    width: number;
    height: number;
    snakeLength: number;
    numSnakes: number;
  }
) {
  const [snakeData, setSnakeData] = React.useState<SnakePartType[]>();
  const rectCoordinates = React.useMemo(() => {
    return getRectangleCoordinates(props.width, props.height);
  }, []);

  React.useEffect(() => {
    const totalLength = 2 * props.width + 2 * props.height - 4;
    const snakeData = Array(totalLength).fill(SnakePartType.Transparent);
    snakeData[0] = SnakePartType.Head;
    for (let i = 1; i < props.snakeLength; i++) {
      snakeData[i] = SnakePartType.Body;
    }
    // TODO: Add n snakes
    if (props.numSnakes > 1) {
      const halfLength = Math.round(totalLength / 2 - props.snakeLength / 2);
      snakeData[halfLength] = SnakePartType.Head;
      for (let i = halfLength + 1; i < halfLength + props.snakeLength; i++) {
        snakeData[i] = SnakePartType.Body;
      }
    }
    setSnakeData(snakeData);

    const interval = setInterval(() => {
      setSnakeData((prevSnakeData) =>
        rotateArrayByOne(prevSnakeData ?? snakeData)
      );
    }, 500);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!snakeData || !rectCoordinates) return null;

  return snakeData.map((sd, idx) => {
    const pos = rectCoordinates[idx];
    if (!props.position) return null;
    switch (sd) {
      case SnakePartType.Body:
        return (
          <SnakeBody
            args={[1, 1, 1]}
            position={[
              props.position[0] + pos[0],
              props.position[1] + pos[1],
              props.position[2],
            ]}
            width={props.width}
            height={props.height}
          />
        );
      case SnakePartType.Head:
        return (
          <SnakeHead
            args={[1, 1, 1]}
            position={[
              props.position[0] + pos[0],
              props.position[1] + pos[1],
              props.position[2],
            ]}
            width={props.width}
            height={props.height}
          />
        );
      case SnakePartType.Transparent:
        return (
          <SnakeTransparent
            args={[1, 1, 1]}
            position={[
              props.position[0] + pos[0],
              props.position[1] + pos[1],
              props.position[2],
            ]}
            width={props.width}
            height={props.height}
          />
        );
    }
  });
}

import {
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import * as React from "react";

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

  for (let x = 0; x < width; x++) {
    coordinates.push([x, 0]);
  }

  for (let y = 1; y < height; y++) {
    coordinates.push([width - 1, y]);
  }

  for (let x = width - 2; x >= 0; x--) {
    coordinates.push([x, height - 1]);
  }

  for (let y = height - 2; y >= 1; y--) {
    coordinates.push([0, y]);
  }

  return coordinates;
}

export function SnakeBody(
  props: RigidBodyProps & { width: number; height: number }
) {
  return (
    <RigidBody name="snake" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

export function SnakeHead(
  props: RigidBodyProps & { width: number; height: number }
) {
  return (
    <RigidBody name="snake" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

// TODO: Change direction of player when it hits a spike
export function SnakeTransparent(
  props: RigidBodyProps & { width: number; height: number }
) {
  return (
    <RigidBody name="snake" type="fixed" sensor={true} {...props}>
      <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}

// TODO: Change direction of player when it hits a spike
export function Snake(
  props: RigidBodyProps & { width: number; height: number; snakeLength: number }
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

    console.log(snakeData);
    setSnakeData(snakeData);

    const interval = setInterval(() => {}, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => {
      clearInterval(interval);
    };
  }, []);

  if (!props.position || !snakeData || !rectCoordinates) return null;

  return snakeData.map((sd, idx) => {
    const pos = rectCoordinates[idx];
    switch (sd) {
      case SnakePartType.Body:
        return (
          <SnakeBody
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

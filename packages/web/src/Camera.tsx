import { extend, useFrame, useThree } from "@react-three/fiber";
import { vec3 } from "@react-three/rapier";
import CameraControls from "camera-controls";
import { useControls } from "leva";
import { useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import { Vector3 } from "three";
import { useStore } from "./store";
import * as React from "react";

CameraControls.install({ THREE });
extend({ CameraControls });

const cameraOffset = new Vector3(0, 0, 0);

const dimensions = 9 / 16;

export default function Camera() {
  const controlsRef = useRef<CameraControls>(null);
  const playerRef = useStore((store) => store.player.ref);
  const isLevelEditing = useStore((store) => store.game.isLevelEditing);
  const scalerRef = useRef<THREE.Mesh>(null);

  const { gl, camera } = useThree();
  const set = useStore((store) => store.set);

  const { cameraSensitivity, zoom } = useControls({
    zoom: {
      value: 20,
      min: 10,
      max: 100,
    },
    cameraSensitivity: {
      value: 1,
      min: 0,
      max: 1,
    },
  });

  useEffect(() => {
    controlsRef.current?.zoomTo(zoom, true);
  }, [zoom]);

  useEffect(() => {
    set((store) => {
      store.camera.controls = controlsRef;
    });
  }, []);

  useEffect(() => {
    if (!isLevelEditing) {
      controlsRef.current!.mouseButtons.left = CameraControls.ACTION.NONE;
      controlsRef.current!.mouseButtons.right = CameraControls.ACTION.NONE;
      controlsRef.current!.mouseButtons.middle = CameraControls.ACTION.NONE;
      controlsRef.current!.mouseButtons.wheel = CameraControls.ACTION.NONE;

      controlsRef.current!.touches.one = CameraControls.ACTION.NONE;
      controlsRef.current!.touches.two = CameraControls.ACTION.NONE;
      controlsRef.current!.touches.three = CameraControls.ACTION.NONE;
    } else {
      controlsRef.current!.mouseButtons.right = CameraControls.ACTION.TRUCK;
      controlsRef.current!.mouseButtons.middle = CameraControls.ACTION.ZOOM;
      controlsRef.current!.mouseButtons.wheel = CameraControls.ACTION.ZOOM;
    }
  }, [controlsRef, isLevelEditing]);

  useFrame((_, delta) => {
    if (playerRef?.current && !isLevelEditing) {
      const cameraPosition = camera.getWorldPosition(new Vector3());
      const playerPosition = playerRef?.current?.translation();

      // lerp to playerPosition
      const newPosition = new Vector3().lerpVectors(
        cameraPosition,
        new Vector3(cameraPosition?.x, playerPosition?.y, cameraPosition.z).add(
          cameraOffset
        ),
        cameraSensitivity
      );

      controlsRef.current?.setLookAt(
        ...newPosition.toArray(),
        ...vec3(playerPosition)
          .multiply(new Vector3(0, 1, 0))
          .add(cameraOffset)
          .toArray(),
        true
      );
    }

    controlsRef.current!.update(delta);
  });

  useEffect(() => {
    controlsRef.current?.fitToBox(scalerRef.current, true);
  }, []);

  return (
    <>
      {/* @ts-ignore */}
      <cameraControls ref={controlsRef} args={[camera, gl.domElement]} />
      <mesh ref={scalerRef} position={[0, 0, 0]} visible={false}>
        <boxGeometry args={[15, 15 / dimensions, 1]} />
        {/* <meshBasicMaterial color="red" /> */}
      </mesh>
    </>
  );
}

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import { Quaternion, Vector2, Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";
import { useStore } from "./store";

interface IControlsProps {}

export function Controls(_: IControlsProps) {
  // const pointerMovementRef = useRef(new Vector2());
  // const pointerDownRef = useRef(false);
  // // const pointerHolding = useRef(false);
  // const pointerDownSince = useRef<number>();
  // const cameraMovementRef = useStore((store) => store.camera.movement);
  // const floorRef = useStore((store) => store.level.floor);
  // const playerRef = useStore((store) => store.player.ref);
  // const { gl } = useThree();
  // useFrame(() => {
  //   pointerMovementRef.current.lerp(new Vector2(), 0.1);
  //   cameraMovementRef.current!.x = lerp(
  //     0,
  //     Math.min(1, Math.abs(pointerMovementRef.current.x / 5000)) *
  //       Math.sign(pointerMovementRef.current.x),
  //     0.9
  //   );
  //   cameraMovementRef.current!.y = lerp(
  //     0,
  //     Math.min(1, Math.abs(pointerMovementRef.current.y / 5000)) *
  //       Math.sign(pointerMovementRef.current.y),
  //     0.9
  //   );
  // });
  // // useFrame(({ raycaster }) => {
  // //   // console.log("frame", floorRef?.current);
  // //   if (floorRef!.current) {
  // //     // const plane = new Plane(new Vector3(0, 1, 0), 0);
  // //     // const basePlane = new Mesh(new PlaneGeometry(10000, 10000));
  // //     const intersection = raycaster.intersectObject(floorRef!.current!);
  // //     // console.log(intersection);
  // //     if (intersection.length > 0) {
  // //       // get the intersection point
  // //       const point = intersection[0].point;
  // //       // move the player to this point
  // //       // playerRef.current!.position.set(point.x, point.y, point.z)
  // //       // console.log(point.x, point.y, point.z);
  // //       // get difference between player and intersection point
  // //       const diff = point.sub(playerRef!.current!.position);
  // //       // console.log(diff);
  // //       // get angle between player and diff
  // //       const angle = Math.atan2(diff.x, diff.z);
  // //       // convert to rotation
  // //       // covert to 3d array
  // //       // const rotation3d = new Vector3(0, angle + Math.PI / 2, 0);
  // //       const quaternion = new Quaternion().setFromAxisAngle(
  // //         new Vector3(0, 1, 0),
  // //         angle + Math.PI / 2
  // //       );
  // //       playerRef!.current!.quaternion.slerp(quaternion, 0.1);
  // //     }
  // //   }
  // // });
  // useEffect(() => {
  //   gl.domElement.addEventListener("pointermove", handlePointerMove);
  //   gl.domElement.addEventListener("pointerdown", handlePointerDown);
  //   gl.domElement.addEventListener("pointerup", handlePointerUp);
  //   return () => {
  //     void gl.domElement.removeEventListener("pointermove", handlePointerMove);
  //     void gl.domElement.removeEventListener("pointerdown", handlePointerDown);
  //     void gl.domElement.removeEventListener("pointerup", handlePointerUp);
  //   };
  // }, []);
  // const handlePointerMove = (e: MouseEvent) => {
  //   if (
  //     pointerDownRef.current &&
  //     Date.now() - pointerDownSince.current! > 100
  //   ) {
  //     pointerMovementRef.current = new Vector2(e.movementX, e.movementY);
  //   }
  // };
  // const handlePointerDown = (e: MouseEvent) => {
  //   pointerDownRef.current = true;
  //   pointerDownSince.current = Date.now();
  // };
  // const handlePointerUp = (e: MouseEvent) => {
  //   pointerDownRef.current = false;
  //   pointerDownSince.current = undefined;
  // };
  // return null;
}

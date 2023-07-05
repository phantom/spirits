import nipplejs, { JoystickManager } from "nipplejs";
import * as React from "react";
import { useEffect, useRef } from "react";
import { Vector3 } from "three";
import { useStore } from "./store";

export const MobileControls = () => {
  const directionRef = useStore((store) => store.controls.direction)!;
  const actionsRef = useStore((store) => store.controls.actions)!;
  const ref = useRef<HTMLDivElement>(null);

  const joystickRef = useRef<JoystickManager>();
  const isGamePlaying = useStore((store) => store.game.isPlaying);

  useEffect(() => {
    if (isGamePlaying) {
      joystickRef.current = nipplejs.create({
        size: 100,
        threshold: 0.3,
        fadeTime: 500,

        zone: ref.current!,
        position: {
          left: "50%",
          bottom: "125px",
        },
        color: "#ab9ff2",
      });

      joystickRef.current.on("dir:left", (e, data) => {
        actionsRef.current!.left = {
          startedAt: Date.now(),
          value: Math.min(Math.abs(data.force), 1),
        };

        actionsRef.current!.right = {
          startedAt: Date.now(),
          value: 0,
        };
      });
      joystickRef.current.on("dir:right", (e, data) => {
        actionsRef.current!.right = {
          startedAt: Date.now(),
          value: Math.min(Math.abs(data.force), 1),
        };

        actionsRef.current!.left = {
          startedAt: Date.now(),
          value: 0,
        };
      });
      joystickRef.current.on("dir:up", (e, data) => {
        actionsRef.current!.down = {
          startedAt: Date.now(),
          value: 0,
        };

        if (data.force < 0.3) return;
        actionsRef.current!.jump = {
          startedAt: Date.now(),
          value: Math.min(Math.abs(data.force), 1),
        };
      });

      joystickRef.current.on("dir:down", (e, data) => {
        actionsRef.current!.jump = {
          startedAt: Date.now(),
          value: 0,
        };

        if (data.force < 0.5) return;
        actionsRef.current!.down = {
          startedAt: Date.now(),
          value: Math.min(Math.abs(data.force), 1),
        };
      });

      joystickRef.current.on("start end" as any, function (evt, data) {
        directionRef.current = new Vector3(0);
        Object.values(actionsRef.current!).forEach((action) => {
          action.value = 0;
        });
      });
    }

    return () => {
      joystickRef.current?.destroy();
    };
  }, [isGamePlaying]);

  return (
    <div
      ref={ref}
      className="absolute left-0 bottom-0 top-0 right-0 z-50"
    ></div>
  );
};

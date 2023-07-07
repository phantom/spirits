import { TransformControls } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { button, useControls } from "leva";
import { useCallback, useEffect, useRef, useState } from "react";
import seedColor from "seed-color";
import { Euler, MathUtils, Mesh, Quaternion, Vector3 } from "three";
import { TransformControls as ThreeTransformControls } from "three/examples/jsm/controls/TransformControls";
import { Entity, EntityType, useStore } from "./store";
import * as React from "react";

const backgroundDistance = 50;

export default function Editor() {
  // const orbit = useRef<ThreeOrbitControls>(null);
  const transform = useRef<ThreeTransformControls>(null);
  const meshRef = useRef<Mesh>(null);
  const changeTimeout = useRef<NodeJS.Timeout>();
  const set = useStore((store) => store.set);
  const entities = useStore((store) => store.level.entities);

  const entitiesRef = useRef<Map<string, Entity>>(entities);
  const backgroundRef = useRef<Mesh>(null);

  const { camera } = useThree();

  useEffect(() => {
    return () => {
      // only when we unmount, save to enttiies in store
      set((store) => {
        store.level.entities = entitiesRef.current;
      });
    };
  }, []);

  const [selected, setSelected] = useState<string>();
  const [entityType, setEntityType] = useState<string>("platform");

  const getEntityType = () => {
    return entityType;
  };

  const [{ mode, entityTypeSelection, entitySelection, color }, setControls] =
    useControls(
      () => ({
        mode: {
          value: "translate",
          options: ["scale", "rotate", "translate"],
        },
        entityTypeSelection: {
          value: "platform" as EntityType,
          options: [
            "platform",
            "spiked-platform",
            "checkpoint",
            "snake",
            "enemy",
            "coin",
            "square-platform",
            "vertical-platform",
            "vertical-platform-small",
            "platform-section",
          ],
          onChange: (value: EntityType) => {
            setEntityType(value);
          },
        },
        entitySelection: {
          options: [
            undefined,
            ...Array.from(entitiesRef.current.values()).map((e) => e.id),
          ],
          value: selected,
        },
        save: button(() => {
          console.log(
            JSON.stringify(
              Array.from(entitiesRef.current.values()).map((entity) => {
                // strip off id
                const { id, color, ...props } = entity;
                return props;
              })
            )
          );
        }),
        load: button(() => {
          const entities = JSON.parse(
            prompt("Paste entities JSON here") ?? "[]"
          );

          entitiesRef.current.clear();
          entities.map((entity: Entity) => {
            const id = MathUtils.generateUUID();
            entitiesRef.current.set(id, { ...entity, id });
          });
          onEntitySelect(entitiesRef.current.values().next().value.id);
        }),
        addEntity: button(() => {
          const id = MathUtils.generateUUID();
          console.log("addEntity", getEntityType());
          entitiesRef.current.set(id, {
            id,
            type: entityType as EntityType,
            position: [0, 0, 0],
            rotation: [0, 0, 0],
            scale: [1, 1, 1],
            color: seedColor(`${id}`).toHex(),
          });

          onEntitySelect(id);
        }),
        duplicate: button(() => {
          const id = MathUtils.generateUUID();
          const entity = entitiesRef.current.get(selected)!;

          entitiesRef.current.set(id, {
            id,
            type: entity.type,
            position: [...entity.position],
            scale: [...entity.scale],
            rotation: [...(entity.rotation ?? [0, 0, 0])],

            color: seedColor(`${id}`).toHex(),
          });

          onEntitySelect(id);
        }),
        removeEntity: button(() => {
          // entitiesRef.current = Array.from(entitiesRef.current.values()).filter(
          //   (e) => e.id !== selected
          // );

          entitiesRef.current.delete(selected!);
          onEntitySelect(undefined);
        }),
        ...(selected && {
          position: {
            value: [0, 0, 0],
            onEditEnd: (value: [number, number, number]) => {
              transform.current?.object?.position.set(...value);
              entitiesRef.current.get(selected)!.position = value;
            },
          },
          rotation: {
            value: [0, 0, 0],
            onEditEnd: (_value: [number, number, number]) => {
              const value = [_value[0], _value[1], _value[2]] as [
                number,
                number,
                number
              ];
              transform.current?.object?.rotation.set(...value);
              entitiesRef.current.get(selected)!.rotation = value;
            },
          },
          scale: {
            value: [0, 0, 0],
            onEditEnd: (value: [number, number, number]) => {
              transform.current?.object?.scale.set(...value);
              entitiesRef.current.get(selected)!.scale = value;
            },
          },
          color: {
            value: entitiesRef.current.get(selected)!.color ?? "#ffffff",
            onEditEnd: (v) => {
              entitiesRef.current.get(selected)!.color = v;
            },
          },
        }),
      }),
      [selected, entityType]
    );

  const onEntitySelect = useCallback(
    (id: string | undefined) => {
      setSelected(id);
      if (!id) return;
      const entity = entitiesRef.current.get(id ?? "");
      if (!entity) return;

      setEntityType(entity?.type ?? "platform");
      setControls({
        position: entity?.position ?? [0, 0, 0],
        rotation: entity?.rotation ?? [0, 0, 0],
        entityTypeSelection: entity?.type ?? "platform",
        scale: entity?.scale ?? [1, 1, 1],
        color: entity?.color ?? "#ffffff",
      });
      // }
    },
    [setControls]
  );

  // useFrame(() => {
  //   const fov_y =
  //     ((camera.position.z + backgroundDistance) *
  //       (camera as PerspectiveCamera).getFilmHeight()) /
  //     (camera as PerspectiveCamera).getFocalLength();

  //   backgroundRef.current!.scale.copy(
  //     new Vector3(fov_y * (camera as PerspectiveCamera).aspect, fov_y, 1)
  //   );
  // });

  useEffect(() => {
    if (selected) {
      // window keyevent when t pressed set mode to translate
      const onKeyDown = (event: KeyboardEvent) => {
        switch (event.key) {
          case "t":
            setControls({ mode: "translate" });
            break;
          case "r":
            setControls({ mode: "rotate" });
            break;
          case "s":
            setControls({ mode: "scale" });
            break;
        }
      };
      window.addEventListener("keydown", onKeyDown);
      return () => window.removeEventListener("keydown", onKeyDown);
    }
  }, [selected]);

  useEffect(() => {
    if (selected !== entitySelection) {
      onEntitySelect(entitySelection);
    }
  }, [entitySelection]);

  useEffect(() => {
    if (entityTypeSelection) {
      setEntityType(entityTypeSelection);
      const entity = entitiesRef.current.get(selected ?? "");
      if (entity) {
        entity.type = entityTypeSelection;
      }
    }
  }, [entityTypeSelection]);

  const geometry = useCallback((_entityType: string) => {
    switch (_entityType) {
      case "platform":
        return <boxGeometry />;
      case "rock":
        return <sphereGeometry />;
      case "ball":
        return <sphereGeometry />;
      case "wheel":
        return <cylinderGeometry />;
      case "barrel":
        return <cylinderGeometry />;
      case "checkpoint":
        return <boxGeometry args={[0.5, 1, 0.5]} />;
      default:
        return <boxGeometry />;
    }
  }, []);

  return (
    <>
      {Array.from(entitiesRef.current.values()).map((entity, index) => (
        <group key={index}>
          {selected === entity.id ? (
            <TransformControls
              ref={transform as any}
              position={entity.position}
              rotation={entity.rotation}
              scale={entity.scale}
              onObjectChange={(e) => {
                if (!e) {
                  return;
                  ("");
                }

                changeTimeout.current && clearTimeout(changeTimeout.current);

                const controls = meshRef.current;

                const foundEntity = entitiesRef.current.get(selected);

                if (foundEntity && controls) {
                  foundEntity.position = controls
                    .getWorldPosition(new Vector3())
                    .toArray() as any;
                  foundEntity.rotation = new Euler()
                    .setFromQuaternion(
                      controls.getWorldQuaternion(new Quaternion())
                    )
                    .toArray() as any;
                  foundEntity.scale = controls
                    .getWorldScale(new Vector3())
                    .toArray() as any;

                  changeTimeout.current = setTimeout(() => {
                    setControls({
                      position: foundEntity.position,
                      rotation: foundEntity.rotation,
                      scale: foundEntity.scale,
                    });
                  }, 1000);
                }
              }}
            >
              <mesh ref={meshRef}>
                {/* {entityType === "platform" && <boxGeometry />} */}
                {geometry(entityTypeSelection ?? "platform")}
                <meshStandardMaterial color={color} />
              </mesh>
            </TransformControls>
          ) : (
            <mesh
              onClick={() => {
                onEntitySelect(entity.id);
              }}
              position={entity.position}
              rotation={entity.rotation}
              scale={entity.scale}
            >
              {geometry(entity.type)}
              <meshStandardMaterial color={entity.color} />
            </mesh>
          )}
        </group>
      ))}
      {/* background */}
      <primitive object={camera}>
        <mesh
          ref={backgroundRef}
          visible={false}
          position={[0, 0, -backgroundDistance]}
          onDoubleClick={() => {
            onEntitySelect(undefined);
            // todo: set values to 0 as well here
          }}
        >
          <planeGeometry args={[1, 1]} />
          <meshBasicMaterial />
        </mesh>
      </primitive>
    </>
  );
}

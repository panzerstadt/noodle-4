import { createRef, RefObject, useEffect } from "react";
import { useState } from "react";
import { Vector3 } from "three";
import { boxHeight } from "../App";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { forwardRef } from "react";

const speed = 0.15;
const ORIGINAL_BOX_SIZE = 3;

type Directions = "x" | "z"; // THREE.Vector3['x'] |  THREE.Vector3['z']

interface BoxProps {
  position: [number, number, number];
  size: [number, number, number];
  color: THREE.Color;
}

export const Box = forwardRef<JSX.IntrinsicElements["mesh"], BoxProps>(
  (
    {
      position = [0, 0, 0],
      size = [3, 1, 3],
      color = new THREE.Color("white"),
    },
    ref
  ) => {
    return (
      <mesh
        receiveShadow
        castShadow
        ref={ref}
        position={position as unknown as Vector3}
      >
        <boxGeometry args={size as [number, number, number]} />
        <meshLambertMaterial color={color} />
      </mesh>
    );
  }
);

interface Layer {
  geometry: JSX.Element;
  geometryRef: RefObject<JSX.IntrinsicElements["mesh"]>;
  direction: Directions;
}

interface Props {
  trigger?: boolean;
  start?: boolean;
  camera: THREE.OrthographicCamera;
}

export const Stack: React.FC<Props> = ({ trigger, camera, start }) => {
  const [stack, setStack] = useState<Layer[]>([]);

  const addLayer = (
    x: number,
    z: number,
    width: number,
    depth: number,
    direction: Directions
  ) => {
    const ref = createRef<JSX.IntrinsicElements["mesh"]>();
    const y = boxHeight * stack.length;

    const color = new THREE.Color(`hsl(${30 + stack.length * 4}, 100%, 50%)`);

    const layer = {
      geometry: (
        <Box
          ref={ref}
          position={[x, y, z]}
          size={[width, boxHeight, depth]}
          color={color}
        />
      ),
      geometryRef: ref,
      direction: direction,
    };

    setStack((p) => [...p, layer]);
  };

  //   useEffect(() => {
  //     addLayer(0, 0, 5, 5, "x");
  //   }, []);

  const handleAddLayer = (init = false) => {
    const isX = !!Math.round(Math.random());
    const nextX = !isX ? 0 : -10;
    const nextZ = isX ? 0 : -10;
    addLayer(
      init ? 0 : nextX,
      init ? 0 : nextZ,
      ORIGINAL_BOX_SIZE,
      ORIGINAL_BOX_SIZE,
      isX ? "x" : "z"
    );

    if (camera) {
      camera.position.setY(stack.length + 3);
      camera.lookAt(0, stack.length, 0);
    }
  };

  useEffect(() => {
    handleAddLayer(true);
  }, []);

  useEffect(() => {
    start && handleAddLayer();
  }, [start, trigger]);

  useFrame(() => {
    if (!start) return;

    const topLayer = stack[stack.length - 1];
    if (!topLayer) return;
    // @ts-ignore
    topLayer.geometryRef.current!.position[topLayer.direction] += speed;
  });

  return (
    <group>
      {stack.map((layer, i) => {
        return <group key={`box-${i}`}>{layer.geometry};</group>;
      })}
    </group>
  );
};

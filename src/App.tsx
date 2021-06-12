import React, { useRef } from "react";
import "./App.css";
import * as THREE from "three";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls, OrthographicCamera } from "@react-three/drei";
import { useEffect } from "react";
import { Stack } from "./components/Box";
import { useState } from "react";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

const debug = true;
export const stack = [];
export const boxHeight = 1;

function App() {
  const camera = useRef<THREE.OrthographicCamera>();
  const controls = useRef();

  useEffect(() => {
    if (!camera.current) return;

    camera.current?.position.set(1.5, 4, 3);
  }, [camera]);

  const [start, setStart] = useState(false);
  const [addLayer, toggleAddLayer] = useState(false);
  const handleAddLayer = () => {
    if (!start) setStart(true);
    toggleAddLayer((p) => !p);
  };

  return (
    <div
      className="App"
      onClick={handleAddLayer}
      style={{ height: "100vh", width: "100vw" }}
    >
      <Canvas
        shadows
        // camera={{ position: [1.5, 4, 3], zoom: 70, near: 0.0001 }}
        // orthographic
      >
        <OrthographicCamera
          position={[1.5, 4, 3]}
          zoom={70}
          near={0}
          makeDefault
          ref={camera}
        />
        <Stack camera={camera.current!} trigger={addLayer} start={start} />
        {/* <Box args={[3, 3, 3]} /> */}

        {/* <OrbitControls
          enabled={debug}
          camera={camera.current}
          ref={controls.current}
        /> */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[-3, 200, 300]} intensity={0.6} />
        <color attach="background" args={["lightblue"]} />
        <fog
          attach="fog"
          near={2}
          far={15}
          color={"lightblue" as unknown as THREE.Color}
        />
        <EffectComposer>
          <Bloom luminanceThreshold={0.1} luminanceSmoothing={2} />
        </EffectComposer>
        <axesHelper scale={5} />
      </Canvas>
    </div>
  );
}

export default App;

import React, { useState, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { TruckImage } from "../ui";
class Boundary extends Component {
  state = { error: false };
  static getDerivedStateFromError() {
    return { error: true };
  }
  render() {
    return this.state.error ? <TruckImage /> : this.props.children;
  }
}
function Box({ position, scale, color, ...props }) {
  return (
    <mesh position={position} scale={scale} castShadow {...props}>
      <boxGeometry />
      <meshStandardMaterial color={color} roughness={0.5} />
    </mesh>
  );
}
export default function TruckScene() {
  const [angle, setAngle] = useState(-0.45),
    [drag, setDrag] = useState(null);
  return (
    <Boundary>
      <div
        className="canvas-wrap"
        role="img"
        aria-label="Interactive original low-poly truck concept"
        onPointerDown={(e) => {
          setDrag(e.clientX);
          e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerMove={(e) => {
          if (drag !== null) {
            setAngle((a) => a + (e.clientX - drag) * 0.012);
            setDrag(e.clientX);
          }
        }}
        onPointerUp={() => setDrag(null)}
        onPointerCancel={() => setDrag(null)}
      >
        <Canvas
          frameloop="demand"
          dpr={[1, 1.5]}
          camera={{ position: [-7, 4.4, 8], fov: 38 }}
          fallback={<TruckImage />}
        >
          <ambientLight intensity={1.8} />
          <directionalLight position={[-4, 8, 5]} intensity={3} />
          <group rotation={[0, angle, 0]} position={[0, -0.6, 0]}>
            <Box
              position={[0.5, 1.8, 0]}
              scale={[3.8, 2.5, 1.9]}
              color="#f7f5f0"
            />
            <Box
              position={[0.5, 0.7, 1]}
              scale={[3.8, 0.3, 0.04]}
              color="#ff5a36"
            />
            <Box
              position={[-2.2, 1.15, 0]}
              scale={[1.5, 1.8, 1.9]}
              color="#ffffff"
            />
            <Box
              position={[-2.4, 1.65, 0]}
              scale={[1.3, 0.7, 1.95]}
              color="#30434b"
            />
            <Box
              position={[0, 0.35, 0]}
              scale={[6, 0.25, 1.7]}
              color="#222a2d"
            />
            <Box
              position={[-3, 1, 0]}
              scale={[0.07, 0.4, 1.3]}
              color="#e1e5e6"
            />
            {[-2.1, 1.65].flatMap((x) =>
              [-1, 1].map((z) => (
                <group
                  key={x + ":" + z}
                  position={[x, 0.4, z]}
                  rotation={[Math.PI / 2, 0, 0]}
                >
                  <mesh>
                    <cylinderGeometry args={[0.55, 0.55, 0.34, 24]} />
                    <meshStandardMaterial color="#202323" />
                  </mesh>
                  <mesh position={[0, 0.19, 0]}>
                    <cylinderGeometry args={[0.29, 0.29, 0.04, 20]} />
                    <meshStandardMaterial
                      color="#969d9d"
                      metalness={0.7}
                      roughness={0.3}
                    />
                  </mesh>
                </group>
              )),
            )}
          </group>
        </Canvas>
        <div className="rotation-controls">
          <button
            onClick={() => setAngle((a) => a - 0.4)}
            aria-label="Rotate truck left"
          >
            ←
          </button>
          <button
            onClick={() => setAngle((a) => a + 0.4)}
            aria-label="Rotate truck right"
          >
            →
          </button>
        </div>
      </div>
    </Boundary>
  );
}

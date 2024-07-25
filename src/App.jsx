import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";
import { ScrollControls } from "@react-three/drei";
import { EffectComposer, Noise } from "@react-three/postprocessing";
import { Overlay } from "./components/Overlay";

function App() {
  return (
    <>
      <Canvas>
        <color attach="background" args={["#ececec"]} />
        <ScrollControls pages={20} damping={0.5}>
          <Experience />
        </ScrollControls>
        <EffectComposer>
          {/* Add effects here */}
          <Noise opacity={0.2} />
        </EffectComposer>
      </Canvas>
      <Overlay />
    </>
  );
}

export default App;

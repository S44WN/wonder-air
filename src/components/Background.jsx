import { Environment, Sphere } from "@react-three/drei";
import { Gradient } from "lamina";
import { LayerMaterial } from "lamina";

import * as THREE from "three";

const Background = () => {
  return (
    <>
      <Environment preset="sunset" />
      <Sphere scale={[100, 100, 100]} rotation-y={Math.PI / 2}>
        <LayerMaterial
          lighting="physical"
          transmission={1}
          side={THREE.BackSide}
        >
          <Gradient
            colorA={"#357ca1"}
            colorB={"ivory"}
            axes={"y"}
            start={0}
            end={-0.5}
          />
        </LayerMaterial>
      </Sphere>
    </>
  );
};

export default Background;

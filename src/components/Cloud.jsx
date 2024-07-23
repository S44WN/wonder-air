/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.4.1 public/models/cloud/model.glb 
*/

import React from "react";
import { useGLTF } from "@react-three/drei";

export function Cloud({ opacity, ...props }) {
  const { nodes, materials } = useGLTF("./models/cloud/model.glb");

  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Node.geometry}>
        <meshStandardMaterial
          {...materials["lambert2SG.001"]}
          transparent
          opacity={opacity}
        />
      </mesh>
    </group>
  );
}

useGLTF.preload("./models/cloud/model.glb");

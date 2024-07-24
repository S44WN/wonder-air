import {
  Float,
  PerspectiveCamera,
  Text,
  useScroll,
  OrbitControls,
} from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Airplane } from "./Airplane";
import Background from "./Background";
import { Cloud } from "./Cloud";

const LINE_NB_POINTS = 1000;
const CURVE_DISTANCE = 250;
const CURVE_AHEAD_CAMERA = 0.008;
const CURVE_AHEAD_AIRPLANE = 0.02;
const AIRPLANE_MAX_ANGLE = 35;

export const Experience = () => {
  const curve = useMemo(() => {
    return new THREE.CatmullRomCurve3(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -CURVE_DISTANCE),
        new THREE.Vector3(100, 0, -2 * CURVE_DISTANCE),
        new THREE.Vector3(-100, 0, -3 * CURVE_DISTANCE),
        new THREE.Vector3(100, 0, -4 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -5 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -6 * CURVE_DISTANCE),
        new THREE.Vector3(0, 0, -7 * CURVE_DISTANCE),
      ],
      false,
      "catmullrom",
      0.5
    );
  }, []);

  const linePoints = useMemo(() => {
    return curve.getPoints(LINE_NB_POINTS);
  }, [curve]);

  const shape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, -0.08);
    shape.lineTo(0, 0.08);

    return shape;
  }, [curve]);

  const cameraGroup = useRef();
  const scroll = useScroll();

  useFrame((_state, delta) => {
    const scrollOffset = Math.max(0, scroll.offset);

    const curPoint = curve.getPoint(scrollOffset);

    //follow the curve points
    cameraGroup.current.position.lerp(curPoint, delta * 24);

    //make the airplane look at the point ahead
    const lookAtPoint = curve.getPoint(
      Math.min(scrollOffset + CURVE_AHEAD_CAMERA, 1)
    );

    const currentLookAt = cameraGroup.current.getWorldDirection(
      new THREE.Vector3()
    );

    const targetLookAt = new THREE.Vector3()
      .subVectors(curPoint, lookAtPoint)
      .normalize();

    const lookAt = currentLookAt.lerp(targetLookAt, delta * 24);
    cameraGroup.current.lookAt(
      cameraGroup.current.position.clone().add(lookAt)
    );

    //airplane rotation
    const tangent = curve.getTangent(scrollOffset + CURVE_AHEAD_AIRPLANE);

    const nonLerpLookat = new THREE.Group();
    nonLerpLookat.position.copy(curPoint);
    nonLerpLookat.lookAt(nonLerpLookat.position.clone().add(targetLookAt));

    tangent.applyAxisAngle(
      new THREE.Vector3(0, 1, 0),
      -nonLerpLookat.rotation.y
    );

    let angle = Math.atan2(-tangent.z, tangent.x);
    angle = -Math.PI / 2 + angle;

    let angleDegrees = (angle * 180) / Math.PI;
    angleDegrees *= 2.4;

    //limit plane anlge
    if (angleDegrees > 0) {
      angleDegrees = Math.max(angleDegrees, -AIRPLANE_MAX_ANGLE);
    }
    if (angleDegrees < 0) {
      angleDegrees = Math.min(angleDegrees, AIRPLANE_MAX_ANGLE);
    }

    angle = (angleDegrees * Math.PI) / 180;

    const targetAirplaneQuaternion = new THREE.Quaternion().setFromEuler(
      new THREE.Euler(
        airplane.current.rotation.x,
        airplane.current.rotation.y,
        angle
      )
    );

    airplane.current.quaternion.slerp(targetAirplaneQuaternion, delta * 24);
  });

  const airplane = useRef();

  return (
    <>
      {/* <OrbitControls /> */}
      <group ref={cameraGroup}>
        <Background />
        <PerspectiveCamera position={[0, 0, 5]} fov={30} makeDefault />
        <group ref={airplane}>
          <Float floatIntensity={1} speed={1.5} rotationIntensity={0.5}>
            <Airplane
              rotation-y={Math.PI / 2}
              scale={[0.2, 0.2, 0.2]}
              position-y={0.1}
            />
          </Float>
        </group>
      </group>

      <group position={[-3, 0, -100]}>
        <Text
          color={"ivory"}
          fontSize={0.52}
          maxWidth={2.5}
          anchorX={"left"}
          anchorY={"middle"}
          font="./fonts/bright-melody.woff"
        >
          Welcome Aboard!
        </Text>
        <Text
          color={"ivory"}
          fontSize={0.2}
          maxWidth={2.5}
          lineHeight={1}
          anchorX={"left"}
          anchorY={"top"}
          position-y={-0.66}
          font="./fonts/ClashDisplay-Variable.woff"
        >
          Ladies and gentlemen, Please sit back, relax, and enjoy the flight.
        </Text>
      </group>

      <group position={[-10, 1, -200]}>
        <Text
          color={"ivory"}
          fontSize={0.52}
          maxWidth={2.5}
          anchorX={"left"}
          anchorY={"center"}
          font="./fonts/bright-melody.woff"
        >
          Services
        </Text>
        <Text
          color={"ivory"}
          fontSize={0.2}
          maxWidth={2.5}
          anchorX={"left"}
          anchorY={"top"}
          position-y={-0.66}
          font="./fonts/ClashDisplay-Variable.woff"
        >
          Want a drink? let us know, we have wide ranges of drink!
        </Text>
      </group>

      {/* LINE */}
      <group position-y={-2}>
        <mesh>
          <extrudeGeometry
            args={[
              shape,
              {
                steps: LINE_NB_POINTS,
                bevelEnabled: false,
                extrudePath: curve,
              },
            ]}
          />
          <meshStandardMaterial color={"white"} opacity={1} transparent />
        </mesh>
      </group>

      {/* CLOUDS */}
      <Cloud scale={[1, 1, 1.5]} position={[-3.5, -1.2, -7]} />
      <Cloud scale={[1, 1, 2]} position={[3.5, -1, -10]} rotation-y={Math.PI} />
      <Cloud
        scale={[1, 1, 1]}
        rotation-y={Math.PI / 3}
        position={[-3.5, 0.2, -12]}
      />
      <Cloud scale={[1, 1, 1]} position={[3.5, 0.2, -12]} />
      <Cloud
        scale={[0.4, 0.4, 0.4]}
        rotation-y={Math.PI / 9}
        position={[1, -0.2, -12]}
      />
      <Cloud scale={[0.3, 0.5, 2]} position={[-4, -0.5, -53]} />
      <Cloud scale={[0.8, 0.8, 0.8]} position={[-1, -1.5, -100]} />
    </>
  );
};

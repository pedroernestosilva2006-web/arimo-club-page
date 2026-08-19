import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import { useAspect, useTexture } from "@react-three/drei";
import { useMemo, useRef, useState, useEffect } from "react";
import * as THREE from "three/webgpu";
import { bloom } from "three/examples/jsm/tsl/display/BloomNode.js";
import {
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
} from "three/tsl";

import heroAsset from "@/assets/wolf-hero.jpg.asset.json";
import depthAsset from "@/assets/wolf-depth.jpg.asset.json";

extend(THREE as never);

const WIDTH = 1080;
const HEIGHT = 1927;

function PostProcessing({ strength = 0.7, threshold = 0.9 }: { strength?: number; threshold?: number }) {
  const { gl, scene, camera } = useThree();

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as never);
    const scenePass = pass(scene, camera);
    const scenePassColor = scenePass.getTextureNode("output");
    const bloomPass = bloom(scenePassColor, strength, 0.5, threshold);
    postProcessing.outputNode = scenePassColor.add(bloomPass);
    return postProcessing;
  }, [camera, gl, scene, strength, threshold]);

  useFrame(() => {
    render.renderAsync();
  }, 1);

  return null;
}

function Scene() {
  const [rawMap, depthMap] = useTexture([heroAsset.url, depthAsset.url]);
  const meshRef = useRef<THREE.Mesh | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) setVisible(true);
  }, [rawMap, depthMap]);

  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);

    const strength = 0.012;
    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));

    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);

    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));

    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);

    const flow = oneMinus(smoothstep(0, 0.02, abs(tDepthMap.sub(uProgress))));
    // Monochrome scan particles (no color accent).
    const mask = dot.mul(flow).mul(vec3(8, 8, 8));

    const final = blendScreen(tMap, mask);

    const nodeMaterial = new THREE.MeshBasicNodeMaterial({
      colorNode: final,
      transparent: true,
      opacity: 0,
    });

    return { material: nodeMaterial, uniforms: { uPointer, uProgress } };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  // Built imperatively so this module needs no react-three JSX intrinsics.
  const mesh = useMemo(() => new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material), [material]);

  useEffect(() => {
    meshRef.current = mesh;
    return () => {
      mesh.geometry.dispose();
    };
  }, [mesh]);

  const scaleFactor = 0.85;
  mesh.scale.set(w * scaleFactor, h * scaleFactor, 1);

  useFrame(({ clock, pointer }) => {
    uniforms.uProgress.value = Math.sin(clock.getElapsedTime() * 0.35) * 0.5 + 0.5;
    uniforms.uPointer.value = pointer;

    const mat = mesh.material as THREE.Material;
    mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.06);
  });

  return <primitive object={mesh} />;
}

export default function HeroFuturistic() {
  return (
    <Canvas
      flat
      gl={async (props) => {
        const renderer = new THREE.WebGPURenderer(props as never);
        await renderer.init();
        return renderer;
      }}
    >
      <Scene />
      <PostProcessing />
    </Canvas>
  );
}

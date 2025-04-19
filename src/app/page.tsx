"use client";

import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function Home() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // The mountRef is a reference to the DOM element where the Three.js scene will be mounted.
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // Get size of container (right half)
    const { clientWidth, clientHeight } = currentMount;

    // Create a scene
    const scene = new THREE.Scene();

    // create the camera
    /*
      The camera is set to perspective mode with a field of view of 75 degrees,
      an aspect ratio based on the container's dimensions, and a near and far clipping plane.
      The camera is positioned at (30, 10, 0) to start from the side.
    */
    const camera = new THREE.PerspectiveCamera(
      75,
      clientWidth / clientHeight,
      0.1,
      1000
    );
    camera.position.set(30, 10, 0); // Start from the side

    // Create a renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio); // set the aspect ratio
    renderer.setSize(clientWidth, clientHeight);
    currentMount.appendChild(renderer.domElement);

    // Create a torus
    const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
    const material = new THREE.MeshStandardMaterial({ color: 0x11ff00 });
    const torus = new THREE.Mesh(geometry, material);
    scene.add(torus);

    // Create a plane
    // 1. Create geometry (big plane)
    const floorGeometry = new THREE.PlaneGeometry(200, 200);

    // 2. Create a material (you can make it look like a grid, matte, etc.)
    const floorMaterial = new THREE.MeshStandardMaterial({
      color: 0x808080,
      side: THREE.DoubleSide, // So it's visible from both directions
    });

    // Create the floor mesh
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2; // 90 degrees
    floor.position.y = -12; // Move it below your object
    scene.add(floor);

    // create the light source
    const pointLight = new THREE.PointLight(0xffffff, 2.5, 0, 0.7);
    pointLight.position.set(20, 10, 10);
    scene.add(pointLight);

    // add an ambient light
    // scene.add(new THREE.AmbientLight(0xffffff));

    // Create a grid helper
    // const gridHelper = new THREE.GridHelper(200, 50);
    // scene.add(gridHelper);

    // Create an axes helper
    const axesHelper = new THREE.AxesHelper(5);
    scene.add(axesHelper);

    // create a light helper
    const lightHelper = new THREE.PointLightHelper(pointLight, 1);
    scene.add(lightHelper);

    // add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    controls.autoRotate = true; // Let it rotate automatically
    controls.autoRotateSpeed = 2.0;
    controls.maxPolarAngle = Math.PI / 2;

    /*
      Animation loop
      requestAnimationFrame is a method that tells the browser that you wish to perform an animation
      and requests that the browser calls a specified function to update an animation before the next repaint.
      The animate function will be called recursively.
    */
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update(); // Handles auto-rotate and user input
      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mountRef.current) return;
      const { clientWidth, clientHeight } = mountRef.current;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      currentMount.removeChild(renderer.domElement);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen w-screen">
      {/* Left Half */}
      <div className="basis-1/2 bg-gray-900 text-white flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Welcome to{" "}
          <code>
            <em>three.js</em>
          </code>
        </h1>
      </div>

      {/* Right Half - full 3D scene */}
      <div className="basis-1/2 relative">
        <div
          ref={mountRef}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}

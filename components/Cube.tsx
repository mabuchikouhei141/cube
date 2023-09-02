import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ThreeDPage = () => {
  const canvasRef = useRef(null);
  type CubeInfo = {
    mesh: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial[]>;
    rotationSpeedX: number;
    rotationSpeedY: number;
  };
  
  const cubes = useRef<CubeInfo[]>([]);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = canvasRef.current ? new THREE.WebGLRenderer({ canvas: canvasRef.current }) : new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.z = 30;

    const textureLoader = new THREE.TextureLoader();
    const texturePaths = Array.from({ length: 46 }, (_, i) => `/img/img${i + 1}.jpeg`);
    const textures = texturePaths.map(path => textureLoader.load(path));

    const geometry = new THREE.BoxGeometry(5, 5, 5);

    for (let i = 0; i < 210; i++) {
      const selectedTextures: THREE.Texture[] = [];
      while (selectedTextures.length < 6) {
        const randomTexture = textures[Math.floor(Math.random() * textures.length)];
        if (!selectedTextures.includes(randomTexture)) {
          selectedTextures.push(randomTexture);
        }
      }
      const materials = selectedTextures.map(texture => new THREE.MeshBasicMaterial({ map: texture }));
      const cube = new THREE.Mesh(geometry, materials);
      cube.position.x = (Math.random() - 0.5) * 100; 
      cube.position.y = (Math.random() - 0.5) * 100; 
      cube.position.z = (Math.random() - 0.5) * 100; 
      scene.add(cube);
      cubes.current.push({
        mesh: cube,
        rotationSpeedX: Math.random() * 0.02,
        rotationSpeedY: Math.random() * 0.02
      });
    }

    const animate = () => {
      requestAnimationFrame(animate);
      cubes.current.forEach(cubeInfo => {
        cubeInfo.mesh.rotation.x += cubeInfo.rotationSpeedX;
        cubeInfo.mesh.rotation.y += cubeInfo.rotationSpeedY;
      });
      renderer.render(scene, camera);
    };

    animate();
  }, []);

  return <canvas ref={canvasRef} />;
};

export default ThreeDPage;

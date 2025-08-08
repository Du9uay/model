import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface Basic3DViewerProps {
  className?: string;
}

const Basic3DViewer: React.FC<Basic3DViewerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(10, 10, 10);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Grid
    const gridHelper = new THREE.GridHelper(20, 20, 0x444444, 0x222222);
    scene.add(gridHelper);

    // Create a complex model from basic shapes (simulating a welding machine)
    const group = new THREE.Group();

    // Base platform
    const baseGeometry = new THREE.BoxGeometry(8, 1, 6);
    const baseMaterial = new THREE.MeshPhongMaterial({ color: 0x404040 });
    const base = new THREE.Mesh(baseGeometry, baseMaterial);
    base.position.y = 0.5;
    base.castShadow = true;
    base.receiveShadow = true;
    group.add(base);

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(4, 4, 3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ color: 0x606060 });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.set(0, 3, 0);
    body.castShadow = true;
    group.add(body);

    // Vertical column
    const columnGeometry = new THREE.CylinderGeometry(0.5, 0.5, 6);
    const columnMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
    const column = new THREE.Mesh(columnGeometry, columnMaterial);
    column.position.set(-2, 3, 0);
    column.castShadow = true;
    group.add(column);

    // Arm
    const armGeometry = new THREE.BoxGeometry(3, 0.5, 0.5);
    const armMaterial = new THREE.MeshPhongMaterial({ color: 0x909090 });
    const arm = new THREE.Mesh(armGeometry, armMaterial);
    arm.position.set(-0.5, 5.5, 0);
    arm.rotation.z = -0.2;
    arm.castShadow = true;
    group.add(arm);

    // Laser head
    const laserGeometry = new THREE.ConeGeometry(0.3, 1, 8);
    const laserMaterial = new THREE.MeshPhongMaterial({ color: 0xff3333 });
    const laser = new THREE.Mesh(laserGeometry, laserMaterial);
    laser.position.set(1, 5, 0);
    laser.rotation.z = Math.PI;
    laser.castShadow = true;
    group.add(laser);

    // Control panel
    const panelGeometry = new THREE.BoxGeometry(1, 1.5, 0.1);
    const panelMaterial = new THREE.MeshPhongMaterial({ color: 0x333366 });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(2, 3, 1.55);
    group.add(panel);

    // Add some detail boxes
    for (let i = 0; i < 3; i++) {
      const detailGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
      const detailMaterial = new THREE.MeshPhongMaterial({ 
        color: new THREE.Color().setHSL(0.6, 0.5, 0.5)
      });
      const detail = new THREE.Mesh(detailGeometry, detailMaterial);
      detail.position.set(-3 + i * 0.5, 1.5, 2);
      detail.castShadow = true;
      group.add(detail);
    }

    scene.add(group);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      
      // Animate the laser
      laser.rotation.y += 0.02;
      
      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      if (!containerRef.current) return;
      camera.aspect = containerRef.current.clientWidth / containerRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-400">
        <div>极耳激光焊接设备 3D 模型演示</div>
        <div className="text-xs mt-1">鼠标左键: 旋转 | 鼠标右键: 平移 | 滚轮: 缩放</div>
      </div>
    </div>
  );
};

export default Basic3DViewer;
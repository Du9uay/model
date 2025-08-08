import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

interface FallbackModelProps {
  className?: string;
}

const FallbackModel: React.FC<FallbackModelProps> = ({ className = '' }) => {
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
    camera.position.set(5, 5, 5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // 创建一个简单的焊接设备模型表示
    const group = new THREE.Group();

    // 主体 - 代表焊接机主体
    const bodyGeometry = new THREE.BoxGeometry(2, 1.5, 3);
    const bodyMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x4a5568,
      specular: 0x222222,
      shininess: 80
    });
    const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
    body.position.y = 0.75;
    body.castShadow = true;
    body.receiveShadow = true;
    group.add(body);

    // 激光头 - 代表激光焊接头
    const laserHeadGeometry = new THREE.CylinderGeometry(0.2, 0.3, 1, 8);
    const laserHeadMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xe53e3e,
      emissive: 0xff0000,
      emissiveIntensity: 0.2
    });
    const laserHead = new THREE.Mesh(laserHeadGeometry, laserHeadMaterial);
    laserHead.position.set(0, 1.5, 1);
    laserHead.rotation.x = Math.PI / 2;
    laserHead.castShadow = true;
    group.add(laserHead);

    // 工作台
    const tableGeometry = new THREE.BoxGeometry(3, 0.1, 4);
    const tableMaterial = new THREE.MeshPhongMaterial({ color: 0x2d3748 });
    const table = new THREE.Mesh(tableGeometry, tableMaterial);
    table.position.y = -0.05;
    table.receiveShadow = true;
    group.add(table);

    // 支架
    const supportGeometry = new THREE.CylinderGeometry(0.1, 0.1, 2);
    const supportMaterial = new THREE.MeshPhongMaterial({ color: 0x718096 });
    
    for (let i = 0; i < 4; i++) {
      const support = new THREE.Mesh(supportGeometry, supportMaterial);
      const x = i < 2 ? -1.4 : 1.4;
      const z = i % 2 === 0 ? -1.9 : 1.9;
      support.position.set(x, -1, z);
      support.castShadow = true;
      group.add(support);
    }

    // 控制面板
    const panelGeometry = new THREE.BoxGeometry(0.8, 1, 0.1);
    const panelMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x1a202c,
      emissive: 0x4299e1,
      emissiveIntensity: 0.1
    });
    const panel = new THREE.Mesh(panelGeometry, panelMaterial);
    panel.position.set(1.5, 0.75, 0);
    panel.rotation.y = -Math.PI / 4;
    group.add(panel);

    // 添加一些细节 - 按钮
    const buttonGeometry = new THREE.SphereGeometry(0.05, 8, 8);
    const buttonMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x48bb78,
      emissive: 0x48bb78,
      emissiveIntensity: 0.5
    });
    
    for (let i = 0; i < 3; i++) {
      const button = new THREE.Mesh(buttonGeometry, buttonMaterial);
      button.position.set(1.45, 0.9 - i * 0.2, 0.1);
      button.rotation.y = -Math.PI / 4;
      group.add(button);
    }

    scene.add(group);

    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      
      // 激光头动画
      laserHead.rotation.z += 0.01;
      const time = Date.now() * 0.001;
      (laserHead.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.2 + Math.sin(time * 3) * 0.1;
      
      controls.update();
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
      cancelAnimationFrame(animationId);
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, []);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-400">
        <div>极耳激光焊接设备 - 示意模型</div>
        <div className="text-xs mt-1">鼠标左键: 旋转 | 鼠标右键: 平移 | 滚轮: 缩放</div>
      </div>
      <div className="absolute top-4 left-4 bg-yellow-600/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-white">
        <div className="font-semibold">⚠️ 简化模型</div>
        <div className="mt-1">完整模型请克隆仓库到本地查看</div>
      </div>
    </div>
  );
};

export default FallbackModel;
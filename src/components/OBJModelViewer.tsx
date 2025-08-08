import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { LargeOBJLoader } from '../utils/LargeOBJLoader';
import { getModelPath, handleModelLoadError } from '../utils/ModelLoader';
import FallbackModel from './FallbackModel';

interface OBJModelViewerProps {
  className?: string;
}

const OBJModelViewer: React.FC<OBJModelViewerProps> = ({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  
  // 检测是否在GitHub Pages上（不支持大文件）
  const isGitHubPages = window.location.hostname.includes('github.io');
  // 检测是否在Vercel上（支持大文件）
  const isVercel = window.location.hostname.includes('vercel.app');

  useEffect(() => {
    // 如果在GitHub Pages上，不执行OBJ加载逻辑
    if (isGitHubPages) return;
    if (!containerRef.current) return;

    console.log('Initializing OBJ model viewer');

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // Camera
    const camera = new THREE.PerspectiveCamera(
      50,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      10000
    );
    camera.position.set(500, 500, 500);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 100);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
    
    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight2.position.set(-100, 100, -100);
    scene.add(directionalLight2);


    // Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.5;

    // Load OBJ with MTL
    const mtlLoader = new MTLLoader();
    const objLoader = new LargeOBJLoader();

    // 获取模型路径
    const modelPaths = getModelPath();
    const mtlPath = modelPaths.mtl;
    const objPath = modelPaths.obj;

    console.log('Loading MTL from:', mtlPath);
    console.log('Loading OBJ from:', objPath);
    console.log('Note: OBJ file is 251MB, using chunked loading...');

    // 先尝试加载MTL材质
    mtlLoader.load(
      mtlPath,
      async (materials) => {
        console.log('MTL loaded successfully');
        materials.preload();
        objLoader.setMaterials(materials);
        
        try {
          // 使用分块加载OBJ
          const object = await objLoader.loadChunked(
            objPath,
            (loaded, total) => {
              const percentComplete = (loaded / total) * 100;
              setProgress(Math.round(percentComplete));
              console.log(`Loading OBJ: ${percentComplete.toFixed(2)}%`);
            }
          );
          
          console.log('OBJ loaded successfully:', object);
          
          // 修正模型方向 - 绕X轴旋转180度
          object.rotateX(Math.PI);
          
          // 设置阴影
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
            }
          });
          
          // 计算模型的边界
          const box = new THREE.Box3();
          let hasValidBounds = false;
          
          try {
            box.setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            
            // 检查边界是否有效
            if (isFinite(size.x) && isFinite(size.y) && isFinite(size.z) &&
                size.x > 0 && size.y > 0 && size.z > 0) {
              hasValidBounds = true;
              
              const center = box.getCenter(new THREE.Vector3());
              console.log('Model size:', size);
              console.log('Model center:', center);
              
              // 移动模型到原点
              object.position.sub(center);
              
              // 根据模型大小调整缩放
              const maxDim = Math.max(size.x, size.y, size.z);
              const targetSize = 300;
              const scale = targetSize / maxDim;
              object.scale.setScalar(scale);
              console.log('Applied scale:', scale);
            }
          } catch (e) {
            console.error('Error computing bounding box:', e);
          }
          
          if (!hasValidBounds) {
            // 使用默认位置和缩放
            console.warn('Using default positioning');
            object.scale.setScalar(0.1);
          }
          
          scene.add(object);
          
          // 调整相机位置
          camera.position.set(400, 300, 400);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.update();
          
          setLoading(false);
          console.log('Model loaded and positioned successfully');
        } catch (err) {
          console.error('Error loading OBJ:', err);
          handleModelLoadError(err);
          setError('OBJ文件加载失败');
          setLoading(false);
        }
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          console.log(`Loading MTL: ${percentComplete.toFixed(2)}%`);
        }
      },
      async (err) => {
        console.warn('MTL加载失败，尝试直接加载OBJ:', err);
        
        // 如果MTL加载失败，直接加载OBJ
        try {
          const object = await objLoader.loadChunked(
            objPath,
            (loaded, total) => {
              const percentComplete = (loaded / total) * 100;
              setProgress(Math.round(percentComplete));
              console.log(`Loading OBJ without MTL: ${percentComplete.toFixed(2)}%`);
            }
          );
          
          console.log('OBJ loaded without MTL');
          
          // 修正模型方向 - 绕X轴旋转180度
          object.rotateX(Math.PI);
          
          // 设置阴影和默认材质
          object.traverse((child) => {
            if (child instanceof THREE.Mesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              // 添加默认材质
              if (!child.material) {
                child.material = new THREE.MeshPhongMaterial({
                  color: 0x808080,
                  specular: 0x222222,
                  shininess: 100
                });
              }
            }
          });
          
          // 计算模型的边界
          const box = new THREE.Box3();
          let hasValidBounds = false;
          
          try {
            box.setFromObject(object);
            const size = box.getSize(new THREE.Vector3());
            
            if (isFinite(size.x) && isFinite(size.y) && isFinite(size.z) &&
                size.x > 0 && size.y > 0 && size.z > 0) {
              hasValidBounds = true;
              const center = box.getCenter(new THREE.Vector3());
              object.position.sub(center);
              const maxDim = Math.max(size.x, size.y, size.z);
              const scale = 300 / maxDim;
              object.scale.setScalar(scale);
            }
          } catch (e) {
            console.error('Error computing bounding box:', e);
          }
          
          if (!hasValidBounds) {
            console.warn('Using default positioning');
            object.scale.setScalar(0.1);
          }
          
          scene.add(object);
          
          camera.position.set(400, 300, 400);
          camera.lookAt(0, 0, 0);
          controls.target.set(0, 0, 0);
          controls.update();
          
          setLoading(false);
        } catch (err) {
          console.error('Error loading OBJ without MTL:', err);
          handleModelLoadError(err);
          setError('无法加载3D模型（GitHub Pages可能不支持大文件）');
          setLoading(false);
        }
      }
    );

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
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
  }, [isGitHubPages]);

  // 如果在GitHub Pages上，使用备用模型（Vercel支持真实模型）
  if (isGitHubPages) {
    return <FallbackModel className={className} />;
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full animate-spin mx-auto mb-4" />
            <div className="text-white text-lg">加载3D模型中...</div>
            {progress > 0 && (
              <div className="mt-2">
                <div className="w-48 bg-gray-700 rounded-full h-2 mx-auto">
                  <div 
                    className="bg-blue-500 h-full rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-gray-400 text-sm mt-1">{progress}%</div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/75">
          <div className="text-center text-red-400">
            <div className="text-4xl mb-4">⚠️</div>
            <div className="text-lg">{error}</div>
            <div className="text-sm mt-2 text-gray-400">请检查控制台获取详细信息</div>
          </div>
        </div>
      )}
      
      {!loading && !error && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-400">
          <div>JH-总装 极耳激光焊接设备</div>
          <div className="text-xs mt-1">鼠标左键: 旋转 | 鼠标右键: 平移 | 滚轮: 缩放</div>
        </div>
      )}
    </div>
  );
};

export default OBJModelViewer;
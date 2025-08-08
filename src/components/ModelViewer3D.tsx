import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { motion, AnimatePresence } from 'framer-motion';

interface ModelViewer3DProps {
  modelPath: string;
  mtlPath?: string;
  className?: string;
}

const ModelViewer3D: React.FC<ModelViewer3DProps> = ({
  modelPath,
  mtlPath,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const width = containerRef.current.clientWidth;
    const height = containerRef.current.clientHeight;

    // 初始化场景
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x1a1a1a);

    // 初始化相机
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(15, 15, 15);

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: false,
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    containerRef.current.appendChild(renderer.domElement);

    // 添加灯光
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(10, 10, 10);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight2.position.set(-10, 10, -10);
    scene.add(directionalLight2);

    // 添加网格
    const gridHelper = new THREE.GridHelper(30, 30, 0x444444, 0x222222);
    scene.add(gridHelper);

    // 初始化控制器
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1;

    // 验证和修复模型
    const validateAndFixModel = (object: THREE.Object3D) => {
      let hasValidGeometry = false;
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          const geometry = child.geometry;
          
          if (geometry instanceof THREE.BufferGeometry) {
            const positionAttribute = geometry.getAttribute('position');
            
            if (positionAttribute) {
              // 检查并修复NaN值
              const positions = positionAttribute.array;
              let hasNaN = false;
              
              for (let i = 0; i < positions.length; i++) {
                if (isNaN(positions[i]) || !isFinite(positions[i])) {
                  positions[i] = 0;
                  hasNaN = true;
                }
              }
              
              if (hasNaN) {
                console.warn('Fixed NaN values in geometry');
                positionAttribute.needsUpdate = true;
              }
              
              // 重新计算法线
              if (!geometry.getAttribute('normal')) {
                geometry.computeVertexNormals();
              }
              
              hasValidGeometry = true;
            }
          }
          
          // 确保有材质
          if (!child.material) {
            child.material = new THREE.MeshPhongMaterial({ 
              color: 0x808080,
              specular: 0x111111,
              shininess: 200
            });
          }
          
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
      
      return hasValidGeometry;
    };

    // 处理模型加载成功
    const onLoadSuccess = (object: THREE.Object3D) => {
      console.log('Model loaded, validating...');
      
      // 验证模型
      if (!validateAndFixModel(object)) {
        console.error('Model has no valid geometry');
        setError('模型无有效几何体');
        setLoading(false);
        return;
      }
      
      // 计算模型边界
      const box = new THREE.Box3();
      try {
        box.setFromObject(object);
      } catch (e) {
        console.error('Error computing bounding box:', e);
        // 如果计算失败，使用手动设置的默认值
        box.set(
          new THREE.Vector3(-10, -10, -10),
          new THREE.Vector3(10, 10, 10)
        );
      }
      
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      
      // 检查尺寸是否有效
      if (size.x === 0 || size.y === 0 || size.z === 0 || 
          !isFinite(size.x) || !isFinite(size.y) || !isFinite(size.z)) {
        console.warn('Invalid model size, using default');
        size.set(20, 20, 20);
      }
      
      // 移动模型到原点
      object.position.sub(center);
      
      // 缩放模型
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 10 / maxDim : 1;
      object.scale.setScalar(scale);
      
      scene.add(object);
      
      // 调整相机位置
      const distance = 20;
      camera.position.set(distance, distance * 0.7, distance);
      camera.lookAt(0, 0, 0);
      controls.target.set(0, 0, 0);
      controls.update();
      
      console.log('Model successfully loaded and positioned');
      setLoading(false);
      setError(null);
    };

    const onError = (err: any) => {
      console.error('Error loading model:', err);
      setError('模型加载失败');
      setLoading(false);
    };

    // 判断文件类型并加载
    const fileExtension = modelPath.split('.').pop()?.toLowerCase();
    
    if (fileExtension === 'obj') {
      const objLoader = new OBJLoader();
      
      if (mtlPath) {
        const mtlLoader = new MTLLoader();
        
        // 设置材质路径
        const mtlDirectory = mtlPath.substring(0, mtlPath.lastIndexOf('/') + 1);
        mtlLoader.setPath(mtlDirectory);
        
        mtlLoader.load(
          mtlPath.substring(mtlPath.lastIndexOf('/') + 1),
          (materials) => {
            console.log('MTL loaded');
            materials.preload();
            objLoader.setMaterials(materials);
            objLoader.load(modelPath, onLoadSuccess, undefined, onError);
          },
          undefined,
          (err) => {
            console.warn('MTL load failed, loading OBJ without materials:', err);
            objLoader.load(modelPath, onLoadSuccess, undefined, onError);
          }
        );
      } else {
        objLoader.load(modelPath, onLoadSuccess, undefined, onError);
      }
    } else if (fileExtension === 'glb' || fileExtension === 'gltf') {
      const gltfLoader = new GLTFLoader();
      const dracoLoader = new DRACOLoader();
      dracoLoader.setDecoderPath('/draco/gltf/');
      gltfLoader.setDRACOLoader(dracoLoader);
      
      gltfLoader.load(
        modelPath,
        (gltf) => {
          console.log('GLTF loaded');
          onLoadSuccess(gltf.scene);
        },
        undefined,
        onError
      );
    } else {
      setError('不支持的文件格式');
      setLoading(false);
    }

    // 动画循环
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 处理窗口大小变化
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener('resize', handleResize);

    // 清理
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
      const container = containerRef.current;
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [modelPath, mtlPath]);

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div ref={containerRef} className="w-full h-full" />
      
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm"
          >
            <div className="text-center">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                className="w-16 h-16 border-4 border-t-transparent border-blue-500 rounded-full mx-auto mb-4"
              />
              <p className="text-white text-lg">加载3D模型中...</p>
            </div>
          </motion.div>
        )}
        
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-900/90 backdrop-blur-sm"
          >
            <div className="text-center text-red-400 max-w-md p-6">
              <div className="text-4xl mb-4">⚠️</div>
              <p className="text-lg">{error}</p>
              <p className="text-sm mt-2 text-gray-400">请检查模型文件</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!loading && !error && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-gray-900/80 backdrop-blur-sm rounded-lg px-4 py-2 text-xs text-gray-400"
        >
          <div>鼠标左键: 旋转 | 鼠标右键: 平移 | 滚轮: 缩放</div>
        </motion.div>
      )}
    </div>
  );
};

export default ModelViewer3D;
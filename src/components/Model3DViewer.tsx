import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment';
import { motion } from 'framer-motion';

interface Model3DViewerProps {
  modelPath: string;
  width?: number;
  height?: number;
  autoRotate?: boolean;
}

const Model3DViewer: React.FC<Model3DViewerProps> = ({
  modelPath,
  width = 600,
  height = 400,
  autoRotate = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0a);
    scene.fog = new THREE.Fog(0x0a0a0a, 10, 100);

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      45,
      width / height,
      0.1,
      1000
    );
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.shadowMap.enabled = false; // Disable shadows for performance
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mountRef.current.appendChild(renderer.domElement);
    
    // Add environment for reflections
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;

    // Optimized lighting system - reduced for performance
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    // Single optimized directional light
    const mainLight = new THREE.DirectionalLight(0xffffff, 0.5);
    mainLight.position.set(5, 10, 5);
    mainLight.castShadow = false; // Disable shadows for performance
    scene.add(mainLight);

    // Controls setup - Enhanced for free movement
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08; // Smooth movement
    controls.screenSpacePanning = true; // Allow panning
    controls.enablePan = true; // Enable panning
    controls.enableZoom = true; // Enable zooming
    controls.enableRotate = true; // Enable rotation
    
    // Distance limits
    controls.minDistance = 1; // Allow closer view
    controls.maxDistance = 50; // Allow further view
    
    // No rotation limits - full 360 degree freedom
    controls.minPolarAngle = 0; // Allow looking from any angle
    controls.maxPolarAngle = Math.PI; // Full vertical rotation
    controls.minAzimuthAngle = -Infinity; // No horizontal limits
    controls.maxAzimuthAngle = Infinity;
    
    // Pan limits (optional - can be removed for unlimited panning)
    controls.panSpeed = 1.0;
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.0;
    
    // Auto rotation settings
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 0.5;
    
    // Mouse/touch settings
    controls.mouseButtons = {
      LEFT: THREE.MOUSE.ROTATE,
      MIDDLE: THREE.MOUSE.DOLLY,
      RIGHT: THREE.MOUSE.PAN
    };
    
    // Touch settings for mobile
    controls.touches = {
      ONE: THREE.TOUCH.ROTATE,
      TWO: THREE.TOUCH.DOLLY_PAN
    };

    // Grid helper - removed for cleaner look
    // const gridHelper = new THREE.GridHelper(10, 10, 0x333333, 0x222222);
    // scene.add(gridHelper);

    // Setup loaders
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    const gltfLoader = new GLTFLoader();
    const dracoLoader = new DRACOLoader();
    let model: THREE.Group | null = null;
    
    // Optimize OBJ loader for performance
    // Note: OBJ loader automatically parses vertex colors when present
    
    // Configure Draco loader
    dracoLoader.setDecoderPath('/draco/');
    dracoLoader.setDecoderConfig({ type: 'js' });
    gltfLoader.setDRACOLoader(dracoLoader);
    
    // Try to load compressed GLB first, fallback to OBJ
    const compressedPath = modelPath.replace('.obj', '-compressed.glb');
    const glbPath = modelPath.replace('.obj', '.glb');
    
    // Model processing function
    const processModel = (object: THREE.Group) => {
      model = object;
      console.log('Model structure:', object);
      
      // Fix model orientation - flip if upside down
      object.rotation.x = Math.PI; // Rotate 180 degrees around X axis
      
      // Calculate bounding box to center the model
      const box = new THREE.Box3().setFromObject(object);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());
      console.log('Model size:', size);
      console.log('Model center:', center);

      // Center the model
      object.position.x = -center.x;
      object.position.y = -center.y;
      object.position.z = -center.z;

      // Scale the model to fit the view
      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = maxDim > 0 ? 5 / maxDim : 1; // Increased scale
      object.scale.setScalar(scale);
      
      console.log('Applied scale:', scale);

      // Process meshes with optimized materials
      let meshCount = 0;
      let totalVertices = 0;
      let hasVertexColors = false;
      
      object.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          meshCount++;
          const geometry = child.geometry;
          
          // Count vertices
          const vertexCount = geometry.attributes.position ? geometry.attributes.position.count : 0;
          totalVertices += vertexCount;
          
          // Check for vertex colors
          if (geometry.attributes.color) {
            hasVertexColors = true;
            console.log('Found vertex colors in GLB model');
          }
          
          // Optimize geometry for performance
          geometry.computeBoundingSphere();
          
          // Reduce geometry complexity if too many vertices
          if (vertexCount > 50000) {
            console.log(`High vertex count (${vertexCount}), applying geometry optimization`);
            // Compute vertex normals for smooth shading (mergeVertices is deprecated)
            if (!geometry.attributes.normal) {
              geometry.computeVertexNormals();
            }
            // Enable efficient rendering for high-poly models
            geometry.computeBoundingBox();
          }
          
          // Apply material based on whether we have vertex colors
          let material: THREE.Material;
          
          if (child.material && Array.isArray(child.material)) {
            // Handle multiple materials
            material = child.material[0];
          } else if (child.material) {
            // Use existing material from GLB if available
            material = child.material as THREE.Material;
            
            // Enhance existing material with OBJ original color if it's too plain
            if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
              const currentColor = material.color.getHex();
              if (currentColor === 0xffffff || currentColor === 0x000000) {
                // Apply OBJ original gray color
                const originalGray = new THREE.Color(0.752941, 0.752941, 0.752941);
                material.color = originalGray;
              }
              
              // Convert to StandardMaterial if it's BasicMaterial for better lighting
              if (material instanceof THREE.MeshBasicMaterial) {
                const newMaterial = new THREE.MeshStandardMaterial({
                  color: material.color,
                  metalness: 0.2,
                  roughness: 0.6,
                  side: material.side,
                  transparent: material.transparent,
                  opacity: material.opacity
                });
                material = newMaterial;
              } else {
                material.metalness = 0.2;
                material.roughness = 0.6;
              }
            }
          } else {
            // Create material optimized for vertex colors
            if (geometry.attributes.color) {
              // Use vertex colors from OBJ file
              material = new THREE.MeshStandardMaterial({
                vertexColors: true,
                metalness: 0.1,
                roughness: 0.7,
                side: THREE.FrontSide
              });
              console.log('Applied vertex color material to mesh');
            } else {
              // Fallback material
              material = new THREE.MeshStandardMaterial({
                color: 0xcccccc,
                metalness: 0.1,
                roughness: 0.7,
                side: THREE.FrontSide
              });
            }
          }
          
          child.material = material;
          child.castShadow = false; // Disable shadow casting for performance
          child.receiveShadow = false; // Disable shadow receiving for performance
          child.frustumCulled = true; // Enable frustum culling
          
          // Additional performance optimizations
          child.matrixAutoUpdate = false; // Disable automatic matrix updates
          child.updateMatrix(); // Update matrix once
        }
      });
      
      console.log(`Model loaded - Meshes: ${meshCount}, Vertices: ${totalVertices}, Has vertex colors: ${hasVertexColors}`);
      
      scene.add(object);
      setLoading(false);
    };
    
    // Function to load GLB/GLTF with Draco compression
    const loadGLTF = (path: string) => {
      console.log('Loading compressed GLB from:', path);
      gltfLoader.load(
        path,
        (gltf) => {
          console.log('GLB loaded successfully:', gltf);
          const object = gltf.scene;
          processModel(object);
        },
        (xhr) => {
          const percentComplete = (xhr.loaded / xhr.total) * 100;
          setProgress(Math.round(percentComplete));
        },
        (error) => {
          console.error('Error loading GLB:', error);
          setError('Failed to load 3D model - all formats failed');
          setLoading(false);
        }
      );
    };
    
    // Function to load OBJ with or without materials
    const loadOBJ = (materials?: MTLLoader.MaterialCreator) => {
      console.log('Loading OBJ from path:', modelPath);
      
      if (materials) {
        materials.preload();
        objLoader.setMaterials(materials);
      }
      
      objLoader.load(
        modelPath,
        (object) => {
          console.log('OBJ loaded successfully:', object);
          if (object.children.length === 0) {
            console.error('OBJ file loaded but contains no geometry');
            setError('Model file is empty');
            setLoading(false);
            return;
          }
          processModel(object);
        },
        (xhr) => {
          // Progress callback
          if (xhr.lengthComputable) {
            const percentComplete = (xhr.loaded / xhr.total) * 100;
            setProgress(Math.round(percentComplete));
            console.log(`Loading progress: ${Math.round(percentComplete)}%`);
          }
        },
        (error) => {
          // Error callback
          console.error('Error loading OBJ model:', error);
          console.error('Model path:', modelPath);
          console.log('Attempting to load compressed GLB as fallback...');
          
          // Try loading compressed GLB as fallback
          const compressedPath = modelPath.replace('.obj', '-compressed.glb');
          loadGLTF(compressedPath);
        }
      );
    };

    // Load OBJ directly to preserve vertex colors (GLB conversion loses color information)
    console.log('Loading OBJ file to preserve vertex colors from:', modelPath);
    console.log('Full URL:', window.location.origin + modelPath);
    
    // Test if file exists first
    fetch(modelPath, { method: 'HEAD' })
      .then(response => {
        console.log('File access test:', response.status, response.statusText);
        console.log('Content-Type:', response.headers.get('content-type'));
        if (response.ok) {
          loadOBJ();
        } else {
          setError(`Model file not accessible (${response.status})`);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('File access test failed:', error);
        // Try loading anyway in case it's a CORS issue
        loadOBJ();
      });

    // Optimized animation loop with adaptive framerate
    let needsUpdate = true;
    let lastFrameTime = 0;
    const targetFPS = 30; // Cap at 30 FPS for performance
    const frameInterval = 1000 / targetFPS;
    
    controls.addEventListener('change', () => {
      needsUpdate = true;
    });
    
    const animate = (currentTime: number) => {
      requestAnimationFrame(animate);
      
      // Throttle rendering to target FPS
      if (currentTime - lastFrameTime < frameInterval) {
        return;
      }
      lastFrameTime = currentTime;
      
      // Only update controls if needed
      if (controls.enableDamping || controls.autoRotate) {
        controls.update();
        needsUpdate = true;
      }

      // Simplified rotation animation
      if (model && autoRotate && !controls.autoRotate) {
        model.rotation.y += 0.005; // Constant rotation speed
        needsUpdate = true;
      }
      
      // Only render if something changed
      if (needsUpdate) {
        renderer.render(scene, camera);
        needsUpdate = false;
      }
    };
    animate(0);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const newWidth = mountRef.current.clientWidth;
      const newHeight = mountRef.current.clientHeight;
      
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      const currentMount = mountRef.current;
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
      renderer.dispose();
      controls.dispose();
    };
  }, [modelPath, width, height, autoRotate]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="relative bg-deep rounded-2xl overflow-hidden shadow-glow"
      style={{ width, height }}
    >
      <div ref={mountRef} className="w-full h-full" />
      
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-deep backdrop-blur-sm">
          <div className="text-light mb-4">Loading 3D Model with Colors...</div>
          <div className="w-48 h-2 bg-mid rounded-full overflow-hidden">
            <motion.div
              className="h-full gradient-accent"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="surf-200 text-sm mt-2">{progress}% - Preserving vertex colors</div>
        </div>
      )}
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-deep backdrop-blur-sm">
          <div className="coral text-center">
            <div className="mb-2">⚠️</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {!loading && !error && (
        <div className="absolute bottom-4 left-4 surf-200 text-xs space-y-1">
          <div>🖱️ 左键：旋转 • 滚轮：缩放 • 右键：平移</div>
          <div>📱 触屏：单指旋转 • 双指缩放平移</div>
        </div>
      )}
    </motion.div>
  );
};

export default Model3DViewer;
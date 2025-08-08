// Node.js script to convert OBJ to GLB with Draco compression
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

// This script requires gltf-pipeline to be installed globally
// Run: npm install -g gltf-pipeline

const objPath = './public/models/JH-总装.obj';
const gltfPath = './public/models/JH-总装.gltf';
const glbPath = './public/models/JH-总装.glb';
const compressedGlbPath = './public/models/JH-总装-compressed.glb';

console.log('Converting OBJ to GLB with Draco compression...');

// First, convert OBJ to GLTF using obj2gltf with vertex colors
exec(`npx obj2gltf -i "${objPath}" -o "${gltfPath}" --vertexColors`, (error, stdout, stderr) => {
  if (error) {
    console.error('Error converting OBJ to GLTF:', error);
    return;
  }
  
  console.log('OBJ to GLTF conversion completed');
  
  // Then compress with Draco using gltf-pipeline
  exec(`npx gltf-pipeline -i "${gltfPath}" -o "${compressedGlbPath}" --draco.compressionLevel=7`, (error, stdout, stderr) => {
    if (error) {
      console.error('Error compressing with Draco:', error);
      return;
    }
    
    console.log('Draco compression completed!');
    console.log(`Compressed model saved to: ${compressedGlbPath}`);
    
    // Check file sizes
    const originalSize = fs.statSync(objPath).size;
    const compressedSize = fs.statSync(compressedGlbPath).size;
    const compressionRatio = ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
    
    console.log(`Original size: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compressed size: ${(compressedSize / 1024 / 1024).toFixed(2)} MB`);
    console.log(`Compression ratio: ${compressionRatio}%`);
  });
});
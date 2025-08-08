import * as THREE from 'three';

export class LargeOBJLoader {
  private vertices: number[] = [];
  private colors: number[] = [];
  private normals: number[] = [];
  private uvs: number[] = [];
  private faces: any[] = [];
  private materials: any = null;

  setMaterials(materials: any) {
    this.materials = materials;
  }

  async loadChunked(
    url: string,
    onProgress?: (loaded: number, total: number) => void,
    chunkSize: number = 10 * 1024 * 1024 // 10MB chunks
  ): Promise<THREE.Group> {
    try {
      // 对于开发服务器，直接使用流式加载
      // 因为webpack dev server不支持Range请求
      if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        console.log('Development mode detected, using direct streaming load');
        return this.loadDirect(url, onProgress);
      }
      
      // 先获取文件大小
      const response = await fetch(url, { method: 'HEAD' });
      const contentLength = parseInt(response.headers.get('content-length') || '0');
      
      if (contentLength === 0) {
        // 如果无法获取文件大小，尝试直接加载
        return this.loadDirect(url, onProgress);
      }

      const group = new THREE.Group();
      let loadedBytes = 0;
      let textBuffer = '';
      
      // 分块读取
      for (let start = 0; start < contentLength; start += chunkSize) {
        const end = Math.min(start + chunkSize - 1, contentLength - 1);
        
        const chunkResponse = await fetch(url, {
          headers: {
            'Range': `bytes=${start}-${end}`
          }
        });
        
        if (!chunkResponse.ok && chunkResponse.status !== 206) {
          // 如果服务器不支持Range请求，回退到直接加载
          console.log('Server does not support range requests, falling back to direct load');
          return this.loadDirect(url, onProgress);
        }
        
        const chunkText = await chunkResponse.text();
        textBuffer += chunkText;
        
        loadedBytes += chunkText.length;
        if (onProgress) {
          onProgress(loadedBytes, contentLength);
        }
        
        // 处理完整的行
        const lines = textBuffer.split('\n');
        textBuffer = lines[lines.length - 1]; // 保留最后一个可能不完整的行
        
        for (let i = 0; i < lines.length - 1; i++) {
          this.parseLine(lines[i]);
        }
      }
      
      // 处理最后剩余的内容
      if (textBuffer) {
        this.parseLine(textBuffer);
      }
      
      // 构建几何体
      const geometry = this.buildGeometry();
      
      if (geometry.attributes.position) {
        console.log('Geometry has positions:', geometry.attributes.position.count);
        console.log('Has vertex colors:', !!geometry.attributes.color);
        
        // 创建材质 - 如果有顶点颜色，使用它们
        const material = new THREE.MeshPhongMaterial({
          color: 0xffffff, // 白色基础色，让顶点颜色完全显示
          vertexColors: !!geometry.attributes.color, // 启用顶点颜色
          specular: 0x111111,
          shininess: 100,
          side: THREE.DoubleSide // 双面渲染，以防法线方向问题
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        group.add(mesh);
        
        console.log('Mesh created and added to group');
      } else {
        console.error('Geometry has no position attribute');
      }
      
      return group;
    } catch (error) {
      console.error('Error in chunked loading:', error);
      // 回退到直接加载
      return this.loadDirect(url, onProgress);
    }
  }

  private async loadDirect(
    url: string,
    onProgress?: (loaded: number, total: number) => void
  ): Promise<THREE.Group> {
    const response = await fetch(url);
    const total = parseInt(response.headers.get('content-length') || '0');
    
    if (!response.body) {
      throw new Error('Response body is null');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let receivedLength = 0;
    let chunks: Uint8Array[] = [];
    
    while (true) {
      const { done, value } = await reader.read();
      
      if (done) break;
      
      chunks.push(value);
      receivedLength += value.length;
      
      if (onProgress) {
        onProgress(receivedLength, total);
      }
    }
    
    // 合并所有块
    const chunksAll = new Uint8Array(receivedLength);
    let position = 0;
    for (const chunk of chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }
    
    const text = decoder.decode(chunksAll);
    const lines = text.split('\n');
    
    console.log(`Parsing ${lines.length} lines from OBJ file`);
    
    for (const line of lines) {
      this.parseLine(line);
    }
    
    const geometry = this.buildGeometry();
    const group = new THREE.Group();
    
    if (geometry.attributes.position) {
      const material = new THREE.MeshPhongMaterial({
        color: 0xffffff,
        vertexColors: !!geometry.attributes.color,
        specular: 0x111111,
        shininess: 100,
        side: THREE.DoubleSide
      });
      
      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      group.add(mesh);
      
      console.log('Direct load: Mesh created and added to group');
    } else {
      console.error('Direct load: Geometry has no position attribute');
    }
    
    return group;
  }

  private parseLine(line: string) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;
    
    const parts = trimmedLine.split(/\s+/);
    const command = parts[0];
    
    switch (command) {
      case 'v':
        // 顶点 - 可能包含颜色信息 (x y z [r g b])
        const x = parseFloat(parts[1]) || 0;
        const y = parseFloat(parts[2]) || 0;
        const z = parseFloat(parts[3]) || 0;
        
        // 检查NaN
        if (!isFinite(x) || !isFinite(y) || !isFinite(z)) {
          this.vertices.push(0, 0, 0);
          this.colors.push(0.5, 0.5, 0.5);
        } else {
          this.vertices.push(x, y, z);
          
          // 解析颜色信息（如果存在）
          if (parts.length >= 7) {
            const r = parseFloat(parts[4]) || 0.5;
            const g = parseFloat(parts[5]) || 0.5;
            const b = parseFloat(parts[6]) || 0.5;
            this.colors.push(r, g, b);
          } else {
            this.colors.push(0.5, 0.5, 0.5);
          }
        }
        break;
        
      case 'vn':
        // 法线
        const nx = parseFloat(parts[1]) || 0;
        const ny = parseFloat(parts[2]) || 0;
        const nz = parseFloat(parts[3]) || 0;
        this.normals.push(nx, ny, nz);
        break;
        
      case 'vt':
        // UV坐标
        const u = parseFloat(parts[1]) || 0;
        const v = parseFloat(parts[2]) || 0;
        this.uvs.push(u, v);
        break;
        
      case 'f':
        // 面
        const face = [];
        for (let i = 1; i < parts.length; i++) {
          const indices = parts[i].split('/');
          face.push({
            v: parseInt(indices[0]) - 1,
            vt: indices[1] ? parseInt(indices[1]) - 1 : undefined,
            vn: indices[2] ? parseInt(indices[2]) - 1 : undefined
          });
        }
        if (face.length >= 3) {
          this.faces.push(face);
        }
        break;
    }
  }

  private buildGeometry(): THREE.BufferGeometry {
    const geometry = new THREE.BufferGeometry();
    
    console.log(`Building geometry: ${this.vertices.length / 3} vertices, ${this.faces.length} faces`);
    
    if (this.faces.length === 0 && this.vertices.length > 0) {
      // 如果没有面数据，只有顶点，创建点云
      console.log('No faces found, creating point cloud');
      const positions = new Float32Array(this.vertices);
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      return geometry;
    }
    
    // 构建索引几何体
    const positions: number[] = [];
    const colors: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];
    
    let vertexIndex = 0;
    const vertexMap = new Map<string, number>();
    
    for (const face of this.faces) {
      // 三角化多边形
      for (let i = 1; i < face.length - 1; i++) {
        const v0 = face[0];
        const v1 = face[i];
        const v2 = face[i + 1];
        
        for (const vertex of [v0, v1, v2]) {
          const key = `${vertex.v}/${vertex.vt}/${vertex.vn}`;
          
          if (!vertexMap.has(key)) {
            // 添加顶点
            const vIdx = vertex.v * 3;
            positions.push(
              this.vertices[vIdx] || 0,
              this.vertices[vIdx + 1] || 0,
              this.vertices[vIdx + 2] || 0
            );
            
            // 添加颜色
            if (this.colors.length > 0) {
              colors.push(
                this.colors[vIdx] || 0.5,
                this.colors[vIdx + 1] || 0.5,
                this.colors[vIdx + 2] || 0.5
              );
            }
            
            // 添加法线
            if (vertex.vn !== undefined && this.normals.length > 0) {
              const nIdx = vertex.vn * 3;
              normals.push(
                this.normals[nIdx] || 0,
                this.normals[nIdx + 1] || 1,
                this.normals[nIdx + 2] || 0
              );
            }
            
            // 添加UV
            if (vertex.vt !== undefined && this.uvs.length > 0) {
              const uvIdx = vertex.vt * 2;
              uvs.push(
                this.uvs[uvIdx] || 0,
                this.uvs[uvIdx + 1] || 0
              );
            }
            
            vertexMap.set(key, vertexIndex);
            vertexIndex++;
          }
          
          indices.push(vertexMap.get(key)!);
        }
      }
    }
    
    geometry.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), 3));
    
    // 添加颜色属性
    if (colors.length > 0) {
      geometry.setAttribute('color', new THREE.BufferAttribute(new Float32Array(colors), 3));
    }
    
    if (normals.length > 0) {
      geometry.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
    } else {
      geometry.computeVertexNormals();
    }
    
    if (uvs.length > 0) {
      geometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), 2));
    }
    
    if (indices.length > 0) {
      geometry.setIndex(indices);
    }
    
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();
    
    console.log(`Geometry built: ${positions.length / 3} vertices, ${indices.length / 3} triangles`);
    console.log('Bounding box:', geometry.boundingBox);
    
    return geometry;
  }
}
// 根据环境选择模型加载策略
export function getModelPath(): { obj: string; mtl: string } {
  const hostname = window.location.hostname;
  const isGitHubPages = hostname.includes('github.io');
  const isVercel = hostname.includes('vercel.app') || hostname.includes('.vercel.app');
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // Vercel环境可以直接加载大文件
  if (isVercel || isLocalhost) {
    console.log('Vercel/Local environment detected, loading full model');
    return {
      obj: '/Ux730415/JH-总装.obj',
      mtl: '/Ux730415/JH-总装.mtl'
    };
  }
  
  // GitHub Pages环境无法加载Git LFS文件
  if (isGitHubPages) {
    console.log('GitHub Pages detected, model loading will fail');
    return {
      obj: '/Ux730415/JH-总装.obj',  // 会失败，但保持路径一致性
      mtl: '/Ux730415/JH-总装.mtl'
    };
  }
  
  // 默认路径
  return {
    obj: '/Ux730415/JH-总装.obj',
    mtl: '/Ux730415/JH-总装.mtl'
  };
}

export function handleModelLoadError(error: any): void {
  console.error('Model loading error:', error);
  
  // 提供用户友好的错误信息
  if (window.location.hostname.includes('github.io')) {
    console.log('提示：在GitHub Pages上，大型模型文件可能无法加载。');
    console.log('解决方案：');
    console.log('1. 将模型文件上传到CDN');
    console.log('2. 使用GitHub Releases存储大文件');
    console.log('3. 克隆仓库到本地运行');
  }
}
// 根据环境选择模型加载策略
export function getModelPath(): { obj: string; mtl: string } {
  const isProduction = process.env.NODE_ENV === 'production';
  const isGitHubPages = window.location.hostname.includes('github.io');
  
  if (isGitHubPages) {
    // GitHub Pages环境：使用CDN或较小的模型
    console.log('GitHub Pages detected, using alternative model source');
    // 可以将模型上传到CDN服务（如jsDelivr、unpkg等）
    // 或使用GitHub Releases作为存储
    return {
      obj: '/Ux730415/JH-总装.obj',  // 仍然尝试加载，但可能会失败
      mtl: '/Ux730415/JH-总装.mtl'
    };
  }
  
  // 本地开发环境
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
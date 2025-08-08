// 根据环境选择模型加载策略
export function getModelPath(): { obj: string; mtl: string } {
  const hostname = window.location.hostname;
  const isGitHubPages = hostname.includes('github.io');
  const isVercel = hostname.includes('vercel.app') || hostname.includes('.vercel.app');
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
  // 本地环境使用本地文件
  if (isLocalhost) {
    console.log('Local environment detected, loading local model');
    return {
      obj: '/Ux730415/JH-总装.obj',
      mtl: '/Ux730415/JH-总装.mtl'
    };
  }
  
  // Vercel环境 - 使用GitHub Release URL（更稳定，无跨域问题）
  if (isVercel) {
    console.log('Vercel environment detected, using GitHub Release files');
    // 优先使用环境变量，否则使用默认的Release URL
    const objUrl = process.env.REACT_APP_MODEL_OBJ_URL || 
      'https://github.com/Du9uay/model/releases/download/v1.0.1/JH-总装.obj';
    const mtlUrl = process.env.REACT_APP_MODEL_MTL_URL || 
      'https://github.com/Du9uay/model/releases/download/v1.0.1/JH-总装.mtl';
    
    return {
      obj: objUrl,
      mtl: mtlUrl
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
  
  // 默认使用GitHub raw URL
  return {
    obj: 'https://media.githubusercontent.com/media/Du9uay/model/master/public/Ux730415/JH-总装.obj',
    mtl: 'https://raw.githubusercontent.com/Du9uay/model/master/public/Ux730415/JH-总装.mtl'
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
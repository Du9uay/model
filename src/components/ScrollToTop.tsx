import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // 页面切换时滚动到顶部
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth' // 平滑滚动效果
    });
  }, [pathname]);

  return null; // 这个组件不渲染任何内容
};

export default ScrollToTop; 
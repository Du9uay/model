import React, { ReactNode, useRef, useEffect, useState } from 'react';

interface LiquidGlassProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onClick?: () => void;
  displacementScale?: number;
  blurAmount?: number;
  saturation?: number;
  elasticity?: number;
  cornerRadius?: number;
  mouseContainer?: React.RefObject<HTMLElement | null> | null;
}

const LiquidGlass: React.FC<LiquidGlassProps> = ({
  children,
  className = '',
  style = {},
  onClick,
  displacementScale = 50,
  blurAmount = 0.08,
  saturation = 130,
  elasticity = 0.15,
  cornerRadius = 16,
  mouseContainer
}) => {
  const glassRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: Event) => {
      const mouseEvent = e as MouseEvent;
      const container = mouseContainer?.current || glassRef.current;
      if (!container) return;

      const rect = container.getBoundingClientRect();
      const x = (mouseEvent.clientX - rect.left) / rect.width;
      const y = (mouseEvent.clientY - rect.top) / rect.height;
      
      setMousePosition({ x: Math.max(0, Math.min(1, x)), y: Math.max(0, Math.min(1, y)) });
    };

    const container = mouseContainer?.current || document;
    container.addEventListener('mousemove', handleMouseMove);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseContainer]);

  const glassStyle: React.CSSProperties = {
    position: 'relative',
    overflow: 'hidden',
    backdropFilter: `blur(${blurAmount * 100}px) saturate(${saturation}%)`,
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: `${cornerRadius}px`,
    boxShadow: `
      0 8px 32px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.2)
    `,
    transition: `all ${elasticity}s cubic-bezier(0.4, 0, 0.2, 1)`,
    transform: isHovered 
      ? `perspective(1000px) rotateX(${(mousePosition.y - 0.5) * 10}deg) rotateY(${(mousePosition.x - 0.5) * 10}deg) scale(1.02)`
      : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)',
    cursor: onClick ? 'pointer' : 'default',
    ...style
  };

  const overlayStyle: React.CSSProperties = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `radial-gradient(circle at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(255, 255, 255, 0.1) 0%, transparent 50%)`,
    borderRadius: `${cornerRadius}px`,
    opacity: isHovered ? 1 : 0,
    transition: `opacity ${elasticity}s ease-out`,
    pointerEvents: 'none'
  };

  return (
    <div
      ref={glassRef}
      className={className}
      style={glassStyle}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div style={overlayStyle} />
      <div style={{ position: 'relative', zIndex: 1 }}>
        {children}
      </div>
    </div>
  );
};

export default LiquidGlass; 
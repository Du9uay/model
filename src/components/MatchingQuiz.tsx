import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Line, 
  ActiveLine, 
  MatchingQuizProps, 
  MatchingResult,
  Point 
} from '../types/matching';

/**
 * 匹配题连线组件
 * 实现基于React + TypeScript + SVG的交互式匹配题连线功能
 */
const MatchingQuiz: React.FC<MatchingQuizProps> = ({
  question,
  onAnswerChange,
  showResult = false,
  disabled = false,
  className = ''
}) => {
  // 状态管理
  const [lines, setLines] = useState<Line[]>([]);
  const [activeLine, setActiveLine] = useState<ActiveLine | null>(null);
  const [answers, setAnswers] = useState<{ [key: string]: string }>({});
  const [isDrawing, setIsDrawing] = useState(false);
  
  // DOM引用
  const itemRefs = useRef<{ [key: string]: HTMLDivElement }>({});
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  /**
   * 计算元素中心点坐标（相对于SVG容器）
   * @param element - 目标DOM元素
   * @returns 中心点坐标
   */
  const getItemCenter = useCallback((element: HTMLElement): Point => {
    const rect = element.getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect() || { left: 0, top: 0 };
    return {
      x: rect.left + rect.width / 2 - containerRect.left,
      y: rect.top + rect.height / 2 - containerRect.top
    };
  }, []);

  /**
   * 处理左侧选项点击事件
   * @param leftId - 左侧选项ID
   * @param e - 鼠标事件
   */
  const handleLeftItemClick = useCallback((leftId: string, e: React.MouseEvent) => {
    if (disabled) return;
    
    e.stopPropagation();
    const element = itemRefs.current[leftId];
    if (element) {
      // 如果该项已经连线，先移除现有连线
      if (lines.some(line => line.leftId === leftId)) {
        setLines(prev => prev.filter(line => line.leftId !== leftId));
        setAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[`${leftId}_match`];
          return newAnswers;
        });
      }
      
      // 创建新的活动连线
      const center = getItemCenter(element);
      setActiveLine({
        start: center,
        leftId
      });
      setIsDrawing(true);
    }
  }, [disabled, lines, getItemCenter]);

  /**
   * 处理鼠标移动事件（连线跟随鼠标）
   * @param e - 鼠标事件
   */
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (activeLine && isDrawing && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      setActiveLine({
        ...activeLine,
        end: {
          x: e.clientX - containerRect.left,
          y: e.clientY - containerRect.top
        }
      });
    }
  }, [activeLine, isDrawing]);

  /**
   * 处理右侧选项点击事件
   * @param rightId - 右侧选项ID
   * @param e - 鼠标事件
   */
  const handleRightItemClick = useCallback((rightId: string, e: React.MouseEvent) => {
    if (disabled || !activeLine) return;
    
    e.stopPropagation();
    const element = itemRefs.current[rightId];
    if (element) {
      // 防止重复连接到同一右侧项
      if (lines.some(line => line.rightId === rightId)) {
        return;
      }

      // 如果左侧项已经有其他连线，先移除
      const existingLine = lines.find(line => line.leftId === activeLine.leftId);
      if (existingLine) {
        setLines(prev => prev.filter(line => line.leftId !== activeLine.leftId));
        setAnswers(prev => {
          const newAnswers = { ...prev };
          delete newAnswers[`${activeLine.leftId}_match`];
          return newAnswers;
        });
      }

      // 创建新连线
      const center = getItemCenter(element);
      const newLine: Line = {
        start: activeLine.start,
        end: center,
        leftId: activeLine.leftId,
        rightId
      };

      setLines(prev => [...prev, newLine]);
      setActiveLine(null);
      setIsDrawing(false);
      
      // 更新答案
      const newAnswers = {
        ...answers,
        [`${activeLine.leftId}_match`]: rightId
      };
      setAnswers(newAnswers);
      onAnswerChange?.(newAnswers);
    }
  }, [disabled, activeLine, lines, getItemCenter, answers, onAnswerChange]);

  /**
   * 取消当前绘制
   */
  const handleCancelDrawing = useCallback(() => {
    setActiveLine(null);
    setIsDrawing(false);
  }, []);

  /**
   * 重置所有连线
   */
  const handleReset = useCallback(() => {
    if (disabled) return;
    
    setLines([]);
    setActiveLine(null);
    setIsDrawing(false);
    
    const resetAnswers: { [key: string]: string } = {};
    setAnswers(resetAnswers);
    onAnswerChange?.(resetAnswers);
  }, [disabled, onAnswerChange]);

  /**
   * 计算匹配结果
   */
  const calculateResult = useCallback((): MatchingResult => {
    const details: { [leftId: string]: { 
      userAnswer: string; 
      correctAnswer: string; 
      isCorrect: boolean; 
    } } = {};
    
    let correct = 0;
    let total = 0;
    
    Object.keys(question.correctMatches).forEach(leftId => {
      total++;
      const userAnswer = answers[`${leftId}_match`] || '';
      const correctAnswer = question.correctMatches[leftId];
      const isCorrect = userAnswer === correctAnswer;
      
      if (isCorrect) correct++;
      
      details[leftId] = {
        userAnswer,
        correctAnswer,
        isCorrect
      };
    });
    
    return {
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      details
    };
  }, [question.correctMatches, answers]);

  // 监听窗口大小变化，重新计算连线位置
  useEffect(() => {
    const handleResize = () => {
      // 重新计算所有连线的位置
      setLines(prevLines => 
        prevLines.map(line => {
          const leftElement = itemRefs.current[line.leftId];
          const rightElement = itemRefs.current[line.rightId];
          
          if (leftElement && rightElement) {
            return {
              ...line,
              start: getItemCenter(leftElement),
              end: getItemCenter(rightElement)
            };
          }
          return line;
        })
      );
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [getItemCenter]);

  // 当题目改变时重置状态
  useEffect(() => {
    setLines([]);
    setActiveLine(null);
    setIsDrawing(false);
    setAnswers({});
    // 清除DOM引用
    itemRefs.current = {};
  }, [question.id]);

  const result = showResult ? calculateResult() : null;

  return (
    <div className={`matching-quiz ${className}`}>
      {/* 题目标题 */}
      {question.title && (
        <motion.h3 
          className="text-xl font-semibold text-light mb-6 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {question.title}
        </motion.h3>
      )}

      {/* 主容器 */}
      <div 
        ref={containerRef}
        className="relative grid md:grid-cols-2 gap-8 min-h-[400px] p-4"
        onMouseMove={handleMouseMove}
        onMouseLeave={handleCancelDrawing}
        onClick={handleCancelDrawing}
      >
        {/* SVG连线容器 */}
        <svg
          ref={svgRef}
          className="absolute inset-0"
          style={{ 
            zIndex: 20, // 提高z-index到20，确保线条在所有内容之上
            width: '100%', 
            height: '100%',
            pointerEvents: 'none' // 确保SVG不会阻挡鼠标事件
          }}
        >
          {/* 已完成的连线 */}
          <AnimatePresence>
            {lines.map((line, i) => {
              const isCorrect = showResult && result?.details[line.leftId]?.isCorrect;
              const strokeColor = showResult 
                ? (isCorrect ? '#10B981' : '#EF4444') 
                : '#60A5FA';
              
              return (
                <motion.g 
                  key={`${line.leftId}-${line.rightId}`}
                  initial={{ opacity: 0, pathLength: 0 }}
                  animate={{ opacity: 1, pathLength: 1 }}
                  exit={{ opacity: 0, pathLength: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <motion.line
                    x1={line.start.x}
                    y1={line.start.y}
                    x2={line.end.x}
                    y2={line.end.y}
                    stroke={strokeColor}
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="transition-all duration-300 drop-shadow-lg"
                    style={{ 
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                    }}
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                  />
                  <motion.circle 
                    cx={line.start.x} 
                    cy={line.start.y} 
                    r="6" 
                    fill={strokeColor}
                    style={{ 
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  />
                  <motion.circle 
                    cx={line.end.x} 
                    cy={line.end.y} 
                    r="6" 
                    fill={strokeColor}
                    style={{ 
                      pointerEvents: 'none',
                      filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                    }}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  />
                </motion.g>
              );
            })}
          </AnimatePresence>
          
          {/* 正在绘制的连线 */}
          {activeLine && (
            <motion.g
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <line
                x1={activeLine.start.x}
                y1={activeLine.start.y}
                x2={activeLine.end?.x || activeLine.start.x}
                y2={activeLine.end?.y || activeLine.start.y}
                stroke="#60A5FA"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray="8,4"
                className="animate-pulse"
                style={{ 
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                }}
              />
              <circle 
                cx={activeLine.start.x} 
                cy={activeLine.start.y} 
                r="6" 
                fill="#60A5FA" 
                style={{ 
                  pointerEvents: 'none',
                  filter: 'drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5))'
                }}
              />
            </motion.g>
          )}
        </svg>
        
        {/* 左侧选项 */}
        <div className="relative z-10 space-y-4">
          <h4 className="text-lg font-medium coral mb-4 text-center">
            左侧选项
          </h4>
          {question.leftItems.map((item, index) => {
            const isConnected = lines.some(line => line.leftId === item.id);
            const isCorrect = showResult && result?.details[item.id]?.isCorrect;
            
            return (
              <motion.div
                key={item.id}
                ref={el => el && (itemRefs.current[item.id] = el)}
                onClick={(e) => handleLeftItemClick(item.id, e)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                  ${isConnected 
                    ? (showResult 
                        ? (isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500')
                        : 'bg-orange border-coral'
                      )
                    : 'card-base border-soft hover:bg-surf-200 hover:border-coral'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={!disabled ? { scale: 1.02, x: 5 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <span className="text-light font-medium block">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </div>
        
        {/* 右侧选项 */}
        <div className="relative z-10 space-y-4">
          <h4 className="text-lg font-medium coral mb-4 text-center">
            右侧选项
          </h4>
          {question.rightItems.map((item, index) => {
            const isConnected = lines.some(line => line.rightId === item.id);
            const connectedLeftId = lines.find(line => line.rightId === item.id)?.leftId;
            const isCorrect = showResult && connectedLeftId && result?.details[connectedLeftId]?.isCorrect;
            
            return (
              <motion.div
                key={item.id}
                ref={el => el && (itemRefs.current[item.id] = el)}
                onClick={(e) => handleRightItemClick(item.id, e)}
                className={`
                  p-4 rounded-lg border-2 cursor-pointer transition-all duration-300
                  ${isConnected 
                    ? (showResult 
                        ? (isCorrect ? 'bg-green-900/20 border-green-500' : 'bg-red-900/20 border-red-500')
                        : 'bg-orange border-coral'
                      )
                    : 'card-base border-soft hover:bg-surf-200 hover:border-coral'
                  }
                  ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={!disabled ? { scale: 1.02, x: -5 } : {}}
                whileTap={!disabled ? { scale: 0.98 } : {}}
              >
                <span className="text-light font-medium block">
                  {item.text}
                </span>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center space-x-4 mt-6">
        <motion.button
          onClick={handleReset}
          disabled={disabled || lines.length === 0}
          className="px-6 py-2 bg-coral hover:bg-orange disabled:opacity-50 disabled:cursor-not-allowed
                     text-light rounded-lg transition-all duration-300"
          whileHover={!disabled ? { scale: 1.05 } : {}}
          whileTap={!disabled ? { scale: 0.95 } : {}}
        >
          重置连线
        </motion.button>
        
        {showResult && result && (
          <div className="text-center">
            <div className="text-lg font-semibold text-light">
              得分: {result.correct}/{result.total} ({result.percentage}%)
            </div>
          </div>
        )}
      </div>

      {/* 使用说明 */}
      {!disabled && (
        <div className="mt-6 text-center text-sm surf-200">
          <p>点击左侧选项开始连线，然后点击右侧对应的选项完成匹配</p>
        </div>
      )}
    </div>
  );
};

export default MatchingQuiz;
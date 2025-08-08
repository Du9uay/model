/**
 * 匹配题连线功能的数据类型定义
 * 基于React + TypeScript + SVG实现的交互式匹配题连线功能
 */

// 完成的连线
export interface Line {
  start: { x: number; y: number };    // 起点坐标
  end: { x: number; y: number };      // 终点坐标
  leftId: string;                     // 左侧选项ID
  rightId: string;                    // 右侧选项ID
}

// 正在绘制的连线
export interface ActiveLine {
  start: { x: number; y: number };    // 起点坐标
  end?: { x: number; y: number };     // 终点坐标（可选，跟随鼠标）
  leftId: string;                     // 左侧选项ID
}

// 匹配选项
export interface MatchingItem {
  id: string;
  text: string;
}

// 匹配题数据结构
export interface MatchingQuestion {
  id: string;
  title?: string;                                           // 题目标题
  leftItems: MatchingItem[];                               // 左侧选项列表
  rightItems: MatchingItem[];                              // 右侧选项列表
  correctMatches: { [leftId: string]: string };           // 正确答案映射
}

// 匹配题组件属性
export interface MatchingQuizProps {
  question: MatchingQuestion;
  onAnswerChange?: (answers: { [key: string]: string }) => void;  // 答案变化回调
  showResult?: boolean;                                           // 是否显示结果
  disabled?: boolean;                                            // 是否禁用交互
  className?: string;                                            // 自定义样式类
}

// 匹配题状态
export interface MatchingState {
  lines: Line[];                                    // 已完成连线
  activeLine: ActiveLine | null;                   // 当前绘制连线
  answers: { [key: string]: string };              // 用户答案
  itemRefs: { [key: string]: HTMLDivElement };     // DOM元素引用
}

// 匹配结果
export interface MatchingResult {
  correct: number;        // 正确连线数
  total: number;         // 总连线数
  percentage: number;    // 正确率
  details: {             // 详细结果
    [leftId: string]: {
      userAnswer: string;
      correctAnswer: string;
      isCorrect: boolean;
    };
  };
}

// 坐标点
export interface Point {
  x: number;
  y: number;
}

// SVG连线样式配置
export interface LineStyle {
  stroke: string;           // 连线颜色
  strokeWidth: number;      // 连线粗细
  strokeDasharray?: string; // 虚线样式
  className?: string;       // CSS类名
}

// 连线动画配置
export interface LineAnimation {
  duration: number;         // 动画持续时间
  easing: string;          // 缓动函数
  delay?: number;          // 延迟时间
}
# 教育网页系统项目概览

## 项目目的
这是一个自动化的教育网页生成系统，核心功能是从课程讲义(course.md)和配色方案(palette.txt)自动生成完整的响应式课程网页。系统实现了"一门课一轮"的串行流水线，包括模板注入、架构说明、主题配色、构建预览、QA和发布的全流程。

## 技术栈
- **前端框架**: React 18 + TypeScript
- **样式系统**: Tailwind CSS + 自定义CSS变量系统
- **路由**: React Router DOM v6
- **3D渲染**: Three.js + three-stdlib
- **动画**: Framer Motion
- **拖拽**: @dnd-kit
- **构建工具**: Create React App (react-scripts)
- **包管理**: npm

## 项目结构
```
education_web/
├── public/           # 静态资源
├── src/
│   ├── components/   # 可复用组件
│   │   ├── LiquidGlass.tsx    # 液态玻璃效果组件
│   │   ├── Icons.tsx          # SVG图标组件
│   │   ├── Navigation.tsx     # 导航组件
│   │   ├── Model3DViewer.tsx  # 3D模型查看器
│   │   └── ScrollToTop.tsx    # 滚动控制组件
│   ├── pages/        # 页面组件
│   │   ├── HomePage.tsx
│   │   ├── ObjectivesPage.tsx
│   │   ├── CareersPage.tsx
│   │   ├── CourseSummaryPage.tsx
│   │   ├── CourseTestPage.tsx
│   │   ├── HomeworkPage.tsx
│   │   └── course/   # 课程相关页面
│   ├── config/       # 配置文件
│   ├── utils/        # 工具函数
│   ├── App.tsx       # 主应用组件
│   ├── index.tsx     # 应用入口
│   └── index.css     # 全局样式
├── courses/          # 课程内容目录
├── scripts/          # 自动化脚本
├── prompts/          # AI提示词模板
└── examples/         # 示例文件
```

## 核心特性
1. **自动化生产流程**: 从讲义到网页的全自动化转换
2. **响应式设计**: 自动适配桌面、平板和移动设备
3. **无障碍友好**: 符合WCAG 2.1 AA标准
4. **主题系统**: 语义化的颜色变量系统，支持动态换肤
5. **质量保证**: 三道Gate审核(架构、主题、发布)
6. **液态玻璃效果**: 仿苹果风格的模糊玻璃UI

## 入口点
- 主入口: `src/index.tsx`
- 路由配置: `src/App.tsx`
- 开发服务器: `npm start` (默认端口3000)
- 生产构建: `npm run build`
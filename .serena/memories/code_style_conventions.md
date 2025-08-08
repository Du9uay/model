# 代码风格和约定

## TypeScript约定
- 使用严格模式 (strict: true)
- 所有组件使用函数式组件和TypeScript类型定义
- 接口命名使用PascalCase，通常以Props结尾 (如 `LiquidGlassProps`)
- 导出方式：使用具名导出和默认导出相结合

## React组件约定
```typescript
// 组件定义模式
const ComponentName: React.FC<PropsInterface> = ({ prop1, prop2 }) => {
  // hooks在顶部
  const [state, setState] = useState();
  
  // 事件处理函数
  const handleEvent = () => {};
  
  // 渲染逻辑
  return <div>...</div>;
};

export default ComponentName;
```

## 样式约定
1. **Tailwind优先**: 优先使用Tailwind CSS类
2. **语义化颜色变量**: 使用CSS自定义属性定义颜色
   ```css
   --brand-primary: 30 64 175;    /* RGB格式 */
   --brand-accent: 245 158 11;
   ```
3. **响应式设计**: 使用Tailwind的响应式前缀 (sm:, md:, lg:, xl:)
4. **动画**: 使用Framer Motion处理复杂动画

## 文件命名约定
- 组件文件: PascalCase (如 `HomePage.tsx`)
- 工具函数: camelCase (如 `objToGlb.js`)
- 配置文件: kebab-case (如 `tailwind.config.js`)
- 脚本文件: kebab-case (如 `course-init.mjs`)

## 目录结构约定
- 组件按功能分组
- 页面组件放在`pages/`目录
- 可复用组件放在`components/`目录
- 工具函数放在`utils/`目录
- 配置文件放在`config/`目录

## 导入顺序
1. React相关导入
2. 第三方库导入
3. 本地组件导入
4. 样式导入
5. 类型导入

## 状态管理
- 使用React Hooks进行状态管理
- 复杂动画状态使用Framer Motion的animation controls
- 避免过度使用全局状态

## 注释规范
- 代码注释使用中文
- 复杂逻辑必须添加注释
- 组件顶部可添加功能说明注释
# 🎓 网页课件自动化生产系统

一个基于React的现代化教育网页生成系统，支持从课程讲义和配色方案自动生成完整的响应式教学网页。

## ✨ 核心特性

- 🚀 **一键自动化**：1个命令完成从讲义到网页的全流程
- 🎨 **智能主题系统**：自动调整配色确保WCAG 2.1 AA标准
- 📱 **响应式设计**：完美适配桌面、平板和移动设备
- 🔧 **智能容错**：自动检测和修复常见问题
- 🛡️ **质量保证**：三道Gate审核机制确保输出质量

## 🚀 快速开始

### 1. 安装项目

```bash
# 克隆项目
git clone [项目地址]
cd education_web

# 安装依赖
make install
```

### 2. 准备课程文件

```bash
# 创建课程目录
make prepare COURSE_ID=my-course
```

然后在 `courses/my-course/` 目录下放入：
- `course.md` - 课程讲义
- `palette.txt` - 四色配色方案

### 3. 一键生成网页

```bash
# 自动化生产
make auto COURSE_ID=my-course

# 或使用快速模式
make auto-fast COURSE_ID=my-course
```

### 4. 预览成果

```bash
# 启动开发服务器
make dev
```

访问 http://localhost:3000 查看生成的网页

## 📚 常用Make命令

### 基础开发
```bash
make dev          # 启动开发服务器
make build        # 构建生产版本
make test         # 运行测试
make clean        # 清理构建文件
```

### 课程生产
```bash
make auto COURSE_ID=xxx         # 一键自动化（推荐）
make auto-fast COURSE_ID=xxx    # 快速模式
make auto-strict COURSE_ID=xxx  # 严格模式
```

### 问题修复
```bash
make repair COURSE_ID=xxx           # 智能修复所有问题
make repair-contrast COURSE_ID=xxx  # 仅修复对比度
make repair-format COURSE_ID=xxx    # 仅修复格式
```

### 状态管理
```bash
make list                      # 列出所有课程
make status COURSE_ID=xxx      # 查看课程状态
make report COURSE_ID=xxx      # 查看生产报告
make unlock COURSE_ID=xxx      # 解锁卡死的课程
```

### 获取帮助
```bash
make help    # 显示完整帮助信息
make h       # 显示简短帮助
```

## 📁 项目结构

```
education_web/
├── Makefile              # Make命令配置
├── package.json          # 项目依赖
├── src/                  # React源代码
│   ├── components/       # 可复用组件
│   ├── pages/           # 页面组件
│   └── config/          # 配置文件
├── scripts/             # 自动化脚本
│   ├── course-auto.mjs  # 主控脚本
│   ├── course-repair.mjs # 修复脚本
│   └── auto-config.json # 自动化配置
├── courses/             # 课程文件夹
│   └── [course-id]/     # 单个课程
│       ├── course.md    # 课程讲义
│       ├── palette.txt  # 配色方案
│       └── .run/        # 运行时数据
├── docs/                # 项目文档
└── public/              # 静态资源
```

## 🎨 课程文件格式

### course.md 示例
```markdown
# 课程标题

## 一、课程介绍
课程介绍内容...

## 二、课程学习目标
- 目标1
- 目标2

## 三、课程内容详解
### 3.1 模块一
内容...

## 四、思考与练习
练习内容...
```

### palette.txt 示例
```
Primary Blue #1e40af
Accent Orange #f59e0b  
Text Dark #1f2937
Surface Light #f8fafc
```

## 🔧 高级用法

### 单步执行（调试用）
```bash
make init COURSE_ID=xxx    # 初始化
make arch COURSE_ID=xxx    # 生成架构
make theme COURSE_ID=xxx   # 生成主题
make inject COURSE_ID=xxx  # 注入主题
make qa COURSE_ID=xxx      # 质量检测
make publish COURSE_ID=xxx # 发布
```

### Gate审批
```bash
make approve-arch COURSE_ID=xxx     # 审批架构
make approve-theme COURSE_ID=xxx    # 审批主题
make approve-publish COURSE_ID=xxx  # 审批发布
```

### 回滚操作
```bash
make rollback COURSE_ID=xxx STAGE=queued  # 回滚到初始状态
```

## 📖 详细文档

- [一键自动化使用指南](docs/一键自动化使用指南.md)
- [自动化系统详解](docs/README-自动化生产系统.md)
- [项目技术文档](docs/README-教学网页.md)
- [开发规范](docs/README_CURSOR.md)

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m '添加某个特性'`)
4. 推送到分支 (`git push origin feature/amazing`)
5. 创建 Pull Request

## 📝 许可证

MIT License

## 🆘 获取帮助

- 查看 `make help` 获取命令帮助
- 查看 `docs/` 目录下的详细文档
- 提交 Issue 报告问题

---

**致谢**：感谢所有为教育事业贡献力量的开发者！ 🙏
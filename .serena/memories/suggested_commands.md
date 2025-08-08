# 建议的开发命令

## 基础开发命令
```bash
# 启动开发服务器
npm start

# 构建生产版本
npm run build

# 运行测试
npm test

# 弹出配置（谨慎使用）
npm run eject
```

## 课程自动化流程命令
```bash
# 1. 初始化课程
npm run course:init <course-id>

# 2. 生成架构说明
npm run course:arch <course-id>

# 3. 生成主题配色
npm run course:theme <course-id>

# 4. 修复主题对比度
npm run course:theme:fix <course-id>

# 5. 注入主题和构建
npm run course:inject <course-id>

# 6. 质量检测
npm run course:qa <course-id>

# 7. 发布课程
npm run course:publish <course-id>
```

## Gate审批命令
```bash
# 审批架构Gate A
npm run gate:approve <course-id> arch

# 审批主题Gate B
npm run gate:approve <course-id> theme

# 审批发布Gate C
npm run gate:approve <course-id> publish
```

## 故障处理命令
```bash
# 回滚到指定阶段
npm run course:rollback <course-id> --to <stage>

# 紧急解锁（系统卡死时使用）
npm run course:unlock <course-id>

# 运行系统测试
npm run test:system
```

## Git常用命令
```bash
# 查看状态
git status

# 添加更改
git add .

# 提交更改
git commit -m "描述"

# 推送到远程
git push

# 拉取最新代码
git pull
```

## 系统工具命令 (Darwin/macOS)
```bash
# 列出文件
ls -la

# 切换目录
cd <directory>

# 查找文件
find . -name "*.tsx"

# 搜索内容
grep -r "搜索词" .

# 查看文件内容
cat <file>

# 创建目录
mkdir -p <directory>

# 复制文件
cp <source> <destination>

# 移动/重命名
mv <source> <destination>
```

## 依赖管理
```bash
# 安装所有依赖
npm install

# 添加新依赖
npm install <package-name>

# 添加开发依赖
npm install -D <package-name>

# 更新依赖
npm update

# 查看过时的包
npm outdated
```

## 调试技巧
```bash
# 查看npm脚本列表
npm run

# 查看项目依赖树
npm ls

# 清理缓存
npm cache clean --force

# 重新安装依赖
rm -rf node_modules package-lock.json && npm install
```
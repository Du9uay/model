# 创建GitHub Release上传模型文件

## 📋 手动创建Release步骤

### 1. 访问Release页面
打开浏览器访问：https://github.com/Du9uay/model/releases/new

### 2. 填写Release信息
- **Tag version**: `v1.0.1`
- **Release title**: `3D模型文件 - 极耳激光焊接设备`
- **Description**: 
```
## 3D模型文件

包含完整的3D模型文件：
- **JH-总装.obj** (251MB) - 完整模型文件，包含颜色信息  
- **JH-总装.mtl** - 材质文件

这些文件用于在线展示完整的3D模型。

### 使用说明
模型文件已优化用于Web加载，支持：
- ✅ Vercel部署
- ✅ 其他支持大文件的托管平台
- ✅ 本地开发环境
```

### 3. 上传文件
点击 **"Attach binaries by dropping them here or selecting them"**

上传以下文件：
- `public/Ux730415/JH-总装.obj`
- `public/Ux730415/JH-总装.mtl`

### 4. 发布Release
点击 **"Publish release"** 按钮

## 🔗 获取文件直接链接

发布后，文件的直接下载链接格式为：
```
https://github.com/Du9uay/model/releases/download/v1.0.1/JH-总装.obj
https://github.com/Du9uay/model/releases/download/v1.0.1/JH-总装.mtl
```

## 💡 为什么使用GitHub Releases？

1. **无文件大小限制**：支持高达2GB的单个文件
2. **稳定可靠**：GitHub的CDN全球加速
3. **无跨域问题**：支持CORS
4. **免费使用**：不消耗仓库空间
5. **版本管理**：可以管理不同版本的模型文件

## 🚀 快速操作

如果你已经安装并配置了GitHub CLI，可以使用命令：

```bash
# 首先登录（如果未登录）
gh auth login

# 创建Release并上传文件
gh release create v1.0.1 \
  --repo Du9uay/model \
  --title "3D模型文件 - 极耳激光焊接设备" \
  --notes "包含完整的3D模型文件" \
  public/Ux730415/JH-总装.obj \
  public/Ux730415/JH-总装.mtl
```

## ⚠️ 注意事项

- 上传大文件可能需要一些时间
- 确保网络连接稳定
- Release创建后不能删除，只能编辑
# 极耳激光焊接教学平台

这是一个展示极耳激光焊接设备3D模型的教学平台。

## 🌐 在线访问

等待GitHub Pages部署完成后，可通过以下链接访问：
https://du9uay.github.io/model/

## 🚀 GitHub Pages 配置步骤

请按照以下步骤在GitHub上配置Pages：

1. **进入仓库设置**
   - 访问: https://github.com/Du9uay/model
   - 点击 `Settings` 标签

2. **配置Pages**
   - 在左侧菜单找到 `Pages`
   - 在 `Source` 部分选择 `GitHub Actions`
   - 保存设置

3. **等待部署**
   - 返回仓库主页，点击 `Actions` 标签
   - 查看部署工作流状态
   - 第一次部署可能需要几分钟

4. **访问网站**
   - 部署成功后访问: https://du9uay.github.io/model/

## 📦 技术特点

- **大文件支持**: 使用Git LFS存储251MB的3D模型文件，保留完整的颜色信息
- **3D展示**: 基于Three.js的高性能3D模型渲染
- **流式加载**: 支持大型OBJ文件的流式加载，带进度显示
- **顶点颜色**: 完整保留和显示模型的顶点颜色数据

## 🛠️ 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm start

# 构建生产版本
npm run build
```

## 📝 注意事项

- 模型文件较大（251MB），首次加载需要一些时间
- 使用Git LFS管理大文件，克隆仓库时需要安装Git LFS
- GitHub Pages有带宽限制，频繁访问可能会达到限额

## 🔧 故障排除

如果模型无法加载：
1. 检查浏览器控制台是否有错误信息
2. 确保网络连接稳定
3. 清除浏览器缓存后重试
4. 确认GitHub LFS配额未超限

## 📄 许可

本项目仅供教学使用。
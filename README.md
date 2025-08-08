# 极耳激光焊接教学平台

这是一个展示极耳激光焊接设备3D模型的教学平台。

## 🌐 在线访问

✅ **网站已成功部署！**

访问地址：https://du9uay.github.io/model/

## 🚀 GitHub Pages 配置

### 重要：请完成以下配置

1. **进入仓库设置**
   - 访问: https://github.com/Du9uay/model/settings/pages
   
2. **配置Pages Source**
   - 在 `Source` 部分选择 `GitHub Actions`
   - 点击 `Save` 保存

3. **查看部署状态**
   - 访问: https://github.com/Du9uay/model/actions
   - 确认最新的工作流显示绿色✅

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
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      // 增加webpack对大文件的支持
      webpackConfig.performance = {
        ...webpackConfig.performance,
        maxAssetSize: 300000000, // 300MB
        maxEntrypointSize: 300000000,
        hints: false
      };
      
      // 确保开发服务器可以处理大的静态文件
      if (webpackConfig.devServer) {
        webpackConfig.devServer.client = {
          ...webpackConfig.devServer.client,
          overlay: false
        };
      }
      
      return webpackConfig;
    }
  },
  devServer: {
    // 配置开发服务器以正确处理大文件
    compress: false, // 对于大文件禁用压缩
    client: {
      overlay: false,
      progress: true
    },
    static: {
      directory: 'public',
      serveIndex: true,
      watch: {
        ignored: /node_modules/
      }
    }
  }
};
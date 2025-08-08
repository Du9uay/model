import React from 'react';
import { motion } from 'framer-motion';
import OBJModelViewer from '../components/OBJModelViewer';

const ModelViewerPage: React.FC = () => {

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            <span className="gradient-text-accent">极耳激光焊接设备 3D 模型</span>
          </h1>
          <p className="text-gray-400">
            交互式查看极耳激光焊接设备的详细3D结构
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* 左侧信息面板 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
              <h3 className="text-white font-semibold mb-4">设备信息</h3>
              
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-900/50 rounded">
                  <div className="text-gray-400 mb-1">设备名称</div>
                  <div className="text-white">极耳激光焊接设备</div>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded">
                  <div className="text-gray-400 mb-1">型号</div>
                  <div className="text-white">JH-总装</div>
                </div>
                
                <div className="p-3 bg-gray-900/50 rounded">
                  <div className="text-gray-400 mb-1">主要功能</div>
                  <div className="text-white text-xs leading-relaxed">
                    用于动力电池极耳与汇流排的高精度激光焊接
                  </div>
                </div>
              </div>

              {/* 使用说明 */}
              <div className="mt-6 p-3 bg-gray-900/50 rounded-lg">
                <h4 className="text-sm font-semibold text-gray-300 mb-2">操作说明</h4>
                <ul className="text-xs text-gray-400 space-y-1">
                  <li>• 左键拖动：旋转模型</li>
                  <li>• 右键拖动：平移视角</li>
                  <li>• 滚轮：缩放大小</li>
                  <li>• 使用控制面板调整显示</li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* 右侧3D查看器 */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3"
          >
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden" style={{ height: '600px' }}>
              <OBJModelViewer />
            </div>
          </motion.div>
        </div>

        {/* 底部信息栏 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-4 bg-gray-800/30 backdrop-blur-sm rounded-lg border border-gray-700"
        >
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-300 mb-1">当前模型</h3>
              <p className="text-xs text-gray-500">
                JH-总装 - 极耳激光焊接设备 (GLB格式)
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
              >
                刷新页面
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 text-sm bg-gray-700 text-gray-300 rounded-lg hover:bg-gray-600 transition-all"
              >
                返回首页
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ModelViewerPage;



import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, RefreshCw, CheckCircle } from '../components/Icons';
import { Link } from 'react-router-dom';
import MatchingQuiz from '../components/MatchingQuiz';
import { MatchingQuestion } from '../types/matching';

/**
 * 匹配题演示页面
 * 展示平台入驻策略相关的匹配题练习
 */
const MatchingQuizPage: React.FC = () => {
  const [showResult, setShowResult] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});

  // 示例匹配题数据 - 平台入驻策略相关
  const matchingQuestions: MatchingQuestion[] = [
    {
      id: 'platform_matching_1',
      title: '平台特色与用户群体匹配',
      leftItems: [
        { id: 'platform_taobao', text: '淘宝' },
        { id: 'platform_douyin', text: '抖音' },
        { id: 'platform_pinduoduo', text: '拼多多' },
        { id: 'platform_xiaohongshu', text: '小红书' }
      ],
      rightItems: [
        { id: 'user_young_female', text: '年轻女性用户为主' },
        { id: 'user_comprehensive', text: '综合性购物平台用户' },
        { id: 'user_price_sensitive', text: '价格敏感型用户' },
        { id: 'user_entertainment', text: '娱乐导向消费用户' }
      ],
      correctMatches: {
        'platform_taobao': 'user_comprehensive',
        'platform_douyin': 'user_entertainment',
        'platform_pinduoduo': 'user_price_sensitive',
        'platform_xiaohongshu': 'user_young_female'
      }
    },
    {
      id: 'qualification_matching',
      title: '店铺类型与所需资质匹配',
      leftItems: [
        { id: 'store_flagship', text: '品牌旗舰店' },
        { id: 'store_franchise', text: '品牌专卖店' },
        { id: 'store_ordinary', text: '普通店铺' },
        { id: 'store_specialty', text: '专营店' }
      ],
      rightItems: [
        { id: 'qual_brand_auth', text: '品牌商标注册证+授权书' },
        { id: 'qual_business_license', text: '营业执照即可' },
        { id: 'qual_brand_owner', text: '品牌商标注册证（自有）' },
        { id: 'qual_multi_brand', text: '多个品牌授权证明' }
      ],
      correctMatches: {
        'store_flagship': 'qual_brand_owner',
        'store_franchise': 'qual_brand_auth',
        'store_ordinary': 'qual_business_license',
        'store_specialty': 'qual_multi_brand'
      }
    },
    {
      id: 'cost_matching',
      title: '平台费用类型匹配',
      leftItems: [
        { id: 'fee_deposit', text: '保证金' },
        { id: 'fee_commission', text: '技术服务费（佣金）' },
        { id: 'fee_annual', text: '年费' },
        { id: 'fee_promotion', text: '推广费用' }
      ],
      rightItems: [
        { id: 'desc_refundable', text: '可退还，违规时扣除' },
        { id: 'desc_percentage', text: '按交易额百分比收取' },
        { id: 'desc_fixed_annual', text: '每年固定收取' },
        { id: 'desc_optional_marketing', text: '可选的营销投入' }
      ],
      correctMatches: {
        'fee_deposit': 'desc_refundable',
        'fee_commission': 'desc_percentage',
        'fee_annual': 'desc_fixed_annual',
        'fee_promotion': 'desc_optional_marketing'
      }
    }
  ];

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const currentQuestion = matchingQuestions[currentQuestionIndex];

  /**
   * 处理答案变化
   */
  const handleAnswerChange = (answers: { [key: string]: string }) => {
    setUserAnswers(prev => ({
      ...prev,
      ...answers
    }));
  };

  /**
   * 切换到下一题
   */
  const handleNextQuestion = () => {
    if (currentQuestionIndex < matchingQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setShowResult(false);
    }
  };

  /**
   * 切换到上一题
   */
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setShowResult(false);
    }
  };

  /**
   * 显示答案
   */
  const handleShowResult = () => {
    setShowResult(true);
  };

  /**
   * 重新开始当前题目
   */
  const handleRestart = () => {
    setShowResult(false);
    setUserAnswers(prev => {
      const newAnswers = { ...prev };
      currentQuestion.leftItems.forEach(item => {
        delete newAnswers[`${item.id}_match`];
      });
      return newAnswers;
    });
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面头部 */}
        <motion.div 
          className="flex items-center justify-between mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Link
            to="/"
            className="flex items-center space-x-2 coral hover:text-light transition-colors group"
          >
            <motion.div
              whileHover={{ x: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <ArrowLeft className="w-5 h-5" />
            </motion.div>
            <span>返回首页</span>
          </Link>

          <div className="text-center">
            <h1 className="text-2xl font-bold text-light">
              <span className="gradient-text-accent">匹配题练习</span>
            </h1>
            <p className="surf-200 text-sm mt-1">
              题目 {currentQuestionIndex + 1} / {matchingQuestions.length}
            </p>
          </div>

          <div className="flex space-x-2">
            <motion.button
              onClick={handleRestart}
              className="p-2 coral hover:text-light transition-colors"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              title="重新开始"
            >
              <RefreshCw className="w-5 h-5" />
            </motion.button>
          </div>
        </motion.div>

        {/* 进度条 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <div className="bg-mid rounded-full h-2">
            <motion.div 
              className="gradient-accent h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ 
                width: `${((currentQuestionIndex + 1) / matchingQuestions.length) * 100}%` 
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            />
          </div>
        </motion.div>

        {/* 匹配题组件 */}
        <motion.div
          className="glass-card p-6 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <MatchingQuiz
            question={currentQuestion}
            onAnswerChange={handleAnswerChange}
            showResult={showResult}
            className="max-w-none"
          />
        </motion.div>

        {/* 操作按钮区域 */}
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 sm:space-x-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          {/* 左侧按钮组 */}
          <div className="flex space-x-3">
            <motion.button
              onClick={handlePrevQuestion}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-mid hover:bg-scarlet disabled:opacity-50 disabled:cursor-not-allowed
                         text-light rounded-lg transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: currentQuestionIndex > 0 ? 1.05 : 1 }}
              whileTap={{ scale: currentQuestionIndex > 0 ? 0.95 : 1 }}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>上一题</span>
            </motion.button>

            <motion.button
              onClick={handleShowResult}
              disabled={showResult}
              className="px-4 py-2 bg-coral hover:bg-orange disabled:opacity-50 disabled:cursor-not-allowed
                         text-light rounded-lg transition-all duration-300 flex items-center space-x-2"
              whileHover={{ scale: !showResult ? 1.05 : 1 }}
              whileTap={{ scale: !showResult ? 0.95 : 1 }}
            >
              <CheckCircle className="w-4 h-4" />
              <span>查看答案</span>
            </motion.button>
          </div>

          {/* 右侧按钮 */}
          <motion.button
            onClick={handleNextQuestion}
            disabled={currentQuestionIndex === matchingQuestions.length - 1}
            className="px-6 py-2 gradient-accent hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed
                       text-light rounded-lg transition-all duration-300 flex items-center space-x-2 shadow-accent"
            whileHover={{ 
              scale: currentQuestionIndex < matchingQuestions.length - 1 ? 1.05 : 1,
              boxShadow: "0 10px 25px rgba(232, 141, 114, 0.3)"
            }}
            whileTap={{ scale: currentQuestionIndex < matchingQuestions.length - 1 ? 0.95 : 1 }}
          >
            <span>下一题</span>
            <motion.div
              animate={{ x: [0, 5, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowLeft className="w-4 h-4 rotate-180" />
            </motion.div>
          </motion.button>
        </motion.div>

        {/* 学习提示 */}
        <motion.div
          className="mt-8 glass-card p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <h3 className="text-lg font-semibold coral mb-3">
            💡 学习提示
          </h3>
          <div className="surf-200 space-y-2 text-sm">
            <p>• 仔细阅读左右两侧的选项内容</p>
            <p>• 根据平台特色和实际业务需求进行匹配</p>
            <p>• 完成连线后点击"查看答案"验证正确性</p>
            <p>• 可以多次重置和重新连线直到掌握知识点</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MatchingQuizPage;
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Target, Settings, Network, Cpu, Zap, Monitor } from '../components/Icons';
import Model3DViewer from '../components/Model3DViewer';

const HomePage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const fullText = '主流平台入驻策略与资质准备';
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref);
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 300], [0, -50]);

  // 打字机效果
  useEffect(() => {
    if (textIndex < fullText.length) {
      const timer = setTimeout(() => {
        setDisplayText(fullText.slice(0, textIndex + 1));
        setTextIndex(textIndex + 1);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [textIndex, fullText]);

  // 滚动动画控制
  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [controls, isInView]);

  const courseModules = [
    {
      title: '一. 国内主流平台概览与选择策略',
      description: '全面介绍淘宝、抖音、拼多多等主流平台，让学生知晓各平台的定位、用户群体，学会依据业务类型选择适配平台，掌握查询入驻资质要求的技能。',
      icon: BookOpen,
      path: '/',
      color: 'gradient-accent',
      delay: 0.1
    },
    {
      title: '二. 店铺类型与经营品类匹配规则',
      description: '聚焦主流平台店铺类型与经营品类的匹配规则，学习如何选定合适店铺类型，掌握不同经营品类的资质要求，提升入驻的有效性与专业性。',
      icon: Settings,
      path: '/',
      color: 'gradient-secondary',
      delay: 0.2
    },
    {
      title: '三. 平台入驻流程讲解',
      description: '详细讲解主流平台入驻的全流程，从准备营业执照、资质证明等材料，到填写入驻表单、与平台沟通，让学生掌握平台入驻的实操技能。',
      icon: Monitor,
      path: '/',
      color: 'gradient-secondary',
      delay: 0.3
    },
    {
      title: '四. 核心资质与费用明细',
      description: '学习识别不同平台所需的核心资质，如营业执照、行业许可证等，了解各平台的入驻费用构成，掌握资质准备及费用把控的实用技能。',
      icon: Network,
      path: '/',
      color: 'gradient-accent',
      delay: 0.4
    },
    {
      title: '五. 入驻案例分析',
      description: '通过真实案例分析不同类型商家的入驻策略，展示成功和失败案例，帮助学生理解如何根据自身情况制定合适的平台入驻方案。',
      icon: Zap,
      path: '/',
      color: 'gradient-accent',
      delay: 0.5
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  const cardHover = {
    scale: 1.05,
    rotateX: 5,
    rotateY: 5,
    transition: {
      type: "spring" as const,
      stiffness: 300,
      damping: 20
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 overflow-hidden">
      <div className="max-w-6xl mx-auto">
        {/* 主标题区域 - 带动画 */}
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ y }}
        >
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 gradient-accent rounded-full mb-6 shadow-accent"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.2 
            }}
            whileHover={{ 
              scale: 1.1, 
              rotate: 360,
              transition: { duration: 0.3 }
            }}
          >
            <Cpu className="w-10 h-10 text-light" />
          </motion.div>
          
          <motion.h1 className="text-5xl font-bold text-light mb-6 leading-tight" data-slot="home.hero.title">
            <span className="inline-block gradient-text-accent">
              {displayText}
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="coral"
              >
                |
              </motion.span>
            </span>
            <motion.span 
              className="block text-2xl font-normal coral mt-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 2, duration: 0.8 }}
              data-slot="home.hero.subtitle"
            >
              3D打印技术核心教学
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl surf-200 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            data-slot="home.hero.desc"
          >
            通过系统性学习增材制造技术基础，掌握3D打印工艺、软件应用和后处理技术，
            培养具备增材制造全流程设计、制造和质量控制能力的技术人才。
          </motion.p>
        </motion.div>

        {/* 3D 模型展示区域 */}
        <motion.div
          className="mb-16 flex justify-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3, duration: 0.8 }}
        >
          <div className="text-center">
            <motion.h3
              className="text-2xl font-semibold text-light mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.2, duration: 0.6 }}
            >
              <span className="gradient-text-accent">增材制造实物展示</span>
            </motion.h3>
            <Model3DViewer
              modelPath="/models/JH-总装.obj"
              width={window.innerWidth > 768 ? 800 : window.innerWidth - 40}
              height={window.innerWidth > 768 ? 500 : 300}
              autoRotate={true}
            />
            <motion.p
              className="surf-200 mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.6 }}
            >
              这是一个通过增材制造技术生产的精密部件示例，展示了3D打印在复杂结构制造中的优势
            </motion.p>
          </div>
        </motion.div>

        {/* 课程特色 - 滚动动画 */}
        <motion.div 
          className="grid md:grid-cols-3 gap-8 mb-16 max-w-5xl mx-auto"
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          data-slot="home.features"
        >
          {[
            { icon: Target, title: '实用性强', desc: '紧密结合电商平台实际运营需求，从平台选择到入驻执行，培养学员快速落地的实操能力。', color: 'gradient-accent' },
            { icon: Users, title: '系统完整', desc: '涵盖主流电商平台入驻的各个环节，从平台选择到费用管理，构建完整的入驻知识体系。', color: 'gradient-secondary' },
            { icon: Award, title: '就业导向', desc: '课程内容与岗位需求紧密对应，助力学员在增材制造领域实现职业发展。', color: 'gradient-accent' }
          ].map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="glass-card p-8 text-center cursor-pointer"
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
                  borderColor: "rgb(var(--coral) / 0.5)"                }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className={`w-16 h-16 ${feature.color} rounded-full flex items-center justify-center mx-auto mb-4 shadow-accent`}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Icon className="w-8 h-8 text-light" />
                </motion.div>
                <h3 className="text-xl font-semibold coral mb-3">{feature.title}</h3>
                <p className="surf-200">{feature.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div 
          className="glass-card p-12 text-center max-w-4xl mx-auto"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ 
            type: "spring", 
            stiffness: 100, 
            damping: 15,
            delay: 0.2 
          }}
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold coral mb-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            viewport={{ once: true }}
          >
            开始您的3D打印学习之旅
          </motion.h2>
          
          <motion.p 
            className="text-xl surf-200 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            掌握未来制造技术，开启职业新篇章
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Link
              to="/quiz"
              className="inline-flex items-center px-8 py-4 gradient-accent text-light font-semibold rounded-full hover:shadow-accent transition-all duration-300 group"
            >
              开始学习
              <motion.div
                whileHover={{ x: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ArrowRight className="w-5 h-5 ml-2" />
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default HomePage;

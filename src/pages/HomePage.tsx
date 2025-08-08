import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView, useScroll, useTransform } from 'framer-motion';
import { ArrowRight, BookOpen, Users, Award, Target, Settings, Network, Cpu, Zap, Monitor } from '../components/Icons';
import OBJModelViewer from '../components/OBJModelViewer';

const HomePage: React.FC = () => {
  const [displayText, setDisplayText] = useState('');
  const [textIndex, setTextIndex] = useState(0);
  const fullText = '极耳激光焊接技术教学平台';
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
      title: '一. 极耳激光焊接技术原理',
      description: '深入学习激光焊接的物理原理，了解激光功率、焊接速度、光斑直径等关键参数对焊接质量的影响，掌握激光焊接的工艺特点。',
      icon: BookOpen,
      path: '/',
      color: 'gradient-accent',
      delay: 0.1
    },
    {
      title: '二. 极耳焊接设备构成与操作',
      description: '详细介绍极耳激光焊接设备的各个组成部分，包括激光器、光学系统、工作台、控制系统等，学习设备的正确操作流程。',
      icon: Settings,
      path: '/',
      color: 'gradient-secondary',
      delay: 0.2
    },
    {
      title: '三. 焊接工艺参数优化',
      description: '学习如何根据不同的极耳材料和厚度，合理设置激光功率、焊接速度、离焦量等工艺参数，获得最佳的焊接效果。',
      icon: Monitor,
      path: '/',
      color: 'gradient-secondary',
      delay: 0.3
    },
    {
      title: '四. 焊接质量检测与控制',
      description: '掌握极耳焊接质量的检测方法，包括外观检查、强度测试、导电性能检测等，学习质量问题的分析与改进措施。',
      icon: Network,
      path: '/',
      color: 'gradient-accent',
      delay: 0.4
    },
    {
      title: '五. 实际案例与故障处理',
      description: '通过真实的生产案例学习极耳焊接的实际应用，分析常见的焊接缺陷及其成因，掌握故障诊断与处理技能。',
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
              极耳激光焊接工艺与设备
            </motion.span>
          </motion.h1>
          
          <motion.p 
            className="text-xl surf-200 max-w-4xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            data-slot="home.hero.desc"
          >
            通过系统性学习激光焊接技术原理，掌握极耳焊接工艺、设备操作和质量控制技术，
            培养具备动力电池极耳焊接全流程设计、制造和质量控制能力的专业技术人才。
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
              <span className="gradient-text-accent">极耳激光焊接设备展示</span>
            </motion.h3>
            <div className="w-full" style={{ height: window.innerWidth > 768 ? '500px' : '300px' }}>
              <OBJModelViewer />
            </div>
            <motion.p
              className="surf-200 mt-4 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5, duration: 0.6 }}
            >
              这是极耳激光焊接设备的3D展示模型，展示了激光焊接技术在动力电池制造中的关键作用
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
            { icon: Target, title: '实用性强', desc: '紧密结合动力电池制造实际需求，从设备操作到工艺优化，培养学员快速上岗的实操能力。', color: 'gradient-accent' },
            { icon: Users, title: '系统完整', desc: '涵盖极耳激光焊接的各个环节，从设备认知到质量控制，构建完整的焊接技术知识体系。', color: 'gradient-secondary' },
            { icon: Award, title: '就业导向', desc: '课程内容与岗位需求紧密对应，助力学员在新能源电池制造领域实现职业发展。', color: 'gradient-accent' }
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
            开始您的极耳激光焊接学习之旅
          </motion.h2>
          
          <motion.p 
            className="text-xl surf-200 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            viewport={{ once: true }}
          >
            掌握激光焊接技术，开启新能源职业新篇章
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

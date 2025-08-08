# 网页课件自动化生产系统 Makefile
# 使用: make <命令> [参数]

# 默认目标：显示帮助信息
.DEFAULT_GOAL := help

# 颜色定义
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BLUE   := \033[0;34m
RED    := \033[0;31m
NC     := \033[0m # No Color

# 变量定义
COURSE_ID ?= 
MODE ?= default

#========================================
# 基础开发命令
#========================================

## 启动开发服务器
dev:
	@echo "$(BLUE)🚀 启动开发服务器...$(NC)"
	npm start

## 构建生产版本
build:
	@echo "$(BLUE)📦 构建生产版本...$(NC)"
	npm run build

## 运行测试
test:
	@echo "$(BLUE)🧪 运行测试...$(NC)"
	npm test

## 安装依赖
install:
	@echo "$(BLUE)📦 安装项目依赖...$(NC)"
	npm install

## 清理构建文件和依赖
clean:
	@echo "$(YELLOW)🧹 清理构建文件...$(NC)"
	rm -rf build/
	rm -rf node_modules/
	rm -rf courses/*/.run/
	@echo "$(GREEN)✅ 清理完成$(NC)"

## 重新安装依赖
reinstall: clean install
	@echo "$(GREEN)✅ 重新安装完成$(NC)"

#========================================
# 课程自动化命令
#========================================

## 一键自动化生产课程 (需要: COURSE_ID=xxx)
auto:
	@if [ -z "$(COURSE_ID)" ]; then \
		echo "$(RED)❌ 错误: 请提供课程ID$(NC)"; \
		echo "使用方法: make auto COURSE_ID=my-course"; \
		exit 1; \
	fi
	@echo "$(BLUE)🚀 启动一键自动化流程: $(COURSE_ID)$(NC)"
	npm run course:auto $(COURSE_ID) $(if $(filter-out default,$(MODE)),--$(MODE))

## 快速模式自动化 (需要: COURSE_ID=xxx)
auto-fast:
	@make auto MODE=fast

## 严格模式自动化 (需要: COURSE_ID=xxx)
auto-strict:
	@make auto MODE=strict

## 准备课程文件夹 (需要: COURSE_ID=xxx)
prepare:
	@if [ -z "$(COURSE_ID)" ]; then \
		echo "$(RED)❌ 错误: 请提供课程ID$(NC)"; \
		echo "使用方法: make prepare COURSE_ID=my-course"; \
		exit 1; \
	fi
	@echo "$(BLUE)📁 创建课程目录: courses/$(COURSE_ID)$(NC)"
	@mkdir -p courses/$(COURSE_ID)
	@echo "$(YELLOW)📝 请放入以下文件:$(NC)"
	@echo "  - courses/$(COURSE_ID)/course.md (课程讲义)"
	@echo "  - courses/$(COURSE_ID)/palette.txt (配色方案)"
	@echo "$(GREEN)✅ 准备完成后运行: make auto COURSE_ID=$(COURSE_ID)$(NC)"

#========================================
# 单步执行命令（高级用户）
#========================================

## 初始化课程 (需要: COURSE_ID=xxx)
init:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:init $(COURSE_ID)

## 生成架构
arch:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:arch $(COURSE_ID)

## 生成主题
theme:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:theme $(COURSE_ID)

## 注入主题
inject:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:inject $(COURSE_ID)

## 质量检测
qa:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:qa $(COURSE_ID)

## 发布课程
publish:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:publish $(COURSE_ID)

#========================================
# 修复和工具命令
#========================================

## 智能修复 (需要: COURSE_ID=xxx)
repair:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	@echo "$(BLUE)🔧 运行智能修复: $(COURSE_ID)$(NC)"
	npm run course:repair $(COURSE_ID)

## 修复对比度
repair-contrast:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:repair $(COURSE_ID) --contrast

## 修复格式
repair-format:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:repair $(COURSE_ID) --format

## 修复主题
fix-theme:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:theme:fix $(COURSE_ID)

## 解锁课程
unlock:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run course:unlock $(COURSE_ID)

## 回滚到指定阶段 (需要: COURSE_ID=xxx STAGE=xxx)
rollback:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	@[ -z "$(STAGE)" ] && echo "$(RED)❌ 需要 STAGE (如: queued)$(NC)" && exit 1 || true
	npm run course:rollback $(COURSE_ID) --to $(STAGE)

#========================================
# Gate审批命令
#========================================

## 审批架构Gate
approve-arch:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run gate:approve $(COURSE_ID) arch

## 审批主题Gate
approve-theme:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run gate:approve $(COURSE_ID) theme

## 审批发布Gate
approve-publish:
	@[ -z "$(COURSE_ID)" ] && echo "$(RED)❌ 需要 COURSE_ID$(NC)" && exit 1 || true
	npm run gate:approve $(COURSE_ID) publish

#========================================
# 系统管理命令
#========================================

## 运行系统测试
test-system:
	@echo "$(BLUE)🧪 运行系统测试...$(NC)"
	npm run test:system

## 列出所有课程
list:
	@echo "$(BLUE)📚 现有课程列表:$(NC)"
	@ls -la courses/ 2>/dev/null | grep "^d" | awk '{print "  - " $$9}' | grep -v "^\s*-\s*$$" || echo "  (暂无课程)"

## 查看课程状态 (需要: COURSE_ID=xxx)
status:
	@if [ -z "$(COURSE_ID)" ]; then \
		echo "$(RED)❌ 错误: 请提供课程ID$(NC)"; \
		exit 1; \
	fi
	@if [ -f "courses/$(COURSE_ID)/.run/run.json" ]; then \
		echo "$(BLUE)📊 课程状态: $(COURSE_ID)$(NC)"; \
		cat courses/$(COURSE_ID)/.run/run.json | grep -E '"stage"|"status"' | head -10; \
	else \
		echo "$(YELLOW)⚠️  课程 $(COURSE_ID) 尚未初始化$(NC)"; \
	fi

## 查看课程报告 (需要: COURSE_ID=xxx)
report:
	@if [ -z "$(COURSE_ID)" ]; then \
		echo "$(RED)❌ 错误: 请提供课程ID$(NC)"; \
		exit 1; \
	fi
	@if [ -f "courses/$(COURSE_ID)/.run/artifacts/auto-production-report.json" ]; then \
		echo "$(BLUE)📊 自动化报告: $(COURSE_ID)$(NC)"; \
		cat courses/$(COURSE_ID)/.run/artifacts/auto-production-report.json; \
	else \
		echo "$(YELLOW)⚠️  未找到自动化报告$(NC)"; \
	fi

#========================================
# 帮助命令
#========================================

## 显示帮助信息
help:
	@echo "$(GREEN)=====================================$(NC)"
	@echo "$(GREEN)网页课件自动化生产系统 - Make命令$(NC)"
	@echo "$(GREEN)=====================================$(NC)"
	@echo ""
	@echo "$(YELLOW)基础用法:$(NC)"
	@echo "  make <命令> [参数]"
	@echo ""
	@echo "$(YELLOW)快速开始:$(NC)"
	@echo "  1. make prepare COURSE_ID=my-course    # 准备课程目录"
	@echo "  2. 放入 course.md 和 palette.txt 文件"
	@echo "  3. make auto COURSE_ID=my-course       # 一键自动化"
	@echo ""
	@echo "$(YELLOW)可用命令:$(NC)"
	@grep -E '^##' Makefile | sed 's/## /  make /' | sed 's/:.*$$//'
	@echo ""
	@echo "$(YELLOW)常用示例:$(NC)"
	@echo "  make dev                               # 启动开发服务器"
	@echo "  make auto COURSE_ID=plc-basics         # 自动化生产课程"
	@echo "  make auto-fast COURSE_ID=plc-basics    # 快速模式"
	@echo "  make repair COURSE_ID=plc-basics       # 智能修复"
	@echo "  make status COURSE_ID=plc-basics       # 查看状态"
	@echo "  make list                              # 列出所有课程"
	@echo ""
	@echo "$(GREEN)=====================================$(NC)"

## 显示简短帮助
h: help

.PHONY: dev build test install clean reinstall \
        auto auto-fast auto-strict prepare \
        init arch theme inject qa publish \
        repair repair-contrast repair-format fix-theme unlock rollback \
        approve-arch approve-theme approve-publish \
        test-system list status report \
        help h
import type { MeetingTemplate } from '../types';

export const meetingTemplates: MeetingTemplate[] = [
  {
    id: 'weekly',
    name: '周会模板',
    scenario: '适用于团队固定节奏同步进展、风险和下周计划。',
    agenda: ['回顾本周完成事项', '同步当前阻塞点', '确认下周重点任务', '明确负责人和截止时间'],
    checklist: ['更新项目进度表', '整理风险清单', '准备需要协作的问题'],
    commonActions: ['补充进度说明', '确认阻塞解决人', '更新下周计划'],
  },
  {
    id: 'retro',
    name: '项目复盘模板',
    scenario: '适用于阶段性复盘项目结果、经验和改进方向。',
    agenda: ['回顾项目目标', '分析实际结果', '讨论成功经验与问题', '沉淀下一步改进动作'],
    checklist: ['准备目标与结果对比', '收集用户或团队反馈', '整理关键数据'],
    commonActions: ['输出复盘文档', '建立改进任务', '同步经验沉淀'],
  },
  {
    id: 'product-review',
    name: '产品评审模板',
    scenario: '适用于需求、方案、原型或版本范围评审。',
    agenda: ['说明业务背景', '展示核心方案', '评审用户流程', '确认版本范围与风险'],
    checklist: ['准备需求文档', '准备原型链接', '列出争议点和待决策项'],
    commonActions: ['更新 PRD', '调整交互稿', '确认技术可行性'],
  },
  {
    id: 'customer',
    name: '客户沟通模板',
    scenario: '适用于客户需求沟通、项目推进和问题澄清。',
    agenda: ['确认客户目标', '同步当前进展', '讨论待解决问题', '明确双方后续动作'],
    checklist: ['整理客户背景', '准备问题清单', '确认历史沟通记录'],
    commonActions: ['发送会议纪要', '补充方案报价', '跟进客户反馈'],
  },
  {
    id: 'experiment',
    name: '实验分析会模板',
    scenario: '适用于增长实验、A/B 测试或数据分析结果讨论。',
    agenda: ['回顾实验假设', '查看核心指标', '分析异常变化', '确定下一轮实验方向'],
    checklist: ['准备实验数据', '校验样本量', '整理用户行为路径'],
    commonActions: ['补充指标看板', '调整实验方案', '确认上线窗口'],
  },
];

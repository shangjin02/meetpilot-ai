import type { ActionItem, Meeting, PostMeetingSummary, PreMeetingBrief } from '../types';
import { uid } from './utils';

const due = (daysFromNow: number) => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().slice(0, 10);
};

export const generatePreMeetingBrief = (meeting: Meeting): PreMeetingBrief => {
  const isGrowth = meeting.title.includes('增长') || meeting.goal.includes('转化');
  const isAi = meeting.title.includes('AI') || meeting.goal.includes('AI');
  const isSync = meeting.title.includes('同步') || meeting.title.includes('周');

  return {
    objective: `本次「${meeting.title}」应围绕「${meeting.goal}」展开，先统一当前背景与事实，再聚焦关键问题，最终形成可执行的负责人、截止时间和下一步计划。`,
    agenda: [
      `快速回顾会议背景：${meeting.background}`,
      isGrowth ? '复盘核心转化数据与异常节点' : isAi ? '确认 MVP 功能边界与用户场景' : '同步本周进展与当前阻塞',
      '讨论最需要决策的 2-3 个问题',
      '明确待办事项、负责人和截止时间',
    ],
    keyQuestions: [
      '当前最影响目标达成的问题是什么？',
      '哪些事项需要跨角色协作才能推进？',
      isGrowth ? '数据变化背后的用户行为假设是否成立？' : isAi ? '首版能力如何证明用户价值？' : '哪些阻塞会影响下周交付？',
      '哪些任务必须在下次会议前完成？',
    ],
    preparationChecklist: [
      '提前整理项目进度、关键数据和相关资料链接',
      '列出需要会议决策的问题清单',
      '确认参会人是否覆盖产品、技术、数据和执行负责人',
      isGrowth ? '准备分渠道转化漏斗与用户反馈摘要' : isAi ? '准备功能范围草案和原型示意' : '准备联调清单、缺陷列表和风险项',
    ],
    risks: [
      '如果会议只讨论现象而不明确负责人，后续推进容易失焦。',
      '若缺少数据或资料支撑，决策可能停留在主观判断。',
      isSync ? '联调阶段的阻塞需要当天确认归属，否则会持续影响排期。' : '跨角色依赖需要在会议中直接确认时间节点。',
    ],
    participantFocus: meeting.participants.map((person) => {
      if (person.includes('产品')) return `${person}：聚焦目标、范围、优先级和最终决策。`;
      if (person.includes('数据')) return `${person}：准备指标变化、异常原因和验证方式。`;
      if (person.includes('设计')) return `${person}：关注用户流程、信息层级和交互成本。`;
      if (person.includes('技术') || person.includes('工程') || person.includes('前端') || person.includes('后端')) return `${person}：评估实现风险、依赖和交付时间。`;
      return `${person}：同步执行进展、资源需求和后续动作。`;
    }),
  };
};

export const extractActionItems = (_summary: string, meeting: Meeting): ActionItem[] => [
  {
    id: uid('action'),
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    title: meeting.title.includes('增长') ? '整理需求优先级与增长实验优化方向' : '整理下一阶段任务优先级',
    owner: meeting.participants.find((person) => person.includes('产品')) ?? meeting.participants[0] ?? '负责人',
    dueDate: due(5),
    priority: '高',
    status: '待开始',
  },
  {
    id: uid('action'),
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    title: meeting.title.includes('AI') ? '完成 AI 助手首版交互调整' : '完成页面交互调整与联调验证',
    owner: meeting.participants.find((person) => person.includes('前端') || person.includes('设计')) ?? '执行负责人',
    dueDate: due(7),
    priority: '中',
    status: '待开始',
  },
  {
    id: uid('action'),
    meetingId: meeting.id,
    meetingTitle: meeting.title,
    title: meeting.title.includes('增长') ? '补充核心指标看板和分渠道分析' : '补充核心指标看板与验收说明',
    owner: meeting.participants.find((person) => person.includes('数据') || person.includes('测试')) ?? '数据负责人',
    dueDate: due(4),
    priority: '中',
    status: '待开始',
  },
];

export const generatePostMeetingSummary = (transcript: string, meeting: Meeting): PostMeetingSummary => {
  const actionItems = extractActionItems(transcript, meeting);

  return {
    summary: `本次「${meeting.title}」围绕${meeting.goal}展开，团队结合会议背景「${meeting.background}」同步了当前进展、主要风险和下一阶段安排，并明确了需要继续跟进的事项。`,
    conclusions: [
      '当前整体方向基本明确，但仍有部分执行细节需要在会后补齐。',
      meeting.title.includes('增长') ? '增长实验需要优先分析转化流失节点，并形成下一轮优化假设。' : '下一阶段应优先处理关键阻塞和跨角色依赖。',
      '各负责人需要在下次会议前同步进展，避免待办停留在口头约定。',
    ],
    decisions: [
      '本轮优先处理影响交付或指标结果的关键问题。',
      '会后待办统一进入任务跟踪，按负责人和截止时间推进。',
      '下次会议前检查所有高优先级事项的完成情况。',
    ],
    openIssues: [
      '部分数据或验收标准仍需补充确认。',
      '跨团队协作时间点需要进一步对齐。',
      '如果关键依赖延期，需要准备替代方案。',
    ],
    actionItems,
    followUpDraft: `各位好，本次「${meeting.title}」已确认下一阶段重点事项。请各负责人按照待办列表推进，并在截止时间前同步进展；如遇到阻塞，请及时在群内说明需要的支持。`,
  };
};

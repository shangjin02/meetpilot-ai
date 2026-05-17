import type { ActionItem, ActionStatus, Meeting, MeetingStatus, Priority } from '../types';

export const uid = (prefix: string) =>
  `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

export const formatDateTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

export const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('zh-CN', {
    month: '2-digit',
    day: '2-digit',
  }).format(date);
};

export const isOverdue = (item: ActionItem) => {
  if (item.status === '已完成') return false;
  const endOfDueDate = new Date(`${item.dueDate}T23:59:59`);
  return endOfDueDate.getTime() < Date.now();
};

export const actionDisplayStatus = (item: ActionItem): ActionStatus | '已逾期' =>
  isOverdue(item) ? '已逾期' : item.status;

export const getAllActionItems = (meetings: Meeting[]) =>
  meetings.flatMap((meeting) => meeting.actionItems);

export const countByStatus = (meetings: Meeting[], status: MeetingStatus) =>
  meetings.filter((meeting) => meeting.status === status).length;

export const statusTone: Record<MeetingStatus | ActionStatus | '已逾期', string> = {
  待准备: 'bg-amber-50 text-amber-700 ring-amber-200',
  已准备: 'bg-blue-50 text-blue-700 ring-blue-200',
  待整理: 'bg-violet-50 text-violet-700 ring-violet-200',
  待跟进: 'bg-cyan-50 text-cyan-700 ring-cyan-200',
  已完成: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  待开始: 'bg-slate-100 text-slate-700 ring-slate-200',
  进行中: 'bg-blue-50 text-blue-700 ring-blue-200',
  已逾期: 'bg-red-50 text-red-700 ring-red-200',
};

export const priorityTone: Record<Priority, string> = {
  高: 'bg-red-50 text-red-700 ring-red-200',
  中: 'bg-amber-50 text-amber-700 ring-amber-200',
  低: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
};

export const sampleTranscript = `本次会议主要复盘项目进展和下一阶段安排。产品侧说明近期增长实验的整体转化低于预期，用户在关键路径中存在流失，需要优先分析入口文案和页面交互。

数据同学补充了核心指标变化，认为需要在本周四前补齐分渠道转化看板，并标记异常数据来源。前端同学反馈页面交互调整可以在下周一前完成，但接口联调仍需要后端支持。

会议决定下阶段优先解决接口联调、数据验收和需求优先级排序问题。产品负责人将在本周五前整理需求优先级，技术负责人负责确认联调计划，运营同学准备下一轮实验方案。`;

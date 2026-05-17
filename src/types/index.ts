export type MeetingStatus = '待准备' | '已准备' | '待整理' | '待跟进' | '已完成';
export type ActionStatus = '待开始' | '进行中' | '已完成';
export type ActionFilter = '全部' | ActionStatus | '已逾期';
export type Priority = '高' | '中' | '低';

export interface Meeting {
  id: string;
  title: string;
  time: string;
  participants: string[];
  goal: string;
  background: string;
  relatedMaterials?: string;
  extraNotes?: string;
  notes?: string;
  status: MeetingStatus;
  preBrief?: PreMeetingBrief;
  postSummary?: PostMeetingSummary;
  actionItems: ActionItem[];
}

export interface PreMeetingBrief {
  objective: string;
  agenda: string[];
  keyQuestions: string[];
  preparationChecklist: string[];
  risks: string[];
  participantFocus: string[];
}

export interface PostMeetingSummary {
  summary: string;
  conclusions: string[];
  decisions: string[];
  openIssues: string[];
  actionItems: ActionItem[];
  followUpDraft: string;
}

export interface ActionItem {
  id: string;
  meetingId: string;
  meetingTitle: string;
  title: string;
  owner: string;
  dueDate: string;
  priority: Priority;
  status: ActionStatus;
}

export interface MeetingTemplate {
  id: string;
  name: string;
  scenario: string;
  agenda: string[];
  checklist: string[];
  commonActions: string[];
}

export type PageKey = 'dashboard' | 'meetings' | 'actions' | 'templates';

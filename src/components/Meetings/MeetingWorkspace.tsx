import { useState } from 'react';
import { ArrowLeft, Bot, ClipboardCheck, FileText, ListTodo, Sparkles } from 'lucide-react';
import type { ActionStatus, Meeting, PostMeetingSummary, PreMeetingBrief } from '../../types';
import { formatDateTime, sampleTranscript, statusTone } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';
import { EmptyState } from '../common/EmptyState';
import { LoadingState } from '../common/LoadingState';
import { ActionItemCard } from '../Actions/ActionItemCard';

type TabKey = 'overview' | 'brief' | 'summary' | 'actions';

const tabs: { key: TabKey; label: string; icon: typeof FileText }[] = [
  { key: 'overview', label: '会议概览', icon: FileText },
  { key: 'brief', label: '会前准备', icon: Sparkles },
  { key: 'summary', label: '会议纪要', icon: ClipboardCheck },
  { key: 'actions', label: '待办事项', icon: ListTodo },
];

interface MeetingWorkspaceProps {
  meeting: Meeting;
  onBack: () => void;
  onGenerateBrief: (meetingId: string) => Promise<void>;
  onUpdateNotes: (meetingId: string, notes: string) => void;
  onGenerateSummary: (meetingId: string) => Promise<void>;
  onUpdateActionStatus: (itemId: string, status: ActionStatus) => void;
}

export function MeetingWorkspace({
  meeting,
  onBack,
  onGenerateBrief,
  onUpdateNotes,
  onGenerateSummary,
  onUpdateActionStatus,
}: MeetingWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('overview');
  const [loadingBrief, setLoadingBrief] = useState(false);
  const [loadingSummary, setLoadingSummary] = useState(false);

  const generateBrief = async () => {
    setLoadingBrief(true);
    await onGenerateBrief(meeting.id);
    setLoadingBrief(false);
    setActiveTab('brief');
  };

  const generateSummary = async () => {
    setLoadingSummary(true);
    await onGenerateSummary(meeting.id);
    setLoadingSummary(false);
    setActiveTab('summary');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Button variant="ghost" onClick={onBack} icon={<ArrowLeft className="h-4 w-4" />} className="mb-3 px-2">
            返回我的会议
          </Button>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-950">{meeting.title}</h1>
            <Badge className={statusTone[meeting.status]}>{meeting.status}</Badge>
          </div>
          <p className="mt-2 text-sm text-slate-500">{formatDateTime(meeting.time)} · {meeting.participants.join('、')}</p>
        </div>
        <Button onClick={generateBrief} disabled={loadingBrief} icon={<Bot className="h-4 w-4" />}>
          {meeting.preBrief ? '重新生成会前准备' : '生成会前准备'}
        </Button>
      </div>

      <div className="rounded-xl border border-slate-100 bg-white p-2 shadow-soft">
        <div className="grid gap-2 md:grid-cols-4">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center justify-center gap-2 rounded-lg px-4 py-3 text-sm font-medium transition ${
                  active ? 'bg-brand-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {activeTab === 'overview' && (
        <Overview meeting={meeting} onBrief={generateBrief} onSummary={() => setActiveTab('summary')} onActions={() => setActiveTab('actions')} />
      )}
      {activeTab === 'brief' && <BriefTab brief={meeting.preBrief} loading={loadingBrief} onGenerate={generateBrief} />}
      {activeTab === 'summary' && (
        <SummaryTab
          meeting={meeting}
          summary={meeting.postSummary}
          loading={loadingSummary}
          onLoadSample={() => onUpdateNotes(meeting.id, sampleTranscript)}
          onNotesChange={(notes) => onUpdateNotes(meeting.id, notes)}
          onGenerate={generateSummary}
        />
      )}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          {meeting.actionItems.length ? (
            meeting.actionItems.map((item) => <ActionItemCard key={item.id} item={item} onUpdateStatus={onUpdateActionStatus} />)
          ) : (
            <EmptyState title="暂无待办事项" description="生成会议纪要后，AI 会自动提取待办事项并同步到这里。" />
          )}
        </div>
      )}
    </div>
  );
}

function Overview({ meeting, onBrief, onSummary, onActions }: { meeting: Meeting; onBrief: () => void; onSummary: () => void; onActions: () => void }) {
  return (
    <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">会议概览</h2>
        <div className="mt-5 grid gap-4 text-sm">
          <Info label="会议时间" value={formatDateTime(meeting.time)} />
          <Info label="参会人" value={meeting.participants.join('、')} />
          <Info label="会议目标" value={meeting.goal} />
          <Info label="会议背景" value={meeting.background} />
          <Info label="相关资料" value={meeting.relatedMaterials || '暂无'} />
          <Info label="当前状态" value={meeting.status} />
        </div>
      </section>
      <section className="rounded-xl border border-slate-100 bg-white p-6 shadow-soft">
        <h2 className="text-lg font-semibold text-slate-950">快捷操作</h2>
        <div className="mt-5 grid gap-3">
          <Button onClick={onBrief} icon={<Sparkles className="h-4 w-4" />}>生成会前准备</Button>
          <Button variant="secondary" onClick={onSummary} icon={<ClipboardCheck className="h-4 w-4" />}>生成会议纪要</Button>
          <Button variant="secondary" onClick={onActions} icon={<ListTodo className="h-4 w-4" />}>查看待办事项</Button>
        </div>
      </section>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <div className="text-xs font-medium text-slate-400">{label}</div>
      <div className="mt-1 leading-6 text-slate-700">{value}</div>
    </div>
  );
}

function BriefTab({ brief, loading, onGenerate }: { brief?: PreMeetingBrief; loading: boolean; onGenerate: () => void }) {
  if (loading) return <LoadingState text="AI 正在生成会前准备..." />;
  if (!brief) {
    return <EmptyState title="尚未生成会前准备" description="点击按钮后，AI 会根据会议目标和背景生成议程、问题、清单和风险提醒。" action={<Button onClick={onGenerate}>生成 AI 会前准备</Button>} />;
  }
  return (
    <div className="space-y-4">
      <Button onClick={onGenerate} icon={<Sparkles className="h-4 w-4" />}>重新生成 AI 会前准备</Button>
      <div className="grid gap-4 lg:grid-cols-2">
        <ContentCard title="会议目标总结" text={brief.objective} />
        <ContentCard title="推荐会议议程" items={brief.agenda} ordered />
        <ContentCard title="关键讨论问题" items={brief.keyQuestions} />
        <ContentCard title="会前准备清单" items={brief.preparationChecklist} />
        <ContentCard title="风险提醒" items={brief.risks} />
        <ContentCard title="参会人关注点" items={brief.participantFocus} />
      </div>
    </div>
  );
}

function SummaryTab({
  meeting,
  summary,
  loading,
  onLoadSample,
  onNotesChange,
  onGenerate,
}: {
  meeting: Meeting;
  summary?: PostMeetingSummary;
  loading: boolean;
  onLoadSample: () => void;
  onNotesChange: (notes: string) => void;
  onGenerate: () => void;
}) {
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-950">会议记录 / 转写文本</h2>
          <Button variant="secondary" onClick={onLoadSample}>载入示例会议文本</Button>
        </div>
        <textarea
          value={meeting.notes || ''}
          onChange={(event) => onNotesChange(event.target.value)}
          placeholder="在这里粘贴会议记录、聊天纪要或转写文本..."
          rows={9}
          className="mt-4 w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 outline-none transition focus:border-brand-500 focus:bg-white"
        />
        <Button className="mt-4" onClick={onGenerate} disabled={loading || !meeting.notes?.trim()} icon={<Bot className="h-4 w-4" />}>
          生成 AI 会议纪要
        </Button>
      </section>
      {loading ? <LoadingState text="AI 正在整理会议纪要并提取待办..." /> : null}
      {summary ? (
        <div className="grid gap-4 lg:grid-cols-2">
          <ContentCard title="会议摘要" text={summary.summary} />
          <ContentCard title="关键结论" items={summary.conclusions} ordered />
          <ContentCard title="决策事项" items={summary.decisions} />
          <ContentCard title="未解决问题" items={summary.openIssues} />
          <ContentCard title="待办事项" items={summary.actionItems.map((item) => `${item.title}｜${item.owner}｜${item.dueDate}`)} />
          <ContentCard title="跟进消息草稿" text={summary.followUpDraft} />
        </div>
      ) : null}
    </div>
  );
}

function ContentCard({ title, text, items, ordered = false }: { title: string; text?: string; items?: string[]; ordered?: boolean }) {
  const List = ordered ? 'ol' : 'ul';
  return (
    <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <h3 className="text-base font-semibold text-slate-950">{title}</h3>
      {text ? <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p> : null}
      {items ? (
        <List className={`mt-3 space-y-2 text-sm leading-6 text-slate-600 ${ordered ? 'list-decimal pl-5' : ''}`}>
          {items.map((item) => <li key={item}>{ordered ? item : `• ${item}`}</li>)}
        </List>
      ) : null}
    </section>
  );
}

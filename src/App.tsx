import { useEffect, useMemo, useState } from 'react';
import { CalendarCheck, ClipboardList, FileClock, Plus, Sparkles } from 'lucide-react';
import { AppLayout } from './components/Layout/AppLayout';
import { StatCard } from './components/Dashboard/StatCard';
import { RecentMeetings } from './components/Dashboard/RecentMeetings';
import { MeetingCard } from './components/Meetings/MeetingCard';
import { CreateMeetingModal } from './components/Meetings/CreateMeetingModal';
import { MeetingWorkspace } from './components/Meetings/MeetingWorkspace';
import { ActionFilters } from './components/Actions/ActionFilters';
import { ActionItemCard } from './components/Actions/ActionItemCard';
import { TemplateCard } from './components/Templates/TemplateCard';
import { Button } from './components/common/Button';
import { EmptyState } from './components/common/EmptyState';
import { meetingTemplates } from './data/meetingTemplates';
import { generatePostMeetingSummary, generatePreMeetingBrief } from './lib/mockAi';
import { loadMeetings, resetMeetings, saveMeetings } from './lib/storage';
import { actionDisplayStatus, countByStatus, getAllActionItems } from './lib/utils';
import type { ActionFilter, ActionStatus, Meeting, PageKey } from './types';

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms));

export default function App() {
  const [meetings, setMeetings] = useState<Meeting[]>(() => loadMeetings());
  const [activePage, setActivePage] = useState<PageKey>('dashboard');
  const [selectedMeetingId, setSelectedMeetingId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [actionFilter, setActionFilter] = useState<ActionFilter>('全部');

  useEffect(() => {
    saveMeetings(meetings);
  }, [meetings]);

  const selectedMeeting = meetings.find((meeting) => meeting.id === selectedMeetingId);
  const allActions = useMemo(() => getAllActionItems(meetings), [meetings]);
  const filteredActions = allActions.filter((item) => actionFilter === '全部' || actionDisplayStatus(item) === actionFilter);

  const openMeeting = (meeting: Meeting) => {
    setSelectedMeetingId(meeting.id);
    setActivePage('meetings');
  };

  const createMeeting = (meeting: Meeting) => {
    setMeetings((current) => [meeting, ...current]);
    setShowCreate(false);
    setSelectedMeetingId(meeting.id);
    setActivePage('meetings');
  };

  const resetDemo = () => {
    const next = resetMeetings();
    setMeetings(next);
    setSelectedMeetingId(null);
    setActivePage('dashboard');
    setActionFilter('全部');
  };

  const updateMeeting = (meetingId: string, updater: (meeting: Meeting) => Meeting) => {
    setMeetings((current) => current.map((meeting) => (meeting.id === meetingId ? updater(meeting) : meeting)));
  };

  const handleGenerateBrief = async (meetingId: string) => {
    await wait(1000);
    updateMeeting(meetingId, (meeting) => ({ ...meeting, preBrief: generatePreMeetingBrief(meeting), status: meeting.status === '待准备' ? '已准备' : meeting.status }));
  };

  const handleGenerateSummary = async (meetingId: string) => {
    await wait(1000);
    updateMeeting(meetingId, (meeting) => {
      const postSummary = generatePostMeetingSummary(meeting.notes || '', meeting);
      return { ...meeting, postSummary, actionItems: postSummary.actionItems, status: '待跟进' };
    });
  };

  const handleUpdateNotes = (meetingId: string, notes: string) => {
    updateMeeting(meetingId, (meeting) => ({ ...meeting, notes }));
  };

  const handleUpdateActionStatus = (itemId: string, status: ActionStatus) => {
    setMeetings((current) =>
      current.map((meeting) => ({
        ...meeting,
        actionItems: meeting.actionItems.map((item) => (item.id === itemId ? { ...item, status } : item)),
        status:
          meeting.actionItems.some((item) => item.id === itemId) && status === '已完成' && meeting.actionItems.every((item) => item.id === itemId || item.status === '已完成')
            ? '已完成'
            : meeting.status,
      })),
    );
  };

  return (
    <AppLayout activePage={activePage} onNavigate={(page) => { setActivePage(page); setSelectedMeetingId(null); }} onReset={resetDemo}>
      {activePage === 'meetings' && selectedMeeting ? (
        <MeetingWorkspace
          meeting={selectedMeeting}
          onBack={() => setSelectedMeetingId(null)}
          onGenerateBrief={handleGenerateBrief}
          onUpdateNotes={handleUpdateNotes}
          onGenerateSummary={handleGenerateSummary}
          onUpdateActionStatus={handleUpdateActionStatus}
        />
      ) : (
        <>
          {activePage === 'dashboard' && <Dashboard meetings={meetings} allActionsCount={allActions.length} onOpen={openMeeting} onCreate={() => setShowCreate(true)} />}
          {activePage === 'meetings' && <MeetingsPage meetings={meetings} onOpen={openMeeting} onCreate={() => setShowCreate(true)} />}
          {activePage === 'actions' && <ActionsPage actions={filteredActions} activeFilter={actionFilter} onFilter={setActionFilter} onUpdateStatus={handleUpdateActionStatus} />}
          {activePage === 'templates' && <TemplatesPage />}
        </>
      )}
      {showCreate ? <CreateMeetingModal onClose={() => setShowCreate(false)} onCreate={createMeeting} /> : null}
    </AppLayout>
  );
}

function PageHeader({ title, description, action }: { title: string; description: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
      </div>
      {action}
    </div>
  );
}

function Dashboard({ meetings, allActionsCount, onOpen, onCreate }: { meetings: Meeting[]; allActionsCount: number; onOpen: (meeting: Meeting) => void; onCreate: () => void }) {
  const todayMeetings = meetings.filter((meeting) => meeting.time.startsWith('2026-05-20')).length;
  const pendingActions = getAllActionItems(meetings).filter((item) => item.status !== '已完成').length;
  const importantActions = getAllActionItems(meetings).filter((item) => item.priority === '高').slice(0, 3);

  return (
    <div>
      <section className="mb-6 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 p-6 text-white shadow-soft">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">欢迎使用 MeetPilot AI</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-50">
              今天有 {todayMeetings || 3} 场会议需要处理，其中 {countByStatus(meetings, '待准备')} 场尚未生成会前准备，{pendingActions} 个待办事项等待跟进。
            </p>
          </div>
          <Button variant="secondary" onClick={onCreate} icon={<Plus className="h-4 w-4" />}>新建会议</Button>
        </div>
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard label="今日会议" value={todayMeetings || 3} hint="需要关注的会议安排" icon={<CalendarCheck className="h-5 w-5" />} />
        <StatCard label="待准备会议" value={countByStatus(meetings, '待准备')} hint="建议提前生成会前准备" icon={<Sparkles className="h-5 w-5" />} />
        <StatCard label="待整理纪要" value={countByStatus(meetings, '待整理')} hint="会后可粘贴记录生成纪要" icon={<FileClock className="h-5 w-5" />} />
        <StatCard label="待跟进事项" value={allActionsCount} hint="来自所有会议的任务" icon={<ClipboardList className="h-5 w-5" />} />
      </div>
      <div className="mt-5 grid gap-5 xl:grid-cols-[1.4fr_0.9fr]">
        <RecentMeetings meetings={meetings} onOpen={onOpen} />
        <section className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
          <h2 className="text-base font-semibold text-slate-950">重要待办提醒</h2>
          <div className="mt-4 space-y-3">
            {importantActions.map((item) => (
              <div key={item.id} className="rounded-lg bg-red-50 p-4 text-sm">
                <div className="font-medium text-red-800">{item.title}</div>
                <div className="mt-1 text-red-600">{item.owner} · 截止 {item.dueDate}</div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MeetingsPage({ meetings, onOpen, onCreate }: { meetings: Meeting[]; onOpen: (meeting: Meeting) => void; onCreate: () => void }) {
  return (
    <div>
      <PageHeader title="我的会议" description="管理会议准备、纪要整理和后续待办。" action={<Button onClick={onCreate} icon={<Plus className="h-4 w-4" />}>新建会议</Button>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {meetings.map((meeting) => <MeetingCard key={meeting.id} meeting={meeting} onOpen={onOpen} />)}
      </div>
    </div>
  );
}

function ActionsPage({ actions, activeFilter, onFilter, onUpdateStatus }: { actions: ReturnType<typeof getAllActionItems>; activeFilter: ActionFilter; onFilter: (filter: ActionFilter) => void; onUpdateStatus: (itemId: string, status: ActionStatus) => void }) {
  return (
    <div>
      <PageHeader title="待办事项" description="聚合所有会议中提取的行动项，帮助你持续跟进。" />
      <ActionFilters active={activeFilter} onChange={onFilter} />
      <div className="mt-5 grid gap-4 xl:grid-cols-2">
        {actions.length ? actions.map((item) => <ActionItemCard key={item.id} item={item} onUpdateStatus={onUpdateStatus} />) : <div className="xl:col-span-2"><EmptyState title="暂无匹配待办" description="可以切换筛选条件，或在会议工作区生成会议纪要后自动提取待办。" /></div>}
      </div>
    </div>
  );
}

function TemplatesPage() {
  return (
    <div>
      <PageHeader title="会议模板" description="常用办公会议模板，帮助快速组织会前准备和议程。" />
      <div className="space-y-5">
        {meetingTemplates.map((template) => <TemplateCard key={template.id} template={template} />)}
      </div>
    </div>
  );
}

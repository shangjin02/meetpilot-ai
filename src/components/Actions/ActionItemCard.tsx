import { CalendarClock, UserRound } from 'lucide-react';
import type { ActionItem, ActionStatus } from '../../types';
import { actionDisplayStatus, formatDate, priorityTone, statusTone } from '../../lib/utils';
import { Badge } from '../common/Badge';

interface ActionItemCardProps {
  item: ActionItem;
  onUpdateStatus: (itemId: string, status: ActionStatus) => void;
}

export function ActionItemCard({ item, onUpdateStatus }: ActionItemCardProps) {
  const displayStatus = actionDisplayStatus(item);
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-slate-950">{item.title}</h3>
          <p className="mt-2 text-sm text-slate-500">来源会议：{item.meetingTitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge className={priorityTone[item.priority]}>{item.priority}优先级</Badge>
          <Badge className={statusTone[displayStatus]}>{displayStatus}</Badge>
        </div>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 sm:grid-cols-2">
        <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-brand-500" />{item.owner}</span>
        <span className="flex items-center gap-2"><CalendarClock className="h-4 w-4 text-brand-500" />截止 {formatDate(item.dueDate)}</span>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(['待开始', '进行中', '已完成'] as ActionStatus[]).map((status) => (
          <button
            key={status}
            onClick={() => onUpdateStatus(item.id, status)}
            className={`rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              item.status === status ? 'bg-brand-600 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {status}
          </button>
        ))}
      </div>
    </article>
  );
}

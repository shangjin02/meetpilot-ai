import { ArrowRight } from 'lucide-react';
import type { Meeting } from '../../types';
import { formatDateTime, statusTone } from '../../lib/utils';
import { Badge } from '../common/Badge';

export function RecentMeetings({ meetings, onOpen }: { meetings: Meeting[]; onOpen: (meeting: Meeting) => void }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-base font-semibold text-slate-950">最近会议</h2>
        <span className="text-xs text-slate-400">按时间排序</span>
      </div>
      <div className="space-y-3">
        {meetings.slice(0, 4).map((meeting) => (
          <button
            key={meeting.id}
            onClick={() => onOpen(meeting)}
            className="flex w-full items-center justify-between gap-4 rounded-lg border border-slate-100 p-4 text-left transition hover:border-brand-100 hover:bg-brand-50/50"
          >
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-medium text-slate-950">{meeting.title}</h3>
                <Badge className={statusTone[meeting.status]}>{meeting.status}</Badge>
              </div>
              <p className="mt-1 text-sm text-slate-500">{formatDateTime(meeting.time)} · {meeting.participants.join('、')}</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-slate-400" />
          </button>
        ))}
      </div>
    </div>
  );
}

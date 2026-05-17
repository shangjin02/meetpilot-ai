import { ArrowRight, Clock, Users } from 'lucide-react';
import type { Meeting } from '../../types';
import { formatDateTime, statusTone } from '../../lib/utils';
import { Badge } from '../common/Badge';
import { Button } from '../common/Button';

export function MeetingCard({ meeting, onOpen }: { meeting: Meeting; onOpen: (meeting: Meeting) => void }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft transition hover:-translate-y-0.5 hover:border-brand-100">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{meeting.title}</h3>
          <div className="mt-2 flex flex-wrap gap-2">
            <Badge className={statusTone[meeting.status]}>{meeting.status}</Badge>
            <Badge className="bg-slate-50 text-slate-600 ring-slate-200">{meeting.actionItems.length} 个待办</Badge>
          </div>
        </div>
      </div>
      <div className="mt-4 space-y-2 text-sm text-slate-600">
        <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-brand-500" />{formatDateTime(meeting.time)}</p>
        <p className="flex items-center gap-2"><Users className="h-4 w-4 text-brand-500" />{meeting.participants.join('、')}</p>
      </div>
      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-600">{meeting.goal}</p>
      <Button className="mt-5 w-full" icon={<ArrowRight className="h-4 w-4" />} onClick={() => onOpen(meeting)}>
        进入会议工作区
      </Button>
    </article>
  );
}

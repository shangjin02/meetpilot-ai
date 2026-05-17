import { FormEvent, useState } from 'react';
import { X } from 'lucide-react';
import type { Meeting } from '../../types';
import { uid } from '../../lib/utils';
import { Button } from '../common/Button';

interface CreateMeetingModalProps {
  onClose: () => void;
  onCreate: (meeting: Meeting) => void;
}

export function CreateMeetingModal({ onClose, onCreate }: CreateMeetingModalProps) {
  const [form, setForm] = useState({
    title: '',
    time: '',
    participants: '',
    goal: '',
    background: '',
    relatedMaterials: '',
    extraNotes: '',
  });

  const update = (key: keyof typeof form, value: string) => setForm((current) => ({ ...current, [key]: value }));

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const meeting: Meeting = {
      id: uid('meeting'),
      title: form.title || '未命名会议',
      time: form.time,
      participants: form.participants.split(/[、,，\n]/).map((item) => item.trim()).filter(Boolean),
      goal: form.goal,
      background: form.background,
      relatedMaterials: form.relatedMaterials,
      extraNotes: form.extraNotes,
      status: '待准备',
      actionItems: [],
    };
    onCreate(meeting);
  };

  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-slate-950/40 p-4">
      <form onSubmit={submit} className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-950">新建会议</h2>
            <p className="mt-1 text-sm text-slate-500">补充会议信息后即可进入工作区生成准备内容。</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <label className="text-sm font-medium text-slate-700">
            会议标题
            <input required className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.title} onChange={(e) => update('title', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            会议时间
            <input required type="datetime-local" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.time} onChange={(e) => update('time', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            参会人
            <input required placeholder="用顿号或逗号分隔，例如：产品经理、前端工程师、设计师" className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.participants} onChange={(e) => update('participants', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            会议目标
            <textarea required rows={3} className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.goal} onChange={(e) => update('goal', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700 md:col-span-2">
            会议背景
            <textarea required rows={3} className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.background} onChange={(e) => update('background', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            相关资料
            <textarea rows={3} className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.relatedMaterials} onChange={(e) => update('relatedMaterials', e.target.value)} />
          </label>
          <label className="text-sm font-medium text-slate-700">
            补充说明
            <textarea rows={3} className="mt-2 w-full resize-none rounded-lg border border-slate-200 px-3 py-2 outline-none focus:border-brand-500" value={form.extraNotes} onChange={(e) => update('extraNotes', e.target.value)} />
          </label>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>取消</Button>
          <Button type="submit">创建并打开</Button>
        </div>
      </form>
    </div>
  );
}

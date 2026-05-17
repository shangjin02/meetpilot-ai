import type { ReactNode } from 'react';

export function StatCard({ label, value, hint, icon }: { label: string; value: number; hint: string; icon: ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <div className="mt-2 text-3xl font-bold text-slate-950">{value}</div>
        </div>
        <div className="rounded-lg bg-brand-50 p-2 text-brand-600">{icon}</div>
      </div>
      <p className="mt-3 text-xs text-slate-500">{hint}</p>
    </div>
  );
}

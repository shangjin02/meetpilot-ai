import type { ActionFilter } from '../../types';

const filters: ActionFilter[] = ['全部', '待开始', '进行中', '已完成', '已逾期'];

export function ActionFilters({ active, onChange }: { active: ActionFilter; onChange: (filter: ActionFilter) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => onChange(filter)}
          className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
            active === filter ? 'bg-brand-600 text-white' : 'bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50'
          }`}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}

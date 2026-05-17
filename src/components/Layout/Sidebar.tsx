import { BarChart3, CalendarDays, ClipboardList, LayoutTemplate, RotateCcw } from 'lucide-react';
import type { PageKey } from '../../types';
import { Button } from '../common/Button';

const navItems = [
  { key: 'dashboard' as PageKey, label: '工作台', icon: BarChart3 },
  { key: 'meetings' as PageKey, label: '我的会议', icon: CalendarDays },
  { key: 'actions' as PageKey, label: '待办事项', icon: ClipboardList },
  { key: 'templates' as PageKey, label: '会议模板', icon: LayoutTemplate },
];

interface SidebarProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onReset: () => void;
}

export function Sidebar({ activePage, onNavigate, onReset }: SidebarProps) {
  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white px-4 py-4 lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:px-5">
      <div className="rounded-xl bg-brand-50 p-4">
        <div className="text-lg font-bold text-slate-950">MeetPilot AI</div>
        <div className="mt-1 text-sm font-medium text-brand-700">智能会议助手</div>
        <p className="mt-3 text-xs leading-5 text-slate-600">让每一次会议都有准备、有结论、有跟进</p>
      </div>

      <nav className="mt-4 grid gap-2 sm:grid-cols-4 lg:grid-cols-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = activePage === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition ${
                active ? 'bg-brand-600 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-950'
              }`}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="mt-4 lg:mt-auto">
        <Button variant="secondary" icon={<RotateCcw className="h-4 w-4" />} onClick={onReset} className="w-full">
          重置演示数据
        </Button>
      </div>
    </aside>
  );
}

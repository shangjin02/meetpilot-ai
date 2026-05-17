import { Loader2 } from 'lucide-react';

export function LoadingState({ text = 'AI 正在生成内容...' }: { text?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700">
      <Loader2 className="h-5 w-5 animate-spin" />
      <span>{text}</span>
    </div>
  );
}

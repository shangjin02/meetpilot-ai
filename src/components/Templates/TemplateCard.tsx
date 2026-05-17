import type { MeetingTemplate } from '../../types';

export function TemplateCard({ template }: { template: MeetingTemplate }) {
  return (
    <article className="rounded-xl border border-slate-100 bg-white p-5 shadow-soft">
      <h3 className="text-lg font-semibold text-slate-950">{template.name}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{template.scenario}</p>
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <Section title="推荐议程" items={template.agenda} />
        <Section title="会前准备清单" items={template.checklist} />
        <Section title="常见待办事项" items={template.commonActions} />
      </div>
    </article>
  );
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg bg-slate-50 p-4">
      <h4 className="text-sm font-semibold text-slate-800">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-600">
        {items.map((item) => <li key={item}>• {item}</li>)}
      </ul>
    </div>
  );
}

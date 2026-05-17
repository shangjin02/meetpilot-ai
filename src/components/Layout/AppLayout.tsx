import type { ReactNode } from 'react';
import type { PageKey } from '../../types';
import { Sidebar } from './Sidebar';

interface AppLayoutProps {
  activePage: PageKey;
  onNavigate: (page: PageKey) => void;
  onReset: () => void;
  children: ReactNode;
}

export function AppLayout({ activePage, onNavigate, onReset, children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-[#f4f8fc] lg:flex">
      <Sidebar activePage={activePage} onNavigate={onNavigate} onReset={onReset} />
      <main className="min-w-0 flex-1 px-4 py-5 sm:px-6 lg:h-screen lg:overflow-y-auto lg:px-8 lg:py-7">
        {children}
      </main>
    </div>
  );
}

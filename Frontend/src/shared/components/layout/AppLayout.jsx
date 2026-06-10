import { useState } from 'react';
import { Topbar } from './Topbar';
import { Sidebar } from './Sidebar';

export function AppLayout({ children }) {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    /* Outer shell: full viewport height, column flex */
    <div className="flex flex-col h-screen bg-void overflow-hidden">

      {/* Topbar — fixed height, never shrinks */}
      <Topbar onMenuClick={() => setMobileSidebarOpen(true)} />

      {/* Below topbar: sidebar + content side by side */}
      <div className="flex flex-1 overflow-hidden">

        {/* Desktop sidebar — always visible, never shrinks */}
        <aside className="hidden lg:flex flex-col shrink-0 w-65
          bg-obsidian border-r border-divide overflow-y-auto">
          <Sidebar isOpen={false} onClose={() => {}} desktopMode />
        </aside>

        {/* Mobile sidebar overlay — rendered via Sidebar's overlay logic */}
        <Sidebar isOpen={mobileSidebarOpen} onClose={() => setMobileSidebarOpen(false)} />

        {/* Main content — takes remaining space, scrolls independently */}
        <main className="flex-1 overflow-y-auto bg-obsidian">
          {children}
        </main>

      </div>
    </div>
  );
}

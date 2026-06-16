'use client';

import { LayoutDashboard, BarChart, Settings, FileText } from 'lucide-react';
import Image from 'next/image';
import { Dispatch, SetStateAction } from 'react';

type Section = 'projection' | 'donnees' | 'scenarios' | 'parametres';

interface SidebarProps {
  activeSection: Section;
  onSectionChange: Dispatch<SetStateAction<Section>>;
}

const navItems = [
  { name: 'Projection', id: 'projection' as const, icon: LayoutDashboard },
  { name: 'Données', id: 'donnees' as const, icon: BarChart },
  { name: 'Scénarios', id: 'scenarios' as const, icon: FileText },
  { name: 'Paramètres', id: 'parametres' as const, icon: Settings },
];

export function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  return (
    <aside className="w-20 min-h-screen border-r border-sidebar-border bg-sidebar p-4 flex flex-col items-center gap-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-sidebar-border bg-card overflow-hidden">
        <Image src="/noctua-logo.png" alt="Noctua Logo" width={40} height={40} className="object-cover" />
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.name}
              onClick={() => onSectionChange(item.id)}
              className={`group flex h-12 w-12 items-center justify-center rounded-2xl border transition ${
                isActive
                  ? 'border-sidebar-primary bg-sidebar-primary/10 text-sidebar-primary'
                  : 'border-transparent bg-card text-sidebar-foreground hover:border-sidebar-border hover:bg-muted'
              }`}
              title={item.name}
            >
              <Icon className="h-5 w-5 transition group-hover:text-sidebar-primary" />
              <span className="sr-only">{item.name}</span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto w-full rounded-3xl border border-sidebar-border bg-card p-3 text-center text-xs text-sidebar-foreground/80">
        <p className="font-semibold text-sidebar-primary">Noctua</p>
        <p>Dashboard</p>
      </div>
    </aside>
  );
}
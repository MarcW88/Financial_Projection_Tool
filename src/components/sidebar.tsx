'use client';

import Link from 'next/link';
import { LayoutDashboard, BarChart, Settings, FileText, Wallet } from 'lucide-react';
import Image from 'next/image';

const navItems = [
  { name: 'Projection', href: '/#projection', icon: LayoutDashboard },
  { name: 'Données', href: '/#donnees', icon: BarChart },
  { name: 'Scénarios', href: '/#scenarios', icon: FileText },
  { name: 'Paramètres', href: '/#parametres', icon: Settings },
];

export function Sidebar() {
  return (
    <aside className="w-20 min-h-screen border-r border-sidebar-border bg-sidebar p-4 flex flex-col items-center gap-6">
      <div className="flex items-center justify-center w-12 h-12 rounded-full border border-sidebar-border bg-card overflow-hidden">
        <Image src="/noctua-logo.png" alt="Noctua Logo" width={40} height={40} className="object-cover" />
      </div>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.name} href={item.href} className="group flex h-12 w-12 items-center justify-center rounded-2xl border border-transparent bg-card text-sidebar-foreground transition hover:border-sidebar-border hover:bg-muted">
              <Icon className="h-5 w-5 transition group-hover:text-sidebar-primary" />
              <span className="sr-only">{item.name}</span>
            </Link>
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
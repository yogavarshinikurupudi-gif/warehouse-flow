import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, PackageSearch, Workflow, AlertOctagon, BarChart3, Zap } from 'lucide-react';

const NAV = [
  { id: 'overview', label: 'Overview', icon: LayoutGrid },
  { id: 'orders', label: 'Order Pipeline', icon: Workflow },
  { id: 'inventory', label: 'Inventory', icon: PackageSearch },
  { id: 'exceptions', label: 'Exceptions', icon: AlertOctagon },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
];

export default function Sidebar({ active, onChange, exceptionCount }) {
  return (
    <aside className="w-16 md:w-56 shrink-0 glass border-r border-white/5 flex flex-col py-5 px-2 md:px-3 gap-1">
      <div className="flex items-center gap-2 px-2 mb-6">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-400 to-brand-500 flex items-center justify-center glow-brand">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="hidden md:block font-display font-bold text-white tracking-tight">FlowDock</span>
      </div>

      {NAV.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onChange(item.id)}
            className={`relative flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm transition-colors ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="nav-active"
                className="absolute inset-0 rounded-xl bg-brand-500/20 border border-brand-400/30"
                transition={{ type: 'spring', stiffness: 350, damping: 30 }}
              />
            )}
            <Icon className="w-4 h-4 relative z-10 shrink-0" />
            <span className="hidden md:block relative z-10">{item.label}</span>
            {item.id === 'exceptions' && exceptionCount > 0 && (
              <span className="relative z-10 ml-auto hidden md:flex items-center justify-center text-[10px] font-bold w-5 h-5 rounded-full bg-crit-500 text-white">
                {exceptionCount}
              </span>
            )}
          </button>
        );
      })}
    </aside>
  );
}

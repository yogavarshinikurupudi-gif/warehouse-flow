import React from 'react';
import { motion } from 'framer-motion';

export default function TopBar({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {kpis.map((kpi, i) => (
        <motion.div
          key={kpi.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.06 }}
          whileHover={{ y: -3 }}
          className={`glass rounded-2xl p-4 relative overflow-hidden ${kpi.alert ? 'ring-1 ring-crit-500/40' : ''}`}
        >
          <div
            className="absolute -right-6 -top-6 w-20 h-20 rounded-full opacity-20 blur-xl"
            style={{ background: kpi.color }}
          />
          <div className="text-[11px] uppercase tracking-wider text-slate-400 mb-1.5 relative z-10">{kpi.label}</div>
          <div className="text-2xl md:text-3xl font-display font-bold text-white relative z-10">{kpi.value}</div>
          {kpi.sub && <div className="text-xs text-slate-500 mt-1 relative z-10">{kpi.sub}</div>}
        </motion.div>
      ))}
    </div>
  );
}

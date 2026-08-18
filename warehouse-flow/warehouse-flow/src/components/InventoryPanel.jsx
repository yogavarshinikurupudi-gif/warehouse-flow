import React from 'react';
import { motion } from 'framer-motion';
import { PackageX, PackageMinus, PackageCheck, TriangleAlert } from 'lucide-react';
import { availableQty, reorderRecommendation } from '../engine/decisionEngine';

const STATUS_META = {
  stockout: { label: 'Stockout', icon: PackageX, cls: 'text-crit-400 bg-crit-500/10 border-crit-500/30' },
  reorder_now: { label: 'Reorder now', icon: TriangleAlert, cls: 'text-urgent-400 bg-urgent-500/10 border-urgent-500/30' },
  reorder_soon: { label: 'Reorder soon', icon: PackageMinus, cls: 'text-urgent-300 bg-urgent-500/5 border-urgent-500/20' },
  healthy: { label: 'Healthy', icon: PackageCheck, cls: 'text-ok-400 bg-ok-500/10 border-ok-500/30' },
};

export default function InventoryPanel({ inventory }) {
  return (
    <div className="glass rounded-2xl overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-slate-500 border-b border-white/5">
            <th className="px-4 py-3 font-medium">SKU / Item</th>
            <th className="px-4 py-3 font-medium">Zone</th>
            <th className="px-4 py-3 font-medium">Available</th>
            <th className="px-4 py-3 font-medium">Days of cover</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Suggested reorder</th>
          </tr>
        </thead>
        <tbody>
          {inventory.map((item, i) => {
            const rec = reorderRecommendation(item);
            const meta = STATUS_META[rec.status];
            const Icon = meta.icon;
            return (
              <motion.tr
                key={item.sku}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: i * 0.03 }}
                className="border-b border-white/5 last:border-0 hover:bg-white/[0.03] transition"
              >
                <td className="px-4 py-3">
                  <div className="text-white font-medium">{item.name}</div>
                  <div className="text-[11px] text-slate-500">{item.sku}</div>
                </td>
                <td className="px-4 py-3 text-slate-400">{item.zone}</td>
                <td className="px-4 py-3 text-slate-300">{availableQty(item)}</td>
                <td className="px-4 py-3 text-slate-400">
                  {rec.daysOfCover === Infinity ? '—' : `${rec.daysOfCover}d`}
                </td>
                <td className="px-4 py-3">
                  <span className={`inline-flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-full border ${meta.cls}`}>
                    <Icon className="w-3 h-3" /> {meta.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-400">
                  {rec.suggestedQty > 0 ? `+${rec.suggestedQty} units` : '—'}
                </td>
              </motion.tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

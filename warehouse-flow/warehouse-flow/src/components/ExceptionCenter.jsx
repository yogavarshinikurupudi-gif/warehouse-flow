import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertOctagon, CheckCircle2, ChevronDown, Scale } from 'lucide-react';
import { allocateFairly } from '../engine/decisionEngine';

export default function ExceptionCenter({ conflicts, onApply }) {
  const [openSku, setOpenSku] = useState(conflicts[0]?.sku ?? null);
  const [applied, setApplied] = useState({});

  if (conflicts.length === 0) {
    return (
      <div className="glass rounded-2xl p-10 text-center">
        <CheckCircle2 className="w-8 h-8 text-ok-400 mx-auto mb-3" />
        <div className="text-white font-medium">No allocation conflicts right now</div>
        <div className="text-sm text-slate-500 mt-1">
          Every order's stock demand is currently covered by available inventory.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conflicts.map((conflict) => {
        const result = allocateFairly(conflict);
        const isOpen = openSku === conflict.sku;
        const isApplied = applied[conflict.sku];

        return (
          <motion.div layout key={conflict.sku} className="glass rounded-2xl overflow-hidden border border-urgent-500/20">
            <button
              onClick={() => setOpenSku(isOpen ? null : conflict.sku)}
              className="w-full flex items-center justify-between px-4 py-3.5 text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-urgent-500/15 border border-urgent-500/30 flex items-center justify-center">
                  <AlertOctagon className="w-4 h-4 text-urgent-400" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">
                    {conflict.item?.name ?? conflict.sku}
                    <span className="text-slate-500 font-normal"> · {conflict.sku}</span>
                  </div>
                  <div className="text-xs text-slate-400">
                    {conflict.totalDemand} units requested across {conflict.claims.length} orders — only {conflict.available} available
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {isApplied && (
                  <span className="text-[10px] px-2 py-1 rounded-full bg-ok-500/15 text-ok-400 border border-ok-500/30">
                    Applied
                  </span>
                )}
                <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-4 pb-4 pt-1 border-t border-white/5">
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-3 mt-2">
                      <Scale className="w-3.5 h-3.5 text-brand-300" />
                      Priority-weighted allocation with a fairness floor — urgent/high-value orders are served first,
                      but every claimant keeps a minimum guaranteed share.
                    </div>

                    <div className="space-y-2">
                      {result.explanation.map((row) => (
                        <div
                          key={row.orderId}
                          className="flex items-center justify-between bg-black/20 rounded-lg px-3 py-2"
                        >
                          <div>
                            <div className="text-sm text-white">{row.orderId} <span className="text-slate-500 font-normal">· {row.customer}</span></div>
                            <div className="text-[11px] text-slate-500">priority score {row.priorityScore}</div>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="text-right">
                              <div className="text-sm font-semibold text-white">{row.granted} / {row.requested}</div>
                              <div className={`text-[10px] ${row.fulfilled ? 'text-ok-400' : 'text-urgent-400'}`}>
                                {row.fulfilled ? 'fully fulfilled' : 'partial — backorder remainder'}
                              </div>
                            </div>
                            <div className="w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${row.fulfilled ? 'bg-ok-500' : 'bg-urgent-500'}`}
                                style={{ width: `${Math.min((row.granted / row.requested) * 100, 100)}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={() => {
                        setApplied((a) => ({ ...a, [conflict.sku]: true }));
                        onApply(result);
                      }}
                      disabled={isApplied}
                      className="mt-3 w-full py-2 rounded-lg bg-brand-500 hover:bg-brand-400 disabled:bg-white/5 disabled:text-slate-500 text-white text-sm font-medium transition"
                    >
                      {isApplied ? 'Allocation applied' : 'Apply recommended allocation'}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}

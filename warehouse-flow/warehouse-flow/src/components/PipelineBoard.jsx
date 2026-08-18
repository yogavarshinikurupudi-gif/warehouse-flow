import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, ChevronRight } from 'lucide-react';
import { pipelineStages } from '../data/mockData';

const TIER_COLOR = {
  enterprise: 'text-brand-300 bg-brand-500/15 border-brand-400/30',
  growth: 'text-urgent-400 bg-urgent-500/15 border-urgent-400/30',
  standard: 'text-slate-300 bg-slate-500/15 border-slate-400/20',
};

export default function PipelineBoard({ orders, onAdvance }) {
  return (
    <div className="overflow-x-auto pb-2">
      <div className="flex gap-3 min-w-max">
        {pipelineStages.map((stage) => {
          const stageOrders = orders.filter((o) => o.stage === stage);
          return (
            <div key={stage} className="w-64 shrink-0">
              <div className="flex items-center justify-between mb-2 px-1">
                <span className="text-xs font-semibold text-slate-300">{stage}</span>
                <span className="text-[10px] text-slate-500 bg-white/5 rounded-full px-2 py-0.5">
                  {stageOrders.length}
                </span>
              </div>
              <div className="space-y-2 min-h-[80px]">
                <AnimatePresence>
                  {stageOrders.map((order) => (
                    <motion.div
                      layout
                      key={order.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass rounded-xl p-3 cursor-pointer group"
                      onClick={() => onAdvance(order.id)}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-white">{order.id}</span>
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full border ${TIER_COLOR[order.tier]}`}>
                          {order.tier}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 truncate mb-2">{order.customer}</div>
                      <div className="flex items-center justify-between text-[10px]">
                        <span className={`flex items-center gap-1 ${order.breachRisk ? 'text-crit-400' : 'text-slate-500'}`}>
                          <Clock className="w-3 h-3" /> {order.hoursRemaining}h left
                        </span>
                        <span className="flex items-center gap-0.5 text-slate-600 group-hover:text-brand-300 transition">
                          advance <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

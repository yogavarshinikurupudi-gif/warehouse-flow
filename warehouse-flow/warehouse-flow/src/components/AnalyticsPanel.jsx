import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp } from 'lucide-react';
import { pipelineStages } from '../data/mockData';
import { findBottleneck } from '../engine/decisionEngine';

const TIER_COLORS = { enterprise: '#818cf8', growth: '#fbbf24', standard: '#94a3b8' };

export default function AnalyticsPanel({ orders }) {
  const stageCounts = {};
  pipelineStages.forEach((s) => { stageCounts[s] = orders.filter((o) => o.stage === s).length; });
  const bottleneck = findBottleneck(stageCounts, pipelineStages);

  const stageData = pipelineStages.map((s) => ({ stage: s, count: stageCounts[s] }));

  const tierCounts = {};
  orders.forEach((o) => { tierCounts[o.tier] = (tierCounts[o.tier] || 0) + 1; });
  const tierData = Object.entries(tierCounts).map(([tier, count]) => ({ name: tier, value: count }));

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-sm font-semibold text-white">Orders per pipeline stage</h3>
        </div>
        <p className="text-xs text-slate-500 mb-3">
          Bottleneck detected: <span className="text-urgent-400 font-medium">{bottleneck.stage}</span> has the most orders queued ({bottleneck.count}).
        </p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={stageData} margin={{ left: -20 }}>
            <XAxis dataKey="stage" tick={{ fontSize: 9, fill: '#94a3b8' }} interval={0} angle={-25} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} allowDecimals={false} />
            <Tooltip contentStyle={{ background: '#151f38', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {stageData.map((d, i) => (
                <Cell key={i} fill={d.stage === bottleneck.stage ? '#f59e0b' : '#6366f1'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-4">
        <h3 className="text-sm font-semibold text-white mb-1">Order mix by customer tier</h3>
        <p className="text-xs text-slate-500 mb-3">Enterprise and growth orders are weighted higher in the priority engine.</p>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={tierData} dataKey="value" nameKey="name" innerRadius={45} outerRadius={75} paddingAngle={4}>
              {tierData.map((d, i) => (
                <Cell key={i} fill={TIER_COLORS[d.name]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ background: '#151f38', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 12 }} />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex gap-4 justify-center mt-1">
          {tierData.map((d) => (
            <div key={d.name} className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full" style={{ background: TIER_COLORS[d.name] }} />
              {d.name} ({d.value})
            </div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="md:col-span-2 glass rounded-2xl p-4 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-xl bg-ok-500/15 border border-ok-500/30 flex items-center justify-center shrink-0">
          <TrendingUp className="w-5 h-5 text-ok-400" />
        </div>
        <div className="text-sm text-slate-300">
          <span className="text-white font-medium">Recommendation: </span>
          add a second picker to <span className="text-urgent-400">{bottleneck.stage}</span> during peak hours —
          it's currently holding {bottleneck.count} order{bottleneck.count === 1 ? '' : 's'}, more than any other stage.
        </div>
      </motion.div>
    </div>
  );
}

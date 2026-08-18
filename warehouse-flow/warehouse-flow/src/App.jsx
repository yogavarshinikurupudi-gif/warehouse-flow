import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, AlertOctagon, Truck } from 'lucide-react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import PipelineBoard from './components/PipelineBoard';
import InventoryPanel from './components/InventoryPanel';
import ExceptionCenter from './components/ExceptionCenter';
import AnalyticsPanel from './components/AnalyticsPanel';
import { inventory as seedInventory, orders as seedOrders, pipelineStages } from './data/mockData';
import { prioritizeOrders, findAllocationConflicts, checkOrderFeasibility } from './engine/decisionEngine';

function useInventoryBySku(inventory) {
  return useMemo(() => {
    const map = {};
    inventory.forEach((i) => { map[i.sku] = i; });
    return map;
  }, [inventory]);
}

export default function App() {
  const [view, setView] = useState('overview');
  const [inventory, setInventory] = useState(seedInventory);
  const [rawOrders, setRawOrders] = useState(seedOrders.map((o) => ({ ...o, stage: 'Created' })));

  const inventoryBySku = useInventoryBySku(inventory);
  const prioritized = useMemo(() => prioritizeOrders(rawOrders), [rawOrders]);
  const orders = useMemo(
    () => prioritized.map((o) => ({ ...o, feasible: checkOrderFeasibility(o, inventoryBySku) })),
    [prioritized, inventoryBySku]
  );
  const conflicts = useMemo(() => findAllocationConflicts(orders, inventoryBySku), [orders, inventoryBySku]);

  const advanceOrder = (id) => {
    setRawOrders((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const idx = pipelineStages.indexOf(o.stage);
        const next = pipelineStages[Math.min(idx + 1, pipelineStages.length - 1)];
        return { ...o, stage: next };
      })
    );
  };

  const applyAllocation = (result) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.sku === result.sku
          ? { ...item, reserved: item.reserved + Object.values(result.allocation).reduce((a, b) => a + b, 0) }
          : item
      )
    );
  };

  const lowStockCount = inventory.filter((i) => i.onHand - i.reserved < i.avgDailyDemand * i.leadTimeDays * 0.3).length;
  const dispatchedCount = orders.filter((o) => o.stage === 'Dispatched').length;

  const kpis = [
    { label: 'Active Orders', value: orders.length, sub: `${dispatchedCount} dispatched`, color: '#6366f1' },
    { label: 'Allocation Conflicts', value: conflicts.length, sub: conflicts.length ? 'needs a decision' : 'all clear', color: '#f43f5e', alert: conflicts.length > 0 },
    { label: 'Low Stock SKUs', value: lowStockCount, sub: 'below safe cover', color: '#f59e0b' },
    { label: 'SLA at Risk', value: orders.filter((o) => o.breachRisk).length, sub: 'breach within 25% window', color: '#f43f5e' },
  ];

  return (
    <div className="min-h-screen flex bg-base-950 bg-[radial-gradient(ellipse_at_top,_rgba(99,102,241,0.08),_transparent_60%)]">
      <Sidebar active={view} onChange={setView} exceptionCount={conflicts.length} />

      <main className="flex-1 min-w-0 px-4 md:px-8 py-6 space-y-6">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-white">
              {view === 'overview' && 'Operations Overview'}
              {view === 'orders' && 'Order Fulfillment Pipeline'}
              {view === 'inventory' && 'Inventory & Stock Monitoring'}
              {view === 'exceptions' && 'Exception Center'}
              {view === 'analytics' && 'Operational Analytics'}
            </h1>
            <p className="text-sm text-slate-500 mt-0.5">
              {view === 'exceptions'
                ? 'Where demand exceeds supply, the system proposes a fair resolution — you approve it.'
                : 'Live mock data · decisions are computed, not hardcoded'}
            </p>
          </div>
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-500 glass rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-ok-400 animate-pulse" /> simulation live
          </div>
        </header>

        <TopBar kpis={kpis} />

        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
          >
            {view === 'overview' && (
              <div className="space-y-6">
                <section>
                  <SectionTitle icon={Truck} title="Order Pipeline" />
                  <PipelineBoard orders={orders} onAdvance={advanceOrder} />
                </section>
                {conflicts.length > 0 && (
                  <section>
                    <SectionTitle icon={AlertOctagon} title="Needs a decision" tone="urgent" />
                    <ExceptionCenter conflicts={conflicts} onApply={applyAllocation} />
                  </section>
                )}
              </div>
            )}

            {view === 'orders' && <PipelineBoard orders={orders} onAdvance={advanceOrder} />}

            {view === 'inventory' && (
              <div className="space-y-4">
                <SectionTitle icon={Package} title="Stock levels & reorder signals" />
                <InventoryPanel inventory={inventory} />
              </div>
            )}

            {view === 'exceptions' && <ExceptionCenter conflicts={conflicts} onApply={applyAllocation} />}

            {view === 'analytics' && <AnalyticsPanel orders={orders} />}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

function SectionTitle({ icon: Icon, title, tone }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <Icon className={`w-4 h-4 ${tone === 'urgent' ? 'text-urgent-400' : 'text-brand-300'}`} />
      <h2 className="text-sm font-semibold text-slate-200">{title}</h2>
    </div>
  );
}

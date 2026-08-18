# 📦 FlowDock — Smart Warehouse Operations & Order Fulfillment

A warehouse operations platform built for the **Prompt Wars** hackathon
("Smart Warehouse Operations & Order Fulfillment System"). It doesn't just
display inventory and orders — it **scores, allocates, and recommends**,
so a warehouse lead always knows what to do next.

## Why it's decision-first, not just CRUD

| Problem statement ask | How FlowDock answers it |
|---|---|
| Order prioritization | `scoreOrder()` blends SLA urgency, customer tier, and order value into one score |
| Inventory allocation when stock < demand | `allocateFairly()` — priority-weighted allocation with a guaranteed fairness floor, so low-priority orders aren't zeroed out |
| Reorder recommendations | `reorderRecommendation()` — days-of-cover vs. lead time, with a suggested reorder quantity |
| Bottleneck identification | `findBottleneck()` — flags which pipeline stage is holding the most orders |
| Exception → Decision → Resolution | The **Exception Center** surfaces every stock conflict, shows the reasoning, and lets you apply the recommended split with one click |

All of this logic lives in `src/engine/decisionEngine.js` — plain,
readable functions with comments explaining the reasoning, not a black box.

## The competitive-twist example, solved

> An urgent order needs 10 units, only 7 are available. A lower-priority
> order needs 5 units. What should the system do?

FlowDock scores both orders (SLA time remaining, customer tier, value),
reserves a small guaranteed share for every claimant so no order is
starved to zero, then distributes the rest in priority order. The
Exception Center shows this math transparently before you approve it.

## Design & color psychology

- **Indigo (`#6366f1`)** — the primary brand color. Associated with trust,
  focus and technology; used for structure, navigation, and default actions.
- **Amber (`#f59e0b`)** — urgency and attention. Used for "needs a decision",
  low stock, and bottleneck highlights — draws the eye without alarming.
- **Rose (`#f43f5e`)** — critical/blocking states only (stockouts, SLA
  breach risk), so it stays meaningful instead of decorative.
- **Emerald (`#10b981`)** — resolution and health (fulfilled, healthy stock,
  dispatched). Gives positive reinforcement once a decision is applied.
- Dark, glass-panel background keeps a command-center feel and makes the
  status colors legible at a glance — this is a tool operators will stare
  at all day, so low eye strain mattered more than a light theme.

## Tech stack

React 18 + Vite, Tailwind CSS, Framer Motion (animation), Recharts (analytics), Lucide icons.

## Run it locally

```bash
npm install
npm run dev
```

Open the printed local URL (usually `http://localhost:5173`).

## Project structure

```
src/
  engine/decisionEngine.js   # scoring, allocation, reorder, bottleneck logic
  data/mockData.js           # mock inventory, orders, pipeline stages
  components/
    Sidebar.jsx
    TopBar.jsx                # KPI strip
    PipelineBoard.jsx         # Created → ... → Dispatched kanban
    InventoryPanel.jsx        # stock health + reorder table
    ExceptionCenter.jsx       # allocation-conflict decisions
    AnalyticsPanel.jsx        # bottleneck + tier-mix charts
  App.jsx
```

## Flow implemented

`Order Created → Priority Determined → Inventory Checked → Stock Allocated
→ Picking → Packing → Quality Check → Dispatch → Inventory Updated`

Click any order card in the Pipeline view to advance it one stage — this
simulates the operational flow end to end.

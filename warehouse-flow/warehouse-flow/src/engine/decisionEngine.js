// DECISION ENGINE
// This is the part that makes the app more than a CRUD dashboard.
// It scores orders, allocates scarce stock fairly, flags reorders,
// and finds the pipeline stage that's the current bottleneck.

// ---------- 1. Order priority scoring ----------
// Combines SLA urgency, customer tier and order value into one 0-100 score.
export function scoreOrder(order) {
  const hoursElapsed = (Date.now() - new Date(order.placedAt).getTime()) / 3600000;
  const hoursRemaining = Math.max(order.slaHours - hoursElapsed, 0);

  // Urgency: closer to SLA breach = higher score (inverse of time remaining)
  const urgencyScore = Math.max(0, 40 - (hoursRemaining / order.slaHours) * 40);

  const tierScore = { enterprise: 30, growth: 18, standard: 8 }[order.tier] ?? 8;

  const valueScore = Math.min(order.value / 150, 30);

  const total = Math.round(urgencyScore + tierScore + valueScore);
  return {
    score: total,
    hoursRemaining: Math.round(hoursRemaining * 10) / 10,
    breachRisk: hoursRemaining < order.slaHours * 0.25,
  };
}

export function prioritizeOrders(orders) {
  return orders
    .map((o) => ({ ...o, ...scoreOrder(o) }))
    .sort((a, b) => b.score - a.score);
}

// ---------- 2. Stock availability check ----------
export function availableQty(item) {
  return Math.max(item.onHand - item.reserved, 0);
}

export function checkOrderFeasibility(order, inventoryBySku) {
  return order.items.every((line) => {
    const stock = inventoryBySku[line.sku];
    return stock && availableQty(stock) >= line.qty;
  });
}

// ---------- 3. Exception detection: SKUs contested by multiple orders ----------
export function findAllocationConflicts(prioritizedOrders, inventoryBySku) {
  const demandBySku = {};
  prioritizedOrders.forEach((order) => {
    order.items.forEach((line) => {
      if (!demandBySku[line.sku]) demandBySku[line.sku] = [];
      demandBySku[line.sku].push({ order, qty: line.qty });
    });
  });

  const conflicts = [];
  Object.entries(demandBySku).forEach(([sku, claims]) => {
    const totalDemand = claims.reduce((s, c) => s + c.qty, 0);
    const stock = inventoryBySku[sku];
    const available = stock ? availableQty(stock) : 0;
    if (totalDemand > available && claims.length > 0) {
      conflicts.push({ sku, item: stock, claims, totalDemand, available });
    }
  });
  return conflicts;
}

// ---------- 4. Priority-weighted allocation with a fairness floor ----------
// Strategy: give every claimant at least a small guaranteed share
// (so a low-priority order isn't zeroed out entirely), then hand out
// the remaining stock in strict priority order. This mirrors how a
// good human warehouse lead would actually resolve the conflict:
// protect urgent/critical orders first, but don't starve everyone else.
export function allocateFairly(conflict, fairnessFloor = 0.15) {
  const { claims, available } = conflict;
  const sorted = [...claims].sort((a, b) => b.order.score - a.order.score);

  const guaranteedPool = available * fairnessFloor;
  const priorityPool = available - guaranteedPool;

  const guaranteed = {};
  sorted.forEach((c) => {
    const share = Math.min(c.qty, guaranteedPool / sorted.length);
    guaranteed[c.order.id] = Math.floor(share);
  });

  let remaining = available - Object.values(guaranteed).reduce((a, b) => a + b, 0);
  const allocation = { ...guaranteed };

  for (const c of sorted) {
    const stillNeeded = c.qty - allocation[c.order.id];
    if (stillNeeded <= 0 || remaining <= 0) continue;
    const give = Math.min(stillNeeded, remaining);
    allocation[c.order.id] += give;
    remaining -= give;
  }

  const fulfilledCount = sorted.filter((c) => allocation[c.order.id] >= c.qty).length;

  return {
    sku: conflict.sku,
    allocation,
    fulfilledCount,
    totalClaimants: sorted.length,
    explanation: sorted.map((c) => ({
      orderId: c.order.id,
      customer: c.order.customer,
      requested: c.qty,
      granted: allocation[c.order.id],
      fulfilled: allocation[c.order.id] >= c.qty,
      priorityScore: c.order.score,
    })),
  };
}

// ---------- 5. Reorder recommendations ----------
export function reorderRecommendation(item) {
  const available = availableQty(item);
  const daysOfCover = item.avgDailyDemand > 0 ? available / item.avgDailyDemand : Infinity;
  const coverAfterLeadTime = daysOfCover - item.leadTimeDays;

  let status = 'healthy';
  if (available === 0) status = 'stockout';
  else if (coverAfterLeadTime < 0) status = 'reorder_now';
  else if (coverAfterLeadTime < 3) status = 'reorder_soon';

  const suggestedQty = Math.max(
    Math.ceil(item.avgDailyDemand * (item.leadTimeDays + 7) - available),
    0
  );

  return { status, daysOfCover: Math.round(daysOfCover * 10) / 10, suggestedQty };
}

// ---------- 6. Bottleneck detection across pipeline stages ----------
export function findBottleneck(stageCounts, stages) {
  let maxStage = stages[0];
  let maxCount = -1;
  stages.forEach((s) => {
    if ((stageCounts[s] || 0) > maxCount) {
      maxCount = stageCounts[s] || 0;
      maxStage = s;
    }
  });
  return { stage: maxStage, count: maxCount };
}

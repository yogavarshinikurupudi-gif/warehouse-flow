// Mock warehouse dataset — simulates a mid-size fulfillment center

function hoursAgo(h) {
  return new Date(Date.now() - h * 3600 * 1000).toISOString();
}

export const zones = [
  { id: 'A1', label: 'Fast-Pick A1' },
  { id: 'A2', label: 'Fast-Pick A2' },
  { id: 'B1', label: 'Bulk B1' },
  { id: 'B2', label: 'Bulk B2' },
  { id: 'C1', label: 'Cold C1' },
];

export const inventory = [
  { sku: 'SKU-1001', name: 'Wireless Mouse Pro', zone: 'A1', onHand: 84, reserved: 12, leadTimeDays: 4, avgDailyDemand: 9, unitCost: 18 },
  { sku: 'SKU-1002', name: 'Mechanical Keyboard', zone: 'A1', onHand: 41, reserved: 8, leadTimeDays: 6, avgDailyDemand: 5, unitCost: 42 },
  { sku: 'SKU-1003', name: 'USB-C Hub 7-in-1', zone: 'A2', onHand: 9, reserved: 2, leadTimeDays: 5, avgDailyDemand: 6, unitCost: 22 },
  { sku: 'SKU-1004', name: '27" 4K Monitor', zone: 'B1', onHand: 15, reserved: 6, leadTimeDays: 10, avgDailyDemand: 3, unitCost: 210 },
  { sku: 'SKU-1005', name: 'Ergonomic Chair', zone: 'B2', onHand: 22, reserved: 3, leadTimeDays: 14, avgDailyDemand: 2, unitCost: 180 },
  { sku: 'SKU-1006', name: 'Standing Desk', zone: 'B2', onHand: 6, reserved: 5, leadTimeDays: 12, avgDailyDemand: 2, unitCost: 260 },
  { sku: 'SKU-1007', name: 'LED Desk Lamp', zone: 'A2', onHand: 63, reserved: 4, leadTimeDays: 5, avgDailyDemand: 7, unitCost: 15 },
  { sku: 'SKU-1008', name: 'Webcam 4K', zone: 'A1', onHand: 5, reserved: 1, leadTimeDays: 7, avgDailyDemand: 4, unitCost: 65 },
  { sku: 'SKU-1009', name: 'ANC Headphones', zone: 'C1', onHand: 7, reserved: 4, leadTimeDays: 6, avgDailyDemand: 3, unitCost: 95 },
  { sku: 'SKU-1010', name: 'Laptop Stand', zone: 'A2', onHand: 77, reserved: 10, leadTimeDays: 4, avgDailyDemand: 8, unitCost: 20 },
];

export const orders = [
  {
    id: 'ORD-5510', customer: 'Meridian Health Systems', tier: 'enterprise', placedAt: hoursAgo(1),
    slaHours: 6, value: 4200, items: [{ sku: 'SKU-1008', qty: 4 }, { sku: 'SKU-1009', qty: 3 }],
  },
  {
    id: 'ORD-5511', customer: 'Everline Studio', tier: 'growth', placedAt: hoursAgo(2),
    slaHours: 24, value: 1600, items: [{ sku: 'SKU-1008', qty: 2 }, { sku: 'SKU-1004', qty: 2 }],
  },
  {
    id: 'ORD-5512', customer: 'J. Rowntree (Individual)', tier: 'standard', placedAt: hoursAgo(4),
    slaHours: 72, value: 180, items: [{ sku: 'SKU-1001', qty: 3 }, { sku: 'SKU-1007', qty: 2 }],
  },
  {
    id: 'ORD-5513', customer: 'Northgate Logistics', tier: 'enterprise', placedAt: hoursAgo(0.5),
    slaHours: 8, value: 3100, items: [{ sku: 'SKU-1003', qty: 6 }, { sku: 'SKU-1006', qty: 2 }],
  },
  {
    id: 'ORD-5514', customer: 'Casa Studio Co.', tier: 'growth', placedAt: hoursAgo(6),
    slaHours: 48, value: 950, items: [{ sku: 'SKU-1005', qty: 2 }, { sku: 'SKU-1010', qty: 4 }],
  },
  {
    id: 'ORD-5515', customer: 'PixelWorks Freelance', tier: 'standard', placedAt: hoursAgo(3),
    slaHours: 36, value: 260, items: [{ sku: 'SKU-1009', qty: 2 }, { sku: 'SKU-1002', qty: 1 }],
  },
];

export const pipelineStages = [
  'Created', 'Priority Set', 'Inventory Checked', 'Allocated', 'Picking', 'Packing', 'Quality Check', 'Dispatched'
];

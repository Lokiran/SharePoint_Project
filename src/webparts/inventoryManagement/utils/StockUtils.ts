import { IInventoryItem } from '../models/IInventoryItem';
import { IRequest } from '../models/IRequest';

/** Statuses that mean an item is in stock and can be assigned. */
export const isAvailableStatus = (status?: string): boolean => {
  const s = (status || '').toLowerCase().trim();
  return s === 'in stock' || s === 'instock' || s === 'available' || s === 'yes';
};

export function getAvailableStock(items: IInventoryItem[] = [], request?: IRequest): number {
  if (!items || items.length === 0) return 0;
  if (!request) return 0;

  const reqAssetTitle = (request.assetTitle || '').toLowerCase().trim();
  if (!reqAssetTitle) return 0;

  const inStockItems = items.filter(item => {
    const itemTitle = (item.title || item.assetName || item.assetType || '').toLowerCase().trim();
    const itemType = (item.assetType || '').toLowerCase().trim();
    const matchesTitle = itemTitle === reqAssetTitle || itemType === reqAssetTitle;

    return matchesTitle && isAvailableStatus(item.status);
  });

  return inStockItems.length;
}

// ==========================================
// Low-stock alerts
// ==========================================

/** A per-type threshold row from the Stock Thresholds list. */
export interface IStockThreshold {
  id?: number;
  assetType: string;
  /** Undefined = use the default minimum from the property pane. */
  minimumStock?: number;
  /** Set when an alert was sent for the current low-stock episode; cleared when stock recovers. */
  lastAlertSent?: string;
}

export interface IStockLevel {
  assetType: string;
  available: number;
  total: number;
  /** Effective minimum (per-type threshold, else the default). 0 = not monitored. */
  minimum: number;
  /** True when a per-type threshold (not the default) applies. */
  hasCustomMinimum: boolean;
  isLow: boolean;
  threshold?: IStockThreshold;
}

const typeKey = (type?: string): string => (type || '').trim().toLowerCase();

/**
 * Stock level per asset type. Covers every type in the inventory plus any type that
 * only has a threshold row (so a type with zero items still shows as low).
 */
export const evaluateStockLevels = (
  items: IInventoryItem[],
  thresholds: IStockThreshold[],
  defaultMinimum: number
): IStockLevel[] => {
  const levels = new Map<string, IStockLevel>();
  const ensure = (type: string): IStockLevel => {
    const key = typeKey(type);
    let level = levels.get(key);
    if (!level) {
      level = { assetType: type.trim(), available: 0, total: 0, minimum: 0, hasCustomMinimum: false, isLow: false };
      levels.set(key, level);
    }
    return level;
  };

  items.forEach(item => {
    if (!typeKey(item.assetType)) return;
    const level = ensure(item.assetType);
    level.total++;
    if (isAvailableStatus(item.status)) level.available++;
  });
  thresholds.forEach(t => {
    if (typeKey(t.assetType)) ensure(t.assetType).threshold = t;
  });

  levels.forEach(level => {
    const customMinimum = level.threshold ? level.threshold.minimumStock : undefined;
    const custom = customMinimum !== undefined && customMinimum !== null && !isNaN(Number(customMinimum));
    level.hasCustomMinimum = custom;
    level.minimum = custom ? Math.max(0, Number(customMinimum)) : Math.max(0, defaultMinimum);
    level.isLow = level.minimum > 0 && level.available < level.minimum;
  });

  return Array.from(levels.values()).sort((a, b) => a.assetType.localeCompare(b.assetType));
};

/**
 * Which types need an alert now (low, not yet alerted this episode) and which alert
 * flags to clear (stock back at or above the minimum). One email per drop, no repeats.
 */
export const planStockAlerts = (levels: IStockLevel[]): { toAlert: IStockLevel[]; toReset: IStockLevel[] } => ({
  toAlert: levels.filter(l => l.isLow && !(l.threshold && l.threshold.lastAlertSent)),
  toReset: levels.filter(l => !l.isLow && !!(l.threshold && l.threshold.lastAlertSent))
});

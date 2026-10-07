// Pure calculations behind the Reports page (no React).
import { IInventoryItem } from '../../models/IInventoryItem';
import { IRequest } from '../../models/IRequest';
import { statusBucket, StatusBucket, LIFECYCLE_YEARS } from '../inventory/inventoryUi';
import { parseFlexibleDate } from '../common/listUi';

const DAY_MS = 86400000;

export const STATUS_ORDER: StatusBucket[] = ['inStock', 'assigned', 'pendingReturn', 'maintenance', 'retired', 'other'];

/** Condition filter value for "no condition recorded". */
export const CONDITION_NONE = 'none';

export const nameOf =(item: IInventoryItem): string => (item.assetName || item.title || '').trim();

export const countBy = <T>(list: T[], keyOf: (entry: T) => string): { [key: string]: number } => {
  const counts: { [key: string]: number } = {};
  list.forEach(entry => { const key = keyOf(entry); counts[key] = (counts[key] || 0) + 1; });
  return counts;
};

/** Keys of a count map, largest first (ties alphabetical). */
export const rankedKeys = (counts: { [key: string]: number }): string[] =>
  Object.keys(counts).sort((a, b) => counts[b] - counts[a] || a.localeCompare(b));

export const ageYears = (purchaseDate?: string, now: Date = new Date()): number | undefined => {
  const d = parseFlexibleDate(purchaseDate);
  return d ? (now.getTime() - d.getTime()) / (DAY_MS * 365) : undefined;
};

export type AgeBand = 'under1' | 'oneToThree' | 'overThree' | 'unknown';
export const AGE_BANDS: AgeBand[] = ['under1', 'oneToThree', 'overThree', 'unknown'];

export const ageBand = (item: IInventoryItem, now: Date = new Date()): AgeBand => {
  const years = ageYears(item.purchaseDate, now);
  if (years === undefined) return 'unknown';
  return years < 1 ? 'under1' : years <= 3 ? 'oneToThree' : 'overThree';
};

/** Older than the planned lifecycle (the 4-year rule the asset details panel uses). */
export const isPastLifecycle = (item: IInventoryItem, now: Date = new Date()): boolean => {
  const years = ageYears(item.purchaseDate, now);
  return years !== undefined && years >= LIFECYCLE_YEARS;
};

/** The date the asset reaches its planned lifecycle. */
export const replaceBy = (item: IInventoryItem): Date | undefined => {
  const d = parseFlexibleDate(item.purchaseDate);
  if (!d) return undefined;
  const end = new Date(d);
  end.setFullYear(end.getFullYear() + LIFECYCLE_YEARS);
  return end;
};

export type WarrantyBucket = 'expired' | 'within30' | 'within90' | 'later' | 'none';
export const WARRANTY_BUCKETS: WarrantyBucket[] = ['expired', 'within30', 'within90', 'later', 'none'];

/** Days until the warranty ends (negative once expired); undefined without a usable date. */
export const warrantyDays = (item: IInventoryItem, now: Date = new Date()): number | undefined => {
  const d = parseFlexibleDate(item.warrantyExpiry);
  return d ? Math.ceil((d.getTime() - now.getTime()) / DAY_MS) : undefined;
};

export const warrantyBucket = (item: IInventoryItem, now: Date = new Date()): WarrantyBucket => {
  const days = warrantyDays(item, now);
  if (days === undefined) return 'none';
  if (days < 0) return 'expired';
  if (days <= 30) return 'within30';
  return days <= 90 ? 'within90' : 'later';
};

export const needsAttention = (item: IInventoryItem): boolean => /^(poor|damaged)$/i.test((item.condition || '').trim());

/** Someone currently holds the asset (a name is recorded and it is not back in stock or retired). */
export const isHeld = (item: IInventoryItem): boolean => {
  const bucket = statusBucket(item.status);
  return !!(item.assignedTo || '').trim() && bucket !== 'inStock' && bucket !== 'retired';
};

/** When a request was raised: the item's Created time, else its request date text. */
export const requestedOn = (request: IRequest): Date | undefined =>
  parseFlexibleDate(request.createdAt) || parseFlexibleDate(request.requestDate);

export const monthKey = (d: Date): string => `${d.getFullYear()}-${('0' + (d.getMonth() + 1)).slice(-2)}`;

/** `count` consecutive months starting at `offset` months from the current one (negative = past). */
export const monthSeries = (offset: number, count: number, now: Date = new Date()): { key: string; label: string }[] => {
  const months: { key: string; label: string }[] = [];
  for (let i = 0; i < count; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + offset + i, 1);
    months.push({ key: monthKey(d), label: d.toLocaleDateString(undefined, { month: 'short', year: '2-digit' }) });
  }
  return months;
};

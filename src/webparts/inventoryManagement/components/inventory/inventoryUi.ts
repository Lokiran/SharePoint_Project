// Display helpers shared by the Inventory explorer and the asset details panel.
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';

export interface ITone {
  bg: string;
  fg: string;
}

export const TONES = {
  green: { bg: '#dff6dd', fg: '#0e5c0e' },
  blue: { bg: '#ebf3fc', fg: '#0f548c' },
  amber: { bg: '#fff4ce', fg: '#8a3707' },
  orange: { bg: '#fde8d8', fg: '#8e3b0a' },
  red: { bg: '#fde7e9', fg: '#a4262c' },
  grey: { bg: '#f0f0f0', fg: '#424242' }
};

/** Fluent MDL2 icon for an asset type (falls back to a generic device). */
export const assetTypeIcon = (type?: string): string => {
  const t = (type || '').toLowerCase();
  if (t.indexOf('laptop') >= 0 || t.indexOf('notebook') >= 0) return 'System';
  if (t.indexOf('desktop') >= 0 || t.indexOf('pc') >= 0) return 'ThisPC';
  if (t.indexOf('monitor') >= 0 || t.indexOf('display') >= 0 || t.indexOf('screen') >= 0) return 'TVMonitor';
  if (t.indexOf('keyboard') >= 0) return 'KeyboardClassic';
  if (t.indexOf('headset') >= 0 || t.indexOf('headphone') >= 0) return 'Headset';
  if (t.indexOf('phone') >= 0 || t.indexOf('mobile') >= 0) return 'CellPhone';
  if (t.indexOf('tablet') >= 0 || t.indexOf('ipad') >= 0) return 'Tablet';
  if (t.indexOf('printer') >= 0) return 'Print';
  return 'Devices3';
};

export type StatusBucket = 'inStock' | 'assigned' | 'maintenance' | 'pendingReturn' | 'retired' | 'other';

/** Groups the free-text Status column into the buckets the page filters and colours by. */
export const statusBucket = (status?: string): StatusBucket => {
  const s = (status || '').toLowerCase().trim();
  if (s === 'in stock' || s === 'instock' || s === 'yes' || s === 'available' || s === 'return approved') return 'inStock';
  if (s.indexOf('assigned') === 0) return 'assigned';
  if (s.indexOf('maintenance') >= 0 || s.indexOf('repair') >= 0) return 'maintenance';
  if (s.indexOf('pending return') >= 0) return 'pendingReturn';
  if (s.indexOf('retired') >= 0 || s.indexOf('disposed') >= 0 || s.indexOf('lost') >= 0) return 'retired';
  return 'other';
};

/**
 * In stock and free to hand out: the rule the assignment panel has always used
 * ('Return approved' items still count as held until the return is completed).
 */
export const isAssignable = (item: IInventoryItem): boolean => {
  const s = (item.status || '').toLowerCase().trim();
  return s === 'in stock' || s === 'yes';
};

/** Assignable items of a requested asset type (case-insensitive). */
export const assignableOfType = (items: IInventoryItem[], assetType?: string): IInventoryItem[] => {
  const type = (assetType || '').trim().toLowerCase();
  return items.filter(i => isAssignable(i) && (i.assetType || '').trim().toLowerCase() === type);
};

export const statusTone = (status?: string): ITone => {
  switch (statusBucket(status)) {
    case 'inStock': return TONES.green;
    case 'assigned': return TONES.blue;
    case 'maintenance': return TONES.amber;
    case 'pendingReturn': return TONES.orange;
    case 'retired': return TONES.red;
    default: return TONES.grey;
  }
};

export const statusBucketLabel = (bucket: StatusBucket): string => {
  const s = strings.InventoryExplorer;
  switch (bucket) {
    case 'inStock': return s.StatusInStock;
    case 'assigned': return s.StatusAssigned;
    case 'maintenance': return s.StatusMaintenance;
    case 'pendingReturn': return s.StatusPendingReturn;
    case 'retired': return s.StatusRetired;
    default: return s.StatusOther;
  }
};

export const conditionTone = (condition?: string): ITone => {
  const c = (condition || '').toLowerCase();
  if (c === 'new' || c === 'excellent' || c === 'good') return TONES.green;
  if (c === 'fair') return TONES.amber;
  if (c === 'poor' || c === 'damaged') return TONES.red;
  return TONES.grey;
};

const toDate = (raw?: string): Date | undefined => {
  if (!raw) return undefined;
  const d = new Date(raw);
  return isNaN(d.getTime()) ? undefined : d;
};

/** "28 Sept 2026"; the raw text when it isn't a date; "—" when empty. */
export const formatDay = (raw?: string): string => {
  const d = toDate(raw);
  return d ? d.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' }) : (raw || '—');
};

export const formatDateTime = (raw?: string): string => {
  const d = toDate(raw);
  return d ? d.toLocaleString(undefined, { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : (raw || '—');
};

/** Age since purchase: "Under 1 month", "5 mo", "2 yr", "1 yr 4 mo". */
export const ageText = (purchaseDate?: string, now: Date = new Date()): string | undefined => {
  const d = toDate(purchaseDate);
  if (!d || d > now) return undefined;
  const months = (now.getFullYear() - d.getFullYear()) * 12 + (now.getMonth() - d.getMonth()) - (now.getDate() < d.getDate() ? 1 : 0);
  const s = strings.InventoryExplorer;
  if (months < 1) return s.AgeUnderMonth;
  if (months < 12) return formatString(s.AgeMonths, months);
  const years = Math.floor(months / 12);
  const rest = months % 12;
  return rest ? formatString(s.AgeYearsMonths, years, rest) : formatString(s.AgeYears, years);
};

/** Assets are planned for replacement after 4 years (the rule used by the asset analysis panel). */
export const LIFECYCLE_YEARS = 4;

export const lifecyclePercent = (purchaseDate?: string, now: Date = new Date()): number | undefined => {
  const d = toDate(purchaseDate);
  if (!d) return undefined;
  const end = new Date(d);
  end.setFullYear(end.getFullYear() + LIFECYCLE_YEARS);
  const pct = ((now.getTime() - d.getTime()) / (end.getTime() - d.getTime())) * 100;
  return Math.max(0, Math.min(100, pct));
};

export type WarrantyState = 'none' | 'expired' | 'soon' | 'active';

export const WARRANTY_SOON_DAYS = 90;

export const warrantyInfo = (warrantyExpiry?: string, now: Date = new Date()): { state: WarrantyState; tone: ITone; text: string; days?: number } => {
  const s = strings.InventoryExplorer;
  const d = toDate(warrantyExpiry);
  if (!d) return { state: 'none', tone: TONES.grey, text: s.WarrantyNone };
  const days = Math.ceil((d.getTime() - now.getTime()) / 86400000);
  if (days < 0) return { state: 'expired', tone: TONES.red, text: formatString(s.WarrantyExpiredOn, formatDay(warrantyExpiry)), days };
  if (days <= WARRANTY_SOON_DAYS) return { state: 'soon', tone: TONES.amber, text: formatString(s.WarrantyEndsInDays, days), days };
  return { state: 'active', tone: TONES.green, text: formatString(s.WarrantyUntil, formatDay(warrantyExpiry)), days };
};

export const initials = (name?: string): string =>
  (name || '').split(/[\s.@_-]+/).filter(Boolean).slice(0, 2).map(p => p.charAt(0).toUpperCase()).join('') || '?';

/** Category (Title) cleaned the same way the old grouped list did. */
export const categoryOf = (item: IInventoryItem): string => {
  const t = (item.title || '').trim();
  if (!t) return strings.InventoryExplorer.Uncategorised;
  if (/^company\s*assets?$/i.test(t)) return 'Company Assets';
  if (/^leased\s*assets?$/i.test(t)) return 'Leased Assets';
  return t;
};

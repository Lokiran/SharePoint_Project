// Onboarding kits and offboarding checklists. Pure (no SharePoint / localization imports).
import { IInventoryItem } from '../models/IInventoryItem';
import { IReturnRequest } from '../models/IReturnRequest';

export interface IKitLine {
  assetType: string;
  quantity: number;
}

export interface IAssetKit {
  /** SharePoint item ID; undefined for built-in kits that have not been saved. */
  id?: number;
  name: string;
  description: string;
  lines: IKitLine[];
}

/** Used until an admin saves kits to the Asset Kits list. */
export const DEFAULT_KITS: IAssetKit[] = [
  {
    name: 'Standard starter',
    description: 'Laptop with a desk setup for office-based staff.',
    lines: [
      { assetType: 'Laptop', quantity: 1 },
      { assetType: 'Monitor', quantity: 1 },
      { assetType: 'Keyboard', quantity: 1 },
      { assetType: 'Mouse', quantity: 1 },
      { assetType: 'Headset', quantity: 1 }
    ]
  },
  {
    name: 'Remote starter',
    description: 'Laptop and headset for remote staff.',
    lines: [
      { assetType: 'Laptop', quantity: 1 },
      { assetType: 'Headset', quantity: 1 }
    ]
  }
];

/**
 * Parses the KitItems column: one asset type per line (or separated by ";"),
 * with an optional quantity written "Monitor x2", "2 x Monitor" or "Monitor, 2".
 * Repeated types are merged.
 */
export const parseKitItems = (text: string): IKitLine[] => {
  const merged = new Map<string, IKitLine>();
  (text || '')
    .split(/[\r\n;]+/)
    .map(part => part.trim())
    .filter(Boolean)
    .forEach(part => {
      let type = part;
      let quantity = 1;
      const suffix = /^(.*?)\s*(?:[x×*]|,)\s*(\d+)$/i.exec(part);
      const prefix = /^(\d+)\s*[x×*]?\s+(.+)$/i.exec(part);
      if (suffix && suffix[1].trim()) {
        type = suffix[1].trim();
        quantity = parseInt(suffix[2], 10);
      } else if (prefix) {
        quantity = parseInt(prefix[1], 10);
        type = prefix[2].trim();
      }
      if (!type || !(quantity > 0)) return;
      const key = type.toLowerCase();
      const existing = merged.get(key);
      if (existing) existing.quantity += quantity;
      else merged.set(key, { assetType: type, quantity });
    });
  return Array.from(merged.values());
};

/** Inverse of parseKitItems: one line per type, "Type x N" when N > 1. */
export const formatKitItems = (lines: IKitLine[]): string =>
  lines.map(l => (l.quantity > 1 ? `${l.assetType} x${l.quantity}` : l.assetType)).join('\n');

export const kitUnitCount = (kit: IAssetKit): number => kit.lines.reduce((sum, l) => sum + l.quantity, 0);

// ==========================================
// Offboarding
// ==========================================

export type OffboardingState = 'held' | 'returnInProgress' | 'returned';

export interface IOffboardingRow {
  assetId: string;
  assetName: string;
  assetType: string;
  serialNumber: string;
  state: OffboardingState;
  returnStatus?: string;
  /** The inventory item while it is still held. */
  item?: IInventoryItem;
}

const norm = (v?: string): string => (v || '').trim().toLowerCase();

/** True when the item is assigned to this person (matched on email when both are known, else on name). */
export const isHeldBy = (item: IInventoryItem, name: string, email?: string): boolean => {
  if (email && item.assignedToEmail) return norm(item.assignedToEmail) === norm(email);
  return !!norm(item.assignedTo) && norm(item.assignedTo) === norm(name);
};

const isClosedReturn = (r: IReturnRequest): boolean => r.status === 'Completed' || r.status === 'Returned';
const isActiveReturn = (r: IReturnRequest): boolean => !isClosedReturn(r) && r.status !== 'Rejected';

const sameAsset = (r: IReturnRequest, assetId: string, serial: string): boolean =>
  (!!assetId && norm(r.assetId) === norm(assetId)) || (!!serial && norm(r.serialNumber) === norm(serial));

/**
 * Offboarding checklist for one person: every asset they hold now (with any return in
 * progress) plus assets they have already returned, so progress reads "returned / total".
 */
export const buildOffboardingChecklist = (
  items: IInventoryItem[],
  returns: IReturnRequest[],
  name: string,
  email?: string
): IOffboardingRow[] => {
  const held = items.filter(i => isHeldBy(i, name, email));
  const rows: IOffboardingRow[] = held.map(item => {
    const active = returns.find(r => isActiveReturn(r) && sameAsset(r, item.id, item.serialNumber));
    return {
      assetId: item.id,
      assetName: item.assetName || item.title,
      assetType: item.assetType,
      serialNumber: item.serialNumber,
      state: active ? 'returnInProgress' : 'held',
      returnStatus: active ? active.status : undefined,
      item
    };
  });

  returns
    .filter(r => isClosedReturn(r) && norm(r.requesterName) === norm(name))
    .filter(r => !rows.some(row => sameAsset(r, row.assetId, row.serialNumber)))
    .forEach(r => rows.push({
      assetId: r.assetId,
      assetName: r.assetName,
      assetType: r.assetType || '',
      serialNumber: r.serialNumber,
      state: 'returned',
      returnStatus: r.status
    }));

  return rows;
};

/** People who currently hold at least one asset, for the offboarding picker. */
export const listAssetHolders = (items: IInventoryItem[]): { name: string; email?: string; count: number }[] => {
  const byKey = new Map<string, { name: string; email?: string; count: number }>();
  items.forEach(i => {
    const name = (i.assignedTo || '').trim();
    if (!name) return;
    const key = norm(i.assignedToEmail) || norm(name);
    const existing = byKey.get(key);
    if (existing) existing.count++;
    else byKey.set(key, { name, email: i.assignedToEmail || undefined, count: 1 });
  });
  return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
};

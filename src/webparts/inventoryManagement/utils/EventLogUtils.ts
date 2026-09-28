// Pure helpers for the Event Stream: asset-type resolution, client-side
// filtering/sorting and pagination. No SharePoint or localization imports,
// so everything here is unit-testable in isolation.
import { IEventLog, IAuditLogFilters } from '../models/IEventLog';
import { looksLikeODataReference } from './SharePointItemUtils';

/** Lookup tables used to map an event back to the asset type of its source item. */
export interface IAssetTypeLookup {
  /** Inventory item ID -> asset type. */
  byInventoryId: Map<string, string>;
  /** Request item ID or RequestKey -> requested asset type. */
  byRequestId: Map<string, string>;
  /** Normalized inventory asset name / title -> asset type. */
  byAssetName: Map<string, string>;
  /** Distinct asset types in use, in their original casing. */
  knownTypes: string[];
}

export const EMPTY_ASSET_TYPE_LOOKUP: IAssetTypeLookup = {
  byInventoryId: new Map(),
  byRequestId: new Map(),
  byAssetName: new Map(),
  knownTypes: []
};

export const normalizeKey = (value?: string): string => (value || '').trim().toLowerCase();

/**
 * Resolves the asset type an event refers to, most reliable source first:
 * the source item's own AssetType column, then the asset name, then the
 * name itself when it already is a type (request events store the requested type).
 */
export const resolveEventAssetType = (log: IEventLog, lookup: IAssetTypeLookup): string | undefined => {
  const entityId = (log.entityId || '').trim();
  if (entityId) {
    const byId = log.entityType === 'Request' ? lookup.byRequestId.get(entityId) : lookup.byInventoryId.get(entityId);
    if (byId) return byId;
  }

  const name = normalizeKey(log.assetName);
  if (name) {
    const byName = lookup.byAssetName.get(name);
    if (byName) return byName;

    const asType = lookup.knownTypes.find(t => normalizeKey(t) === name);
    if (asType) return asType;
  }

  return undefined;
};

/** Merges type lists case-insensitively, keeping the first spelling seen, sorted A-Z. */
export const mergeAssetTypes = (...sources: (string | undefined)[][]): string[] => {
  const seen = new Map<string, string>();
  sources.forEach(source => source.forEach(type => {
    const key = normalizeKey(type);
    if (key && !seen.has(key)) seen.set(key, (type as string).trim());
  }));
  return Array.from(seen.values()).sort((a, b) => a.localeCompare(b));
};

export const matchesAssetType = (log: IEventLog, selectedType: string): boolean => {
  if (!selectedType || selectedType === 'All') return true;
  const wanted = normalizeKey(selectedType);
  if (log.assetType) {
    return normalizeKey(log.assetType) === wanted;
  }
  // Type could not be resolved (e.g. the asset was deleted): fall back to the
  // original text match so such events stay reachable through the filter.
  return normalizeKey(log.assetName).indexOf(wanted) >= 0 || normalizeKey(log.title).indexOf(wanted) >= 0;
};

/** Special User filter key meaning "the signed-in user"; resolved to a name before filtering. */
export const MY_ACTIVITY_KEY = '__me__';

/**
 * True when the event's user is `selectedUser`. Multi-person events are stored
 * as "A, B", so a match on any one part also counts.
 */
export const matchesUser = (log: IEventLog, selectedUser: string): boolean => {
  if (!selectedUser || selectedUser === 'All') return true;
  const wanted = normalizeKey(selectedUser);
  const user = normalizeKey(log.user);
  return user === wanted || user.split(',').some(part => part.trim() === wanted);
};

export interface IUserOption { name: string; count: number }

/**
 * Distinct users with their event counts, sorted by name. `extraNames` (e.g. users seen
 * in a wider date range) are included with a count of 0 so the list stays stable
 * while other filters narrow the data. REST reference strings are never offered.
 */
export const buildUserOptions = (logs: IEventLog[], extraNames: string[] = []): IUserOption[] => {
  const byKey = new Map<string, IUserOption>();
  const add = (name: string | undefined, count: number): void => {
    const trimmed = (name || '').trim();
    const key = normalizeKey(trimmed);
    if (!key || looksLikeODataReference(trimmed)) return;
    const existing = byKey.get(key);
    if (existing) existing.count += count;
    else byKey.set(key, { name: trimmed, count });
  };
  logs.forEach(log => add(log.user, 1));
  extraNames.forEach(name => add(name, 0));
  return Array.from(byKey.values()).sort((a, b) => a.name.localeCompare(b.name));
};

const matchesSearch = (log: IEventLog, query: string): boolean => {
  const q = normalizeKey(query);
  if (!q) return true;
  return [log.title, log.assetName, log.assetType, log.details, log.user, log.action, log.entityType, log.entityId]
    .some(v => normalizeKey(v).indexOf(q) >= 0);
};

const matchesStatus = (log: IEventLog, status: string): boolean => {
  if (!status || status === 'All') return true;
  const s = normalizeKey(status);
  return [log.details, log.action, log.title].some(v => normalizeKey(v).indexOf(s) >= 0);
};

const compareBySortOrder = (sortOrder: IAuditLogFilters['sortOrder']) => (a: IEventLog, b: IEventLog): number => {
  switch (sortOrder) {
    case 'NewestFirst': return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    case 'OldestFirst': return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    case 'AssetNameAZ': return (a.assetName || '').localeCompare(b.assetName || '');
    case 'AssetNameZA': return (b.assetName || '').localeCompare(a.assetName || '');
    case 'UserAZ': return (a.user || '').localeCompare(b.user || '');
    case 'UserZA': return (b.user || '').localeCompare(a.user || '');
    default: return 0;
  }
};

/**
 * Applies the filters that run in the browser (search, asset type, user, status) and sorting.
 * `filters.user` must already be a name (resolve MY_ACTIVITY_KEY first).
 */
export const applyClientFilters = (logs: IEventLog[], filters: IAuditLogFilters): IEventLog[] => {
  const result = logs.filter(log =>
    matchesSearch(log, filters.searchQuery) &&
    matchesAssetType(log, filters.assetType) &&
    matchesUser(log, filters.user) &&
    matchesStatus(log, filters.status)
  );
  if (filters.sortOrder) {
    result.sort(compareBySortOrder(filters.sortOrder));
  }
  return result;
};

/** Page buttons with ellipses, e.g. [1, '...', 4, 5, 6, '...', 13]. */
export const getPageNumbers = (activePage: number, totalPages: number, maxVisiblePages: number = 5): (number | '...')[] => {
  if (totalPages <= maxVisiblePages) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const pages: (number | '...')[] = [1];
  const start = Math.max(2, activePage - 1);
  const end = Math.min(totalPages - 1, activePage + 1);
  if (start > 2) pages.push('...');
  for (let i = start; i <= end; i++) pages.push(i);
  if (end < totalPages - 1) pages.push('...');
  pages.push(totalPages);
  return pages;
};

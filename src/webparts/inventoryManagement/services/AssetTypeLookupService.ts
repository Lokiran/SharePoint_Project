import { getSP } from "../pnpjsConfig";
import { SharePointBaseService, IFieldMetadata } from "./base/SharePointBaseService";
import { getListDefinition, ListKey } from "../constants/ListDefinitions";
import { IAssetTypeLookup, EMPTY_ASSET_TYPE_LOOKUP, normalizeKey, mergeAssetTypes } from "../utils/EventLogUtils";

const CACHE_TTL_MS = 60 * 1000;
const MAX_ITEMS = 5000;

/**
 * Builds the tables that map audit events to asset types, from the Inventory
 * list (ID/name -> AssetType) and the Request list (ID/RequestKey -> AssetType).
 *
 * The result is cached briefly and in-flight loads are shared, because the
 * Event Stream refetches logs on every server-side filter change.
 */
export class AssetTypeLookupService {
  private static _cache: { expires: number; promise: Promise<IAssetTypeLookup> } | undefined;

  public static getLookup(): Promise<IAssetTypeLookup> {
    const now = Date.now();
    if (!AssetTypeLookupService._cache || AssetTypeLookupService._cache.expires < now) {
      const promise = AssetTypeLookupService._load().catch(err => {
        console.warn("[AssetTypeLookupService] Could not build asset type lookup:", err);
        AssetTypeLookupService._cache = undefined;
        return EMPTY_ASSET_TYPE_LOOKUP;
      });
      AssetTypeLookupService._cache = { expires: now + CACHE_TTL_MS, promise };
    }
    return AssetTypeLookupService._cache.promise;
  }

  /** Drop the cache, e.g. after an asset's type was edited. */
  public static invalidate(): void {
    AssetTypeLookupService._cache = undefined;
  }

  private static async _load(): Promise<IAssetTypeLookup> {
    const siteLists: { Title: string }[] = await getSP().web.lists.select("Title").filter("Hidden eq false")();
    const [inventory, requests] = await Promise.all([
      AssetTypeLookupService._loadInventory(AssetTypeLookupService._resolveTitle('inventory', siteLists)),
      AssetTypeLookupService._loadRequests(AssetTypeLookupService._resolveTitle('request', siteLists))
    ]);

    return {
      byInventoryId: inventory.byId,
      byAssetName: inventory.byName,
      byRequestId: requests.byId,
      knownTypes: mergeAssetTypes(inventory.types, requests.types)
    };
  }

  private static _resolveTitle(key: ListKey, siteLists: { Title: string }[]): string | undefined {
    const def = getListDefinition(key);
    if (!def) return undefined;
    for (const candidate of def.candidates) {
      const match = siteLists.find(l => l.Title.toLowerCase() === candidate.toLowerCase());
      if (match) return match.Title;
    }
    return undefined;
  }

  private static async _getFieldMetadata(list: any): Promise<IFieldMetadata[]> {
    const fields: any[] = await list.fields.select("InternalName", "Title", "TypeAsString")();
    return fields.map(f => ({ internalName: f.InternalName || '', displayName: f.Title || '', fieldType: f.TypeAsString || '', required: false }));
  }

  private static async _loadInventory(title?: string): Promise<{ byId: Map<string, string>; byName: Map<string, string>; types: string[] }> {
    const byId = new Map<string, string>();
    const byName = new Map<string, string>();
    const types: string[] = [];
    if (!title) return { byId, byName, types };

    try {
      const list = getSP().web.lists.getByTitle(title);
      const fields = await AssetTypeLookupService._getFieldMetadata(list);
      const typeKey = SharePointBaseService._resolveFieldInternalName(fields, ["AssetType"]);
      if (!typeKey) return { byId, byName, types };
      const nameKey = SharePointBaseService._resolveFieldInternalName(fields, ["AssetName"]);

      const select = ["ID", "Title", typeKey].concat(nameKey ? [nameKey] : []);
      const items: any[] = await list.items.select(...select).top(MAX_ITEMS)();

      items.forEach(item => {
        const type = AssetTypeLookupService._text(item[typeKey]);
        if (!type) return;
        types.push(type);
        byId.set(String(item.ID), type);
        [nameKey ? item[nameKey] : undefined, item.Title].forEach(name => {
          const key = normalizeKey(AssetTypeLookupService._text(name));
          if (key && !byName.has(key)) byName.set(key, type);
        });
      });
    } catch (err) {
      console.warn("[AssetTypeLookupService] Inventory lookup failed:", err);
    }
    return { byId, byName, types };
  }

  private static async _loadRequests(title?: string): Promise<{ byId: Map<string, string>; types: string[] }> {
    const byId = new Map<string, string>();
    const types: string[] = [];
    if (!title) return { byId, types };

    try {
      const list = getSP().web.lists.getByTitle(title);
      const fields = await AssetTypeLookupService._getFieldMetadata(list);
      // Same column preference as the Event Stream's request-log builder.
      const typeKey = SharePointBaseService._resolveFieldInternalName(fields, ["AssetType", "SelectAsset"]);
      if (!typeKey) return { byId, types };
      const requestKey = SharePointBaseService._resolveFieldInternalName(fields, [SharePointBaseService.REQUEST_KEY_INTERNAL_NAME]);

      const select = ["ID", typeKey].concat(requestKey ? [requestKey] : []);
      const items: any[] = await list.items.select(...select).top(MAX_ITEMS)();

      items.forEach(item => {
        const type = AssetTypeLookupService._text(item[typeKey]);
        if (!type) return;
        types.push(type);
        byId.set(String(item.ID), type);
        const key = requestKey ? AssetTypeLookupService._text(item[requestKey]) : '';
        if (key) byId.set(key, type);
      });
    } catch (err) {
      console.warn("[AssetTypeLookupService] Request lookup failed:", err);
    }
    return { byId, types };
  }

  /** Choice/lookup columns can come back as objects or arrays; reduce to plain text. */
  private static _text(value: any): string {
    if (value === undefined || value === null) return '';
    if (typeof value === 'string') return value.trim();
    if (Array.isArray(value)) return value.length > 0 ? AssetTypeLookupService._text(value[0]) : '';
    if (typeof value === 'object') return AssetTypeLookupService._text(value.Title || value.Label || value.Value);
    return String(value).trim();
  }
}

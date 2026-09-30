import { SPQueryable } from "@pnp/sp";
import { getSP, getContext } from "../pnpjsConfig";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import { SharePointBaseService, IFieldMetadata } from "./base/SharePointBaseService";
import { getConfigListDefinitions, IListDefinition, ListKey } from "../constants/ListDefinitions";

// Re-exported so existing imports of the registry from this service keep working.
export { getListDefinitions, getConfigListDefinitions, IListDefinition, IRequiredColumn, ListKey } from "../constants/ListDefinitions";

export type ListHealthStatus = 'healthy' | 'warning' | 'missing' | 'error';

/**
 * One step of a list check. Required steps are the operations the app itself performs
 * (find the list by title, read its columns, read its items); optional steps only add
 * information to the report and never fail the list.
 */
export type ListCheckKey = 'find' | 'columns' | 'items' | 'permissions' | 'details';

export interface IListCheckStep {
  key: ListCheckKey;
  ok: boolean;
  required: boolean;
  error?: string;
  /** permissions: 'list' = read from the list, 'site' = list unreadable, site permissions used. */
  source?: 'list' | 'site';
}

export interface IListHealthResult {
  key: ListKey;
  status: ListHealthStatus;
  resolvedTitle?: string;
  url?: string;
  itemCount?: number;
  lastModified?: string;
  canRead?: boolean;
  /** undefined = could not be determined (not treated as a problem). */
  canWrite?: boolean;
  presentColumns: string[];
  missingColumns: string[];
  /** Existing site lists with a similar name, offered when no candidate matched. */
  suggestions: string[];
  error?: string;
  /** The required step that failed, when status is 'error'. */
  failedStep?: ListCheckKey;
  checks?: IListCheckStep[];
  durationMs: number;
}

/** "Error making HttpClient request in queryable [403] ::> {json}" -> "HTTP 403: <message>". */
export const describeSharePointError = (e: any): string => {
  const raw: string = e && e.message ? e.message : String(e);
  const statusMatch = /\[(\d{3})\]/.exec(raw);
  const status = (e && (e.status || (e.response && e.response.status))) || (statusMatch ? Number(statusMatch[1]) : undefined);
  let message = raw;
  const jsonStart = raw.indexOf('{');
  if (jsonStart >= 0) {
    try {
      const parsed = JSON.parse(raw.substring(jsonStart));
      const odata = parsed['odata.error'] || parsed.error;
      const value = odata && odata.message && (odata.message.value || odata.message);
      if (typeof value === 'string' && value) message = value;
    } catch {
      // Not JSON; keep the raw text.
    }
  }
  return status ? `HTTP ${status}: ${message}` : message;
};

export interface IEnvironmentInfo {
  siteTitle: string;
  siteUrl: string;
  userName: string;
  userEmail: string;
  isSiteAdmin: boolean;
  uiCulture: string;
  totalSiteLists: number;
}

export interface IHealthReport {
  checkedAt: string;
  environment: IEnvironmentInfo;
  results: IListHealthResult[];
}

export interface IGroupInfo {
  name: string;
  exists: boolean;
  members: { name: string; email: string }[];
  currentUserIsMember: boolean;
  error?: string;
}

// SharePoint PermissionKind values (1-based bit positions in EffectiveBasePermissions).
const PERM_VIEW_LIST_ITEMS = 1;
const PERM_ADD_LIST_ITEMS = 2;
const PERM_EDIT_LIST_ITEMS = 3;

const hasPermission = (perms: { High: any; Low: any } | undefined, kind: number): boolean => {
  if (!perms) return false;
  const bit = kind - 1;
  const word = bit < 32 ? Number(perms.Low) : Number(perms.High);
  return ((word >>> (bit % 32)) & 1) === 1;
};

const normalize = (s: string): string => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');

export class ListHealthService {
  /** Last report, kept for the session so returning to the Config page does not re-query SharePoint. */
  public static lastReport: IHealthReport | undefined;

  public static async runHealthCheck(): Promise<IHealthReport> {
    const sp = getSP();
    let siteLists: { Title: string }[] | undefined;
    try {
      siteLists = await sp.web.lists.select("Title").filter("Hidden eq false")();
    } catch {
      siteLists = undefined; // Each list check then opens its candidates directly.
    }

    const [environment, results] = await Promise.all([
      ListHealthService._getEnvironment(siteLists ? siteLists.length : 0),
      Promise.all(getConfigListDefinitions().map(def => ListHealthService.checkList(def, siteLists)))
    ]);

    const report: IHealthReport = { checkedAt: new Date().toISOString(), environment, results };
    // eslint-disable-next-line require-atomic-updates
    ListHealthService.lastReport = report;
    return report;
  }

  /**
   * Tests a list the way the app uses it, one step at a time:
   *   1. find    - resolve the title (same candidates and matching as the services)   [required]
   *   2. columns - read the field definitions (every service does this before writing) [required]
   *   3. items   - read an item (what every page does)                                 [required]
   *   4. permissions - can the current user add/edit items                            [optional]
   *   5. details - item count, last modified, list URL                                [optional]
   * Only a failed required step fails the list; optional steps add notes to the report.
   */
  // `result` is a local object only this function writes, so require-atomic-updates is a false positive here.
  /* eslint-disable require-atomic-updates */
  public static async checkList(def: IListDefinition, siteLists?: { Title: string }[]): Promise<IListHealthResult> {
    const started = Date.now();
    const sp = getSP();
    const result: IListHealthResult = { key: def.key, status: 'missing', presentColumns: [], missingColumns: [], suggestions: [], checks: [], durationMs: 0 };
    const checks = result.checks as IListCheckStep[];

    const fail = (key: ListCheckKey, e: any): IListHealthResult => {
      const error = describeSharePointError(e);
      checks.push({ key, ok: false, required: true, error });
      result.status = 'error';
      result.failedStep = key;
      result.error = error;
      return result;
    };

    try {
      // 1. Find the list.
      let resolvedTitle: string | undefined;
      let lists: { Title: string }[] | undefined = siteLists;
      if (!lists) {
        try {
          lists = await sp.web.lists.select("Title").filter("Hidden eq false")();
        } catch {
          lists = undefined; // Enumerating lists isn't allowed; fall back to opening each candidate directly.
        }
      }
      if (lists) {
        // Same matching rule as SharePoint's getByTitle: case-insensitive exact title.
        for (const candidate of def.candidates) {
          const match = lists.find(l => l.Title.toLowerCase() === candidate.toLowerCase());
          if (match) {
            resolvedTitle = match.Title;
            break;
          }
        }
      } else {
        let lastError: any;
        for (const candidate of def.candidates) {
          try {
            const info: any = await sp.web.lists.getByTitle(candidate).select("Title")();
            resolvedTitle = info.Title || candidate;
            break;
          } catch (e) {
            lastError = e;
          }
        }
        if (!resolvedTitle && lastError && describeSharePointError(lastError).indexOf('HTTP 404') !== 0) {
          return fail('find', lastError);
        }
      }

      if (!resolvedTitle) {
        const keys = def.candidates.map(normalize);
        result.suggestions = (lists || [])
          .map(l => l.Title)
          .filter(title => {
            const n = normalize(title);
            return keys.some(k => n.indexOf(k) >= 0 || k.indexOf(n) >= 0 || ListHealthService._sharesWord(title, def.candidates));
          })
          .slice(0, 5);
        result.status = def.optional || def.autoCreated ? 'warning' : 'missing';
        result.missingColumns = def.requiredColumns.map(c => c.name);
        checks.push({ key: 'find', ok: false, required: true });
        return result;
      }
      result.resolvedTitle = resolvedTitle;
      checks.push({ key: 'find', ok: true, required: true });
      const list = sp.web.lists.getByTitle(resolvedTitle);

      // 2. Columns.
      let fields: any[];
      try {
        fields = await list.fields.select("InternalName", "Title", "TypeAsString")();
      } catch (e) {
        return fail('columns', e);
      }
      checks.push({ key: 'columns', ok: true, required: true });
      const metadata: IFieldMetadata[] = fields.map(f => ({
        displayName: f.Title || '',
        internalName: f.InternalName || '',
        fieldType: f.TypeAsString || '',
        required: false
      }));
      for (const col of def.requiredColumns) {
        const found = SharePointBaseService._resolveFieldInternalName(metadata, [col.name].concat(col.aliases || []));
        (found ? result.presentColumns : result.missingColumns).push(col.name);
      }

      // 3. Items.
      try {
        await list.items.select("ID").top(1)();
      } catch (e) {
        return fail('items', e);
      }
      result.canRead = true;
      checks.push({ key: 'items', ok: true, required: true });

      // 4. Permissions (optional).
      try {
        const perms: any = await SPQueryable(list, "EffectiveBasePermissions")();
        result.canWrite = hasPermission(perms, PERM_ADD_LIST_ITEMS) && hasPermission(perms, PERM_EDIT_LIST_ITEMS);
        result.canRead = hasPermission(perms, PERM_VIEW_LIST_ITEMS) || result.canRead;
        checks.push({ key: 'permissions', ok: true, required: false, source: 'list' });
      } catch (listPermError) {
        try {
          // Lists normally inherit the site's permissions.
          const perms: any = await SPQueryable(sp.web, "EffectiveBasePermissions")();
          result.canWrite = hasPermission(perms, PERM_ADD_LIST_ITEMS) && hasPermission(perms, PERM_EDIT_LIST_ITEMS);
          checks.push({ key: 'permissions', ok: true, required: false, source: 'site', error: describeSharePointError(listPermError) });
        } catch {
          result.canWrite = undefined;
          checks.push({ key: 'permissions', ok: false, required: false, error: describeSharePointError(listPermError) });
        }
      }

      // 5. Details (optional).
      try {
        const [info, folder] = await Promise.all([
          list.select("ItemCount", "LastItemModifiedDate")(),
          SPQueryable(list, "RootFolder").select("ServerRelativeUrl")()
        ]);
        result.itemCount = (info as any).ItemCount;
        result.lastModified = (info as any).LastItemModifiedDate;
        result.url = (folder as any).ServerRelativeUrl;
        checks.push({ key: 'details', ok: true, required: false });
      } catch (e) {
        checks.push({ key: 'details', ok: false, required: false, error: describeSharePointError(e) });
      }

      result.status = result.missingColumns.length > 0 || result.canWrite === false ? 'warning' : 'healthy';
    } catch (e: any) {
      result.status = 'error';
      result.error = describeSharePointError(e);
    } finally {
      result.durationMs = Date.now() - started;
    }
    return result;
  }
  /* eslint-enable require-atomic-updates */

  public static async loadGroup(groupName: string): Promise<IGroupInfo> {
    const sp = getSP();
    const ctx = getContext();
    const currentEmail = ctx ? (ctx.pageContext.user.email || '').toLowerCase() : '';
    const currentLogin = ctx ? (ctx.pageContext.user.loginName || '').toLowerCase() : '';

    try {
      const users: any[] = await sp.web.siteGroups.getByName(groupName).users();
      const members = users.map(u => ({ name: u.Title || u.LoginName || '', email: u.Email || '' }));
      const currentUserIsMember = users.some(u =>
        (currentEmail && (u.Email || '').toLowerCase() === currentEmail) ||
        (currentLogin && (u.LoginName || '').toLowerCase().indexOf(currentLogin) >= 0)
      );
      return { name: groupName, exists: true, members, currentUserIsMember };
    } catch (e: any) {
      const message = e && e.message ? e.message : String(e);
      const notFound = message.indexOf('404') >= 0 || message.toLowerCase().indexOf('cannot be found') >= 0;
      return { name: groupName, exists: !notFound, members: [], currentUserIsMember: false, error: message };
    }
  }

  private static async _getEnvironment(totalSiteLists: number): Promise<IEnvironmentInfo> {
    const ctx = getContext();
    let isSiteAdmin = false;
    try {
      const me: any = await getSP().web.currentUser.select("IsSiteAdmin")();
      isSiteAdmin = !!me.IsSiteAdmin;
    } catch {
      // Non-critical; leave as false.
    }
    return {
      siteTitle: ctx ? ctx.pageContext.web.title : '',
      siteUrl: ctx ? ctx.pageContext.web.absoluteUrl : '',
      userName: ctx ? ctx.pageContext.user.displayName : '',
      userEmail: ctx ? ctx.pageContext.user.email : '',
      isSiteAdmin,
      uiCulture: ctx ? ctx.pageContext.cultureInfo.currentUICultureName : '',
      totalSiteLists
    };
  }

  private static _sharesWord(title: string, candidates: string[]): boolean {
    const stop = ['list', 'lists', 'request', 'requests', 'asset', 'assets'];
    const words = (s: string): string[] => s.replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && stop.indexOf(w) < 0);
    const titleWords = words(title);
    return candidates.some(c => words(c).some(w => titleWords.indexOf(w) >= 0));
  }
}

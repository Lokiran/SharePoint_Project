import { getSP, getContext } from "../pnpjsConfig";
import "@pnp/sp/site-users/web";
import "@pnp/sp/site-groups/web";
import { SharePointBaseService, IFieldMetadata } from "./base/SharePointBaseService";

/**
 * Single registry of every SharePoint list the web part depends on.
 * `candidates` MUST mirror the name fallbacks used by the owning service
 * (e.g. InventoryItemService.getInventoryList) so that the Config page
 * checks exactly the list the app will actually read and write.
 */
export type ListKey = 'inventory' | 'request' | 'returnRequest' | 'mapping' | 'eventLog' | 'incident' | 'employee' | 'replacement';

export interface IRequiredColumn {
  /** Name shown in the schema guide. */
  name: string;
  /** Additional internal/display names the services accept for this column. */
  aliases?: string[];
}

export interface IListDefinition {
  key: ListKey;
  candidates: string[];
  requiredColumns: IRequiredColumn[];
  /** Core lists block the app; optional lists only disable a feature. */
  optional?: boolean;
  /** The owning service creates the list on first use if it is missing. */
  autoCreated?: boolean;
}

export const LIST_DEFINITIONS: IListDefinition[] = [
  {
    key: 'inventory',
    candidates: [SharePointBaseService.LIST_NAME, "Inventory List"],
    requiredColumns: [
      { name: 'Title' },
      { name: 'AssetName' },
      { name: 'AssetType' },
      { name: 'SerialNumber' },
      { name: 'PurchaseDate' },
      { name: 'Status', aliases: ['AssetStatus'] },
      { name: 'Specifications' },
      { name: 'AssignedTo' }
    ]
  },
  {
    key: 'request',
    candidates: [SharePointBaseService.REQUEST_LIST_NAME, "Request List"],
    requiredColumns: [
      { name: 'Title' },
      { name: 'Employee' },
      { name: 'AssetType' },
      { name: 'Quantity' },
      { name: 'ReasonforRequest', aliases: ['Reason'] },
      { name: SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME },
      { name: SharePointBaseService.REQUEST_KEY_INTERNAL_NAME },
      { name: SharePointBaseService.ASSET_STATUS_INTERNAL_NAME }
    ]
  },
  {
    key: 'returnRequest',
    candidates: [
      SharePointBaseService.RETURN_REQUEST_LIST_NAME,
      "Return Requests List",
      "ReturnRequestList",
      "Return Request List",
      "ReturnRequests",
      "Return Requests"
    ],
    requiredColumns: [
      { name: 'Title' },
      { name: 'AssetID' },
      { name: 'AssetName' },
      { name: 'SerialNumber' },
      { name: 'Employee', aliases: ['RequesterName', 'Requester'] },
      { name: 'ReasonforReturn', aliases: ['ReturnReason'] },
      { name: 'ProposedCondition' },
      { name: 'RequestStatus', aliases: ['ReturnStatus', 'Status'] },
      { name: 'ManagerComments', aliases: ['ManagerComment'] }
    ]
  },
  {
    key: 'mapping',
    candidates: [SharePointBaseService.MAPPING_LIST_NAME, "MappingList"],
    autoCreated: true,
    requiredColumns: [
      { name: 'Title' },
      { name: 'SerialNumber' },
      { name: 'Employee', aliases: ['Employe', 'EmployeeName'] },
      { name: 'EmployeeID' },
      { name: 'AssetName' },
      { name: 'AssignmentID' }
    ]
  },
  {
    key: 'eventLog',
    candidates: [SharePointBaseService.EVENT_LOG_LIST],
    requiredColumns: [
      { name: 'Title' },
      { name: 'Action' },
      { name: 'EntityType' },
      { name: 'EntityId' },
      { name: 'Details' },
      { name: 'User' }
    ]
  },
  { key: 'incident', candidates: ['Incident List'], optional: true, requiredColumns: [] },
  { key: 'employee', candidates: ['EmployeeList'], optional: true, requiredColumns: [] },
  { key: 'replacement', candidates: ['Asset Replacements'], optional: true, autoCreated: true, requiredColumns: [] }
];

export type ListHealthStatus = 'healthy' | 'warning' | 'missing' | 'error';

export interface IListHealthResult {
  key: ListKey;
  status: ListHealthStatus;
  resolvedTitle?: string;
  url?: string;
  itemCount?: number;
  lastModified?: string;
  canRead?: boolean;
  canWrite?: boolean;
  presentColumns: string[];
  missingColumns: string[];
  /** Existing site lists with a similar name, offered when no candidate matched. */
  suggestions: string[];
  error?: string;
  durationMs: number;
}

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
    const siteLists: { Title: string }[] = await sp.web.lists.select("Title").filter("Hidden eq false")();

    const [environment, results] = await Promise.all([
      ListHealthService._getEnvironment(siteLists.length),
      Promise.all(LIST_DEFINITIONS.map(def => ListHealthService.checkList(def, siteLists)))
    ]);

    const report: IHealthReport = { checkedAt: new Date().toISOString(), environment, results };
    // eslint-disable-next-line require-atomic-updates
    ListHealthService.lastReport = report;
    return report;
  }

  public static async checkList(def: IListDefinition, siteLists?: { Title: string }[]): Promise<IListHealthResult> {
    const started = Date.now();
    const sp = getSP();
    const result: IListHealthResult = { key: def.key, status: 'missing', presentColumns: [], missingColumns: [], suggestions: [], durationMs: 0 };

    try {
      const lists: { Title: string }[] = siteLists || await sp.web.lists.select("Title").filter("Hidden eq false")();

      // Same matching rule as SharePoint's getByTitle: case-insensitive exact title.
      let resolvedTitle: string | undefined;
      for (const candidate of def.candidates) {
        const match = lists.find(l => l.Title.toLowerCase() === candidate.toLowerCase());
        if (match) {
          resolvedTitle = match.Title;
          break;
        }
      }

      if (!resolvedTitle) {
        const keys = def.candidates.map(normalize);
        result.suggestions = lists
          .map(l => l.Title)
          .filter(title => {
            const n = normalize(title);
            return keys.some(k => n.indexOf(k) >= 0 || k.indexOf(n) >= 0 || ListHealthService._sharesWord(title, def.candidates));
          })
          .slice(0, 5);
        result.status = def.optional || def.autoCreated ? 'warning' : 'missing';
        result.missingColumns = def.requiredColumns.map(c => c.name);
        return result;
      }

      const list = sp.web.lists.getByTitle(resolvedTitle);
      const [info, fields] = await Promise.all([
        list.select("Title", "ItemCount", "LastItemModifiedDate", "EffectiveBasePermissions", "RootFolder/ServerRelativeUrl").expand("RootFolder")(),
        list.fields.select("InternalName", "Title", "TypeAsString")()
      ]);

      const perms = (info as any).EffectiveBasePermissions;
      result.resolvedTitle = resolvedTitle;
      result.itemCount = (info as any).ItemCount;
      result.lastModified = (info as any).LastItemModifiedDate;
      result.url = (info as any).RootFolder ? (info as any).RootFolder.ServerRelativeUrl : undefined;
      result.canRead = hasPermission(perms, PERM_VIEW_LIST_ITEMS);
      result.canWrite = hasPermission(perms, PERM_ADD_LIST_ITEMS) && hasPermission(perms, PERM_EDIT_LIST_ITEMS);

      const metadata: IFieldMetadata[] = (fields as any[]).map(f => ({
        displayName: f.Title || '',
        internalName: f.InternalName || '',
        fieldType: f.TypeAsString || '',
        required: false
      }));
      for (const col of def.requiredColumns) {
        const found = SharePointBaseService._resolveFieldInternalName(metadata, [col.name].concat(col.aliases || []));
        (found ? result.presentColumns : result.missingColumns).push(col.name);
      }

      result.status = result.missingColumns.length > 0 || !result.canWrite ? 'warning' : 'healthy';
    } catch (e: any) {
      result.status = 'error';
      result.error = e && e.message ? e.message : String(e);
    } finally {
      result.durationMs = Date.now() - started;
    }
    return result;
  }

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

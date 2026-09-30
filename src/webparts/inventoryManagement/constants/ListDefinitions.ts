import { SharePointBaseService } from "../services/base/SharePointBaseService";
import { getAppConfig } from "../config/AppConfig";

/**
 * Single registry of every SharePoint list the web part depends on.
 * `candidates` MUST mirror the name fallbacks used by the owning service
 * (e.g. InventoryItemService.getInventoryList) so that the Config page
 * checks exactly the list the app will actually read and write.
 * The first candidate is always the title configured in the property pane.
 */
export type ListKey =
  | 'inventory' | 'request' | 'returnRequest' | 'mapping' | 'eventLog'
  | 'incident' | 'employee' | 'replacement' | 'stockThresholds' | 'assetKits' | 'appSettings';

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
  /**
   * Not shown on the Config page or included in its health check: settings storage the app
   * creates itself (stock thresholds, kits, app settings) and the optional EmployeeList lookup.
   * The services still use these lists when they exist.
   */
  internal?: boolean;
}

/** Configured title first, then the legacy fallbacks the services also try (case-insensitive de-dupe). */
const names = (configured: string, ...fallbacks: string[]): string[] => {
  const seen: string[] = [];
  [configured].concat(fallbacks).forEach(n => {
    if (n && seen.every(s => s.toLowerCase() !== n.toLowerCase())) seen.push(n);
  });
  return seen;
};

/** Built on each call so it reflects the current property-pane configuration. */
export const getListDefinitions = (): IListDefinition[] => {
  const lists = getAppConfig().lists;
  return [
    {
      key: 'inventory',
      candidates: names(lists.inventory, "InventoryList", "Inventory List"),
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
      candidates: names(lists.request, "RequestList", "Request List"),
      requiredColumns: [
        { name: 'Title' },
        { name: 'Employee' },
        { name: 'AssetType' },
        { name: 'Quantity' },
        { name: 'ReasonforRequest', aliases: ['Reason'] },
        { name: SharePointBaseService.REQUEST_STATUS_INTERNAL_NAME },
        { name: SharePointBaseService.REQUEST_KEY_INTERNAL_NAME },
        { name: SharePointBaseService.ASSET_STATUS_INTERNAL_NAME },
        // SLA milestones; created automatically on the next request submission or approval.
        { name: SharePointBaseService.MANAGER_DECISION_DATE_INTERNAL_NAME },
        { name: SharePointBaseService.ASSET_ASSIGNED_DATE_INTERNAL_NAME }
      ]
    },
    {
      key: 'returnRequest',
      candidates: names(
        lists.returnRequest,
        "Asset Return Request List",
        "Return Requests List",
        "ReturnRequestList",
        "Return Request List",
        "ReturnRequests",
        "Return Requests"
      ),
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
      candidates: names(lists.mapping, "Mapping List", "MappingList"),
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
      candidates: names(lists.eventLog),
      requiredColumns: [
        { name: 'Title' },
        { name: 'Action' },
        { name: 'EntityType' },
        { name: 'EntityId' },
        { name: 'Details' },
        { name: 'User' }
      ]
    },
    { key: 'incident', candidates: names(lists.incident), optional: true, requiredColumns: [] },
    { key: 'employee', candidates: names(lists.employee), optional: true, internal: true, requiredColumns: [] },
    { key: 'replacement', candidates: names(lists.replacement), optional: true, autoCreated: true, requiredColumns: [] },
    {
      key: 'stockThresholds',
      candidates: names(lists.stockThresholds),
      optional: true,
      autoCreated: true,
      internal: true,
      requiredColumns: [{ name: 'Title' }, { name: 'MinimumStock' }, { name: 'LastAlertSent' }]
    },
    {
      key: 'assetKits',
      candidates: names(lists.assetKits),
      optional: true,
      autoCreated: true,
      internal: true,
      requiredColumns: [{ name: 'Title' }, { name: 'KitItems' }, { name: 'KitDescription' }]
    },
    {
      key: 'appSettings',
      candidates: names(lists.appSettings),
      optional: true,
      autoCreated: true,
      internal: true,
      requiredColumns: [{ name: 'Title' }, { name: 'SettingValue' }]
    }
  ];
};

/** The lists shown and health-checked on the Config page (excludes the app's internal settings lists). */
export const getConfigListDefinitions = (): IListDefinition[] =>
  getListDefinitions().filter(d => !d.internal);

export const getListDefinition = (key: ListKey): IListDefinition | undefined =>
  getListDefinitions().find(d => d.key === key);

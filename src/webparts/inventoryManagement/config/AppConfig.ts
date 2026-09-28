// Runtime configuration for the web part, fed from the property pane.
//
// Every setting has a default equal to the value the app used before it became
// configurable, so a web part with an empty property pane behaves exactly as before.
// Pure module (no SharePoint / localization imports) so it is safe to import anywhere,
// including from services and unit tests.

export type AppRole = 'Admin' | 'Inventory Manager' | 'Inventory Employee';

export interface IRoleGroupNames {
  admin: string;
  manager: string;
  employee: string;
}

export interface IListNames {
  inventory: string;
  request: string;
  returnRequest: string;
  mapping: string;
  eventLog: string;
  incident: string;
  employee: string;
  replacement: string;
  stockThresholds: string;
  assetKits: string;
}

export interface IAppConfig {
  roleGroups: IRoleGroupNames;
  lists: IListNames;
  sla: {
    /** Target hours from submission to the manager's decision. */
    approvalHours: number;
    /** Target hours from manager approval to the asset being assigned. */
    assignmentHours: number;
  };
  stock: {
    /** Minimum available units per asset type when no per-type threshold is set. 0 disables the default. */
    defaultMinimum: number;
  };
}

export const DEFAULT_APP_CONFIG: IAppConfig = {
  roleGroups: {
    admin: 'MSFT Owners',
    manager: 'MSFT Members',
    employee: 'MSFT Visitors'
  },
  lists: {
    inventory: 'InventoryList',
    request: 'RequestList',
    returnRequest: 'Asset Return Request List',
    mapping: 'Mapping List',
    eventLog: 'EventLogList',
    incident: 'Incident List',
    employee: 'EmployeeList',
    replacement: 'Asset Replacements',
    stockThresholds: 'Stock Thresholds',
    assetKits: 'Asset Kits'
  },
  sla: {
    approvalHours: 48,
    assignmentHours: 72
  },
  stock: {
    defaultMinimum: 1
  }
};

/** Web part properties that feed the configuration (all optional; blank = default). */
export interface IAppConfigProperties {
  adminGroupName?: string;
  managerGroupName?: string;
  employeeGroupName?: string;
  inventoryListTitle?: string;
  requestListTitle?: string;
  returnRequestListTitle?: string;
  mappingListTitle?: string;
  eventLogListTitle?: string;
  incidentListTitle?: string;
  employeeListTitle?: string;
  replacementListTitle?: string;
  stockThresholdsListTitle?: string;
  assetKitsListTitle?: string;
  approvalSlaHours?: string | number;
  assignmentSlaHours?: string | number;
  defaultMinimumStock?: string | number;
}

const text = (value: string | undefined, fallback: string): string => {
  const trimmed = (value || '').trim();
  return trimmed || fallback;
};

/** Parses a non-negative number; blank or invalid input falls back to the default. */
export const parseNonNegativeNumber = (value: string | number | undefined, fallback: number): number => {
  if (value === undefined || value === null || String(value).trim() === '') return fallback;
  const n = Number(value);
  return isFinite(n) && n >= 0 ? n : fallback;
};

export const buildAppConfig = (props: IAppConfigProperties = {}): IAppConfig => {
  const d = DEFAULT_APP_CONFIG;
  return {
    roleGroups: {
      admin: text(props.adminGroupName, d.roleGroups.admin),
      manager: text(props.managerGroupName, d.roleGroups.manager),
      employee: text(props.employeeGroupName, d.roleGroups.employee)
    },
    lists: {
      inventory: text(props.inventoryListTitle, d.lists.inventory),
      request: text(props.requestListTitle, d.lists.request),
      returnRequest: text(props.returnRequestListTitle, d.lists.returnRequest),
      mapping: text(props.mappingListTitle, d.lists.mapping),
      eventLog: text(props.eventLogListTitle, d.lists.eventLog),
      incident: text(props.incidentListTitle, d.lists.incident),
      employee: text(props.employeeListTitle, d.lists.employee),
      replacement: text(props.replacementListTitle, d.lists.replacement),
      stockThresholds: text(props.stockThresholdsListTitle, d.lists.stockThresholds),
      assetKits: text(props.assetKitsListTitle, d.lists.assetKits)
    },
    sla: {
      approvalHours: parseNonNegativeNumber(props.approvalSlaHours, d.sla.approvalHours),
      assignmentHours: parseNonNegativeNumber(props.assignmentSlaHours, d.sla.assignmentHours)
    },
    stock: {
      defaultMinimum: Math.floor(parseNonNegativeNumber(props.defaultMinimumStock, d.stock.defaultMinimum))
    }
  };
};

let current: IAppConfig = DEFAULT_APP_CONFIG;

export const getAppConfig = (): IAppConfig => current;

export const setAppConfig = (config: IAppConfig): void => {
  current = config;
};

/**
 * Highest role granted by the given SharePoint group titles. A group matches when its
 * title equals or contains the configured name (case-insensitive), as before.
 */
export const resolveRoleFromGroups = (groupTitles: string[], groups: IRoleGroupNames): AppRole => {
  const titles = groupTitles.map(t => (t || '').toLowerCase().trim());
  const inGroup = (name: string): boolean => {
    const wanted = name.toLowerCase().trim();
    return !!wanted && titles.some(t => t === wanted || t.indexOf(wanted) >= 0);
  };
  if (inGroup(groups.admin)) return 'Admin';
  if (inGroup(groups.manager)) return 'Inventory Manager';
  return 'Inventory Employee';
};

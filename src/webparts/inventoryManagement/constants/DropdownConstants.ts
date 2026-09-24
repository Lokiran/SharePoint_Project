import { IDropdownOption } from '@fluentui/react';
import * as strings from 'InventoryManagementWebPartStrings';

// ==========================================
// Asset Options
// ==========================================

export const DEFAULT_ASSET_TYPE_OPTIONS: IDropdownOption[] = [
  { key: 'Laptop', text: strings.Dropdowns.AssetType.Laptop },
  { key: 'Monitor', text: strings.Dropdowns.AssetType.Monitor },
  { key: 'Mouse', text: strings.Dropdowns.AssetType.Mouse },
  { key: 'Keyboard', text: strings.Dropdowns.AssetType.Keyboard },
  { key: 'Headset', text: strings.Dropdowns.AssetType.Headset },
  { key: 'Other', text: strings.Dropdowns.AssetType.Other }
];

export const ASSET_CONDITION_OPTIONS: IDropdownOption[] = [
  { key: 'New', text: strings.Dropdowns.AssetCondition.New },
  { key: 'Excellent', text: strings.Dropdowns.AssetCondition.Excellent },
  { key: 'Good', text: strings.Dropdowns.AssetCondition.Good },
  { key: 'Fair', text: strings.Dropdowns.AssetCondition.Fair },
  { key: 'Poor', text: strings.Dropdowns.AssetCondition.Poor },
  { key: 'Damaged', text: strings.Dropdowns.AssetCondition.Damaged }
];

// Plain string values (no @fluentui/react dependency) for non-UI/service-layer
// consumers (e.g. SharePoint schema fallbacks) that need the same source of truth
// without taking on IDropdownOption typing. These stay on the invariant SharePoint
// Choice-field values (English keys), not the localized display text.
export const ASSET_CONDITION_VALUES: string[] = ASSET_CONDITION_OPTIONS.map(option => option.key as string);

// ==========================================
// Incident Options
// ==========================================

export const INCIDENT_TYPE_OPTIONS: IDropdownOption[] = [
  { key: 'Hardware Issue', text: strings.Dropdowns.IncidentType.HardwareIssue },
  { key: 'Software Issue', text: strings.Dropdowns.IncidentType.SoftwareIssue },
  { key: 'Network Issue', text: strings.Dropdowns.IncidentType.NetworkIssue },
  { key: 'Asset Damage', text: strings.Dropdowns.IncidentType.AssetDamage },
  { key: 'Replacement Request', text: strings.Dropdowns.IncidentType.ReplacementRequest },
  { key: 'Access Issue', text: strings.Dropdowns.IncidentType.AccessIssue },
  { key: 'Login Issue', text: strings.Dropdowns.IncidentType.LoginIssue },
  { key: 'Performance Issue', text: strings.Dropdowns.IncidentType.PerformanceIssue },
  { key: 'Email Issue', text: strings.Dropdowns.IncidentType.EmailIssue },
  { key: 'Printer Issue', text: strings.Dropdowns.IncidentType.PrinterIssue },
  { key: 'Other', text: strings.Dropdowns.IncidentType.Other }
];

export const INCIDENT_PRIORITY_OPTIONS: IDropdownOption[] = [
  { key: 'Low', text: strings.Dropdowns.IncidentPriority.Low },
  { key: 'Medium', text: strings.Dropdowns.IncidentPriority.Medium },
  { key: 'High', text: strings.Dropdowns.IncidentPriority.High },
  { key: 'Critical', text: strings.Dropdowns.IncidentPriority.Critical }
];

export const INCIDENT_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Open', text: strings.Dropdowns.IncidentStatus.Open },
  { key: 'In Progress', text: strings.Dropdowns.IncidentStatus.InProgress },
  { key: 'Resolved', text: strings.Dropdowns.IncidentStatus.Resolved },
  { key: 'Closed', text: strings.Dropdowns.IncidentStatus.Closed }
];

// ==========================================
// Return Options
// ==========================================

export const RETURN_CONDITION_OPTIONS: IDropdownOption[] = [
  { key: 'Good', text: strings.Dropdowns.ReturnCondition.Good },
  { key: 'Fair', text: strings.Dropdowns.ReturnCondition.Fair },
  { key: 'Poor', text: strings.Dropdowns.ReturnCondition.Poor },
  { key: 'Damaged', text: strings.Dropdowns.ReturnCondition.Damaged }
];

export const RETURN_REQUEST_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Pending', text: strings.Dropdowns.ReturnRequestStatus.Pending },
  { key: 'Approved', text: strings.Dropdowns.ReturnRequestStatus.Approved },
  { key: 'Rejected', text: strings.Dropdowns.ReturnRequestStatus.Rejected },
  { key: 'Completed', text: strings.Dropdowns.ReturnRequestStatus.Completed }
];

// ==========================================
// Request Options
// ==========================================

export const ASSET_REQUEST_PRIORITY_OPTIONS: IDropdownOption[] = [
  { key: 'Low', text: strings.Dropdowns.AssetRequestPriority.Low },
  { key: 'Medium', text: strings.Dropdowns.AssetRequestPriority.Medium },
  { key: 'High', text: strings.Dropdowns.AssetRequestPriority.High }
];

export const ASSET_REQUEST_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Pending Manager Approval', text: strings.Dropdowns.AssetRequestStatus.PendingManagerApproval },
  { key: 'Approved by Manager', text: strings.Dropdowns.AssetRequestStatus.ApprovedByManager },
  { key: 'Rejected', text: strings.Dropdowns.AssetRequestStatus.Rejected },
  { key: 'Asset Assigned', text: strings.Dropdowns.AssetRequestStatus.AssetAssigned }
];

// ==========================================
// Warranty Options
// ==========================================

export const WARRANTY_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Active', text: strings.Dropdowns.WarrantyStatus.Active },
  { key: 'Expiring Soon', text: strings.Dropdowns.WarrantyStatus.ExpiringSoon },
  { key: 'Expired', text: strings.Dropdowns.WarrantyStatus.Expired },
  { key: 'Unknown', text: strings.Dropdowns.WarrantyStatus.Unknown }
];

// ==========================================
// Audit Log / Event Stream Filter Options
// ==========================================

export const AUDIT_LOG_DATE_RANGE_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: strings.Dropdowns.AuditLogDateRange.All },
  { key: 'Today', text: strings.Dropdowns.AuditLogDateRange.Today },
  { key: 'Yesterday', text: strings.Dropdowns.AuditLogDateRange.Yesterday },
  { key: 'Last7', text: strings.Dropdowns.AuditLogDateRange.Last7 },
  { key: 'Last15', text: strings.Dropdowns.AuditLogDateRange.Last15 },
  { key: 'Last30', text: strings.Dropdowns.AuditLogDateRange.Last30 },
  { key: 'Last60', text: strings.Dropdowns.AuditLogDateRange.Last60 },
  { key: 'Last90', text: strings.Dropdowns.AuditLogDateRange.Last90 },
  { key: 'ThisWeek', text: strings.Dropdowns.AuditLogDateRange.ThisWeek },
  { key: 'ThisMonth', text: strings.Dropdowns.AuditLogDateRange.ThisMonth },
  { key: 'Custom', text: strings.Dropdowns.AuditLogDateRange.Custom }
];

export const AUDIT_LOG_MODULE_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: strings.Dropdowns.AuditLogModule.All },
  { key: 'Inventory', text: strings.Dropdowns.AuditLogModule.Inventory },
  { key: 'Requests', text: strings.Dropdowns.AuditLogModule.Requests },
  { key: 'Returns', text: strings.Dropdowns.AuditLogModule.Returns },
  { key: 'Users', text: strings.Dropdowns.AuditLogModule.Users },
  { key: 'Reports', text: strings.Dropdowns.AuditLogModule.Reports },
  { key: 'Configuration', text: strings.Dropdowns.AuditLogModule.Configuration },
  { key: 'Notifications', text: strings.Dropdowns.AuditLogModule.Notifications }
];

export const AUDIT_LOG_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'All', text: strings.Dropdowns.AuditLogStatus.All },
  { key: 'Pending', text: strings.Dropdowns.AuditLogStatus.Pending },
  { key: 'Approved', text: strings.Dropdowns.AuditLogStatus.Approved },
  { key: 'Rejected', text: strings.Dropdowns.AuditLogStatus.Rejected },
  { key: 'Assigned', text: strings.Dropdowns.AuditLogStatus.Assigned },
  { key: 'Returned', text: strings.Dropdowns.AuditLogStatus.Returned },
  { key: 'Completed', text: strings.Dropdowns.AuditLogStatus.Completed }
];

export const AUDIT_LOG_SORT_OPTIONS: IDropdownOption[] = [
  { key: 'NewestFirst', text: strings.Dropdowns.AuditLogSort.NewestFirst },
  { key: 'OldestFirst', text: strings.Dropdowns.AuditLogSort.OldestFirst },
  { key: 'AssetNameAZ', text: strings.Dropdowns.AuditLogSort.AssetNameAZ },
  { key: 'AssetNameZA', text: strings.Dropdowns.AuditLogSort.AssetNameZA },
  { key: 'UserAZ', text: strings.Dropdowns.AuditLogSort.UserAZ },
  { key: 'UserZA', text: strings.Dropdowns.AuditLogSort.UserZA }
];

// ==========================================
// Incident Routing Options
// ==========================================

export const INCIDENT_RAISED_TO_OPTIONS: IDropdownOption[] = [
  { key: 'Admin', text: strings.Dropdowns.IncidentRaisedTo.Admin }
];

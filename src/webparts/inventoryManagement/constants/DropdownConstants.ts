import { IDropdownOption } from '@fluentui/react';

// ==========================================
// Asset Options
// ==========================================

export const DEFAULT_ASSET_TYPE_OPTIONS: IDropdownOption[] = [
  { key: 'Laptop', text: 'Laptop' },
  { key: 'Monitor', text: 'Monitor' },
  { key: 'Mouse', text: 'Mouse' },
  { key: 'Keyboard', text: 'Keyboard' },
  { key: 'Headset', text: 'Headset' },
  { key: 'Other', text: 'Other' }
];

export const ASSET_CONDITION_OPTIONS: IDropdownOption[] = [
  { key: 'New', text: 'New' },
  { key: 'Excellent', text: 'Excellent' },
  { key: 'Good', text: 'Good' },
  { key: 'Fair', text: 'Fair' },
  { key: 'Poor', text: 'Poor' },
  { key: 'Damaged', text: 'Damaged' }
];

// ==========================================
// Incident Options
// ==========================================

export const INCIDENT_TYPE_OPTIONS: IDropdownOption[] = [
  { key: 'Hardware Issue', text: 'Hardware Issue' },
  { key: 'Software Issue', text: 'Software Issue' },
  { key: 'Network Issue', text: 'Network Issue' },
  { key: 'Asset Damage', text: 'Asset Damage' },
  { key: 'Replacement Request', text: 'Replacement Request' },
  { key: 'Access Issue', text: 'Access Issue' },
  { key: 'Login Issue', text: 'Login Issue' },
  { key: 'Performance Issue', text: 'Performance Issue' },
  { key: 'Email Issue', text: 'Email Issue' },
  { key: 'Printer Issue', text: 'Printer Issue' },
  { key: 'Other', text: 'Other' }
];

export const INCIDENT_PRIORITY_OPTIONS: IDropdownOption[] = [
  { key: 'Low', text: 'Low' },
  { key: 'Medium', text: 'Medium' },
  { key: 'High', text: 'High' },
  { key: 'Critical', text: 'Critical' }
];

export const INCIDENT_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Open', text: 'Open' },
  { key: 'In Progress', text: 'In Progress' },
  { key: 'Resolved', text: 'Resolved' },
  { key: 'Closed', text: 'Closed' }
];

// ==========================================
// Return Options
// ==========================================

export const RETURN_CONDITION_OPTIONS: IDropdownOption[] = [
  { key: 'Good', text: 'Good (No damage, fully functional)' },
  { key: 'Fair', text: 'Fair (Minor wear, fully functional)' },
  { key: 'Poor', text: 'Poor (Significant wear, needs repair)' },
  { key: 'Damaged', text: 'Damaged (Broken, non-functional)' }
];

export const RETURN_REQUEST_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Pending', text: 'Pending' },
  { key: 'Approved', text: 'Approved' },
  { key: 'Rejected', text: 'Rejected' },
  { key: 'Completed', text: 'Completed' }
];

// ==========================================
// Request Options
// ==========================================

export const ASSET_REQUEST_PRIORITY_OPTIONS: IDropdownOption[] = [
  { key: 'Low', text: 'Low' },
  { key: 'Medium', text: 'Medium' },
  { key: 'High', text: 'High' }
];

export const ASSET_REQUEST_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Pending Manager Approval', text: 'Pending Manager Approval' },
  { key: 'Approved by Manager', text: 'Approved by Manager' },
  { key: 'Rejected', text: 'Rejected' },
  { key: 'Asset Assigned', text: 'Asset Assigned' }
];

// ==========================================
// Warranty Options
// ==========================================

export const WARRANTY_STATUS_OPTIONS: IDropdownOption[] = [
  { key: 'Active', text: 'Active' },
  { key: 'Expiring Soon', text: 'Expiring Soon' },
  { key: 'Expired', text: 'Expired' },
  { key: 'Unknown', text: 'Unknown' }
];

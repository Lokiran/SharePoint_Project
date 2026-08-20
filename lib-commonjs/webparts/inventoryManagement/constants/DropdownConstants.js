"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WARRANTY_STATUS_OPTIONS = exports.ASSET_REQUEST_STATUS_OPTIONS = exports.ASSET_REQUEST_PRIORITY_OPTIONS = exports.RETURN_REQUEST_STATUS_OPTIONS = exports.RETURN_CONDITION_OPTIONS = exports.INCIDENT_STATUS_OPTIONS = exports.INCIDENT_PRIORITY_OPTIONS = exports.INCIDENT_TYPE_OPTIONS = exports.ASSET_CONDITION_OPTIONS = exports.DEFAULT_ASSET_TYPE_OPTIONS = void 0;
// ==========================================
// Asset Options
// ==========================================
exports.DEFAULT_ASSET_TYPE_OPTIONS = [
    { key: 'Laptop', text: 'Laptop' },
    { key: 'Monitor', text: 'Monitor' },
    { key: 'Mouse', text: 'Mouse' },
    { key: 'Keyboard', text: 'Keyboard' },
    { key: 'Headset', text: 'Headset' },
    { key: 'Other', text: 'Other' }
];
exports.ASSET_CONDITION_OPTIONS = [
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
exports.INCIDENT_TYPE_OPTIONS = [
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
exports.INCIDENT_PRIORITY_OPTIONS = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' },
    { key: 'Critical', text: 'Critical' }
];
exports.INCIDENT_STATUS_OPTIONS = [
    { key: 'Open', text: 'Open' },
    { key: 'In Progress', text: 'In Progress' },
    { key: 'Resolved', text: 'Resolved' },
    { key: 'Closed', text: 'Closed' }
];
// ==========================================
// Return Options
// ==========================================
exports.RETURN_CONDITION_OPTIONS = [
    { key: 'Good', text: 'Good (No damage, fully functional)' },
    { key: 'Fair', text: 'Fair (Minor wear, fully functional)' },
    { key: 'Poor', text: 'Poor (Significant wear, needs repair)' },
    { key: 'Damaged', text: 'Damaged (Broken, non-functional)' }
];
exports.RETURN_REQUEST_STATUS_OPTIONS = [
    { key: 'Pending', text: 'Pending' },
    { key: 'Approved', text: 'Approved' },
    { key: 'Rejected', text: 'Rejected' },
    { key: 'Completed', text: 'Completed' }
];
// ==========================================
// Request Options
// ==========================================
exports.ASSET_REQUEST_PRIORITY_OPTIONS = [
    { key: 'Low', text: 'Low' },
    { key: 'Medium', text: 'Medium' },
    { key: 'High', text: 'High' }
];
exports.ASSET_REQUEST_STATUS_OPTIONS = [
    { key: 'Pending Manager Approval', text: 'Pending Manager Approval' },
    { key: 'Approved by Manager', text: 'Approved by Manager' },
    { key: 'Rejected', text: 'Rejected' },
    { key: 'Asset Assigned', text: 'Asset Assigned' }
];
// ==========================================
// Warranty Options
// ==========================================
exports.WARRANTY_STATUS_OPTIONS = [
    { key: 'Active', text: 'Active' },
    { key: 'Expiring Soon', text: 'Expiring Soon' },
    { key: 'Expired', text: 'Expired' },
    { key: 'Unknown', text: 'Unknown' }
];
//# sourceMappingURL=DropdownConstants.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AssetTracking = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const RoleUtils_1 = require("../utils/RoleUtils");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const AssetTracking = (props) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState();
    const stackTokens = { childrenGap: 20 };
    if (!RoleUtils_1.RoleUtils.canAssignAssets(props.currentUserRole)) {
        return (React.createElement(react_1.MessageBar, { messageBarType: react_1.MessageBarType.error }, strings.AssetTracking.NoPermission));
    }
    // Patch the Admin employee with the REAL user's email and name so that SharePoint's ensureUser works correctly
    const patchedEmployees = props.employees.map(emp => {
        if (emp.jobTitle === 'Admin') {
            return {
                ...emp,
                name: props.currentUserName || emp.name,
                email: props.currentUserEmail || emp.email
            };
        }
        return emp;
    });
    const employeeOptions = patchedEmployees.map(emp => ({
        key: emp.id,
        text: `${emp.name} (${emp.department})`
    }));
    const selectedEmployee = patchedEmployees.find(e => e.id === selectedEmployeeId);
    const normalize = (val) => (val || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    const employeeAssignedAssets = props.items.filter(i => {
        if (!selectedEmployee)
            return false;
        const nameNorm = normalize(selectedEmployee.name);
        const assignedNorm = normalize(i.assignedTo);
        const isAssigned = assignedNorm && (assignedNorm === nameNorm || assignedNorm.includes(nameNorm) || nameNorm.includes(assignedNorm));
        const isNoted = (i.note || '').toLowerCase().includes('assigned to:') && normalize(i.note).includes(nameNorm);
        const isStatus = (i.status || '').toLowerCase().includes('assigned to:') && normalize(i.status).includes(nameNorm);
        return isAssigned || isNoted || isStatus;
    });
    return (React.createElement("div", { style: { marginTop: '20px' } },
        React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', marginBottom: '20px' } },
            React.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } }, strings.AssetTracking.SelectEmployee),
            React.createElement(react_1.Dropdown, { placeholder: strings.AssetTracking.PlaceholderSelectEmployee, options: employeeOptions, selectedKey: selectedEmployeeId, onChange: (_, option) => setSelectedEmployeeId(option?.key), styles: { dropdown: { width: '100%', maxWidth: 400 } } })),
        selectedEmployee && (React.createElement(react_1.Stack, { tokens: stackTokens },
            React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                React.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } }, (0, LocalizationUtils_1.formatString)(strings.AssetTracking.CurrentlyAssignedTo, selectedEmployee.name)),
                employeeAssignedAssets.length > 0 ? (React.createElement("div", { className: InventoryManagement_module_scss_1.default.tableWrapper },
                    React.createElement(react_1.DetailsList, { items: employeeAssignedAssets, columns: [
                            { key: 'col1', name: strings.AssetTracking.ColAssetName, fieldName: 'assetName', minWidth: 150, maxWidth: 200, isResizable: true, onRender: item => item.assetName || item.title },
                            { key: 'col2', name: strings.AssetTracking.ColType, fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                            { key: 'col3', name: strings.AssetTracking.ColSerialNumber, fieldName: 'serialNumber', minWidth: 120, maxWidth: 180, isResizable: true },
                            { key: 'col4', name: strings.AssetTracking.ColStatus, fieldName: 'status', minWidth: 100, maxWidth: 120, isResizable: true },
                            {
                                key: 'col5',
                                name: strings.AssetTracking.ColAssignedDate,
                                fieldName: 'assignedDate',
                                minWidth: 120,
                                maxWidth: 150,
                                isResizable: true,
                                onRender: item => {
                                    if (!item.assignedDate)
                                        return strings.AssetTracking.NotAvailable;
                                    try {
                                        return new Date(item.assignedDate).toLocaleString();
                                    }
                                    catch {
                                        return item.assignedDate;
                                    }
                                }
                            }
                        ], selectionMode: react_1.SelectionMode.none, layoutMode: react_1.DetailsListLayoutMode.justified }))) : (React.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem' } }, strings.AssetTracking.NoAssetsAssigned)))))));
};
exports.AssetTracking = AssetTracking;
//# sourceMappingURL=AssetTracking.js.map
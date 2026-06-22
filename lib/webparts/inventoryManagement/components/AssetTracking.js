import * as React from 'react';
import { Dropdown, DetailsList, DetailsListLayoutMode, SelectionMode, Stack, MessageBar, MessageBarType } from '@fluentui/react';
import { RoleUtils } from '../utils/RoleUtils';
export const AssetTracking = (props) => {
    const [selectedEmployeeId, setSelectedEmployeeId] = React.useState();
    const stackTokens = { childrenGap: 20 };
    if (!RoleUtils.canAssignAssets(props.currentUserRole)) {
        return (React.createElement(MessageBar, { messageBarType: MessageBarType.error }, "You do not have permission to access the Asset Tracking section. Only Admins and Managers can assign assets."));
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
            React.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } }, "Select Employee"),
            React.createElement(Dropdown, { placeholder: "Select an employee to view assets", options: employeeOptions, selectedKey: selectedEmployeeId, onChange: (_, option) => setSelectedEmployeeId(option?.key), styles: { dropdown: { width: 400 } } })),
        selectedEmployee && (React.createElement(Stack, { tokens: stackTokens },
            React.createElement("div", { style: { backgroundColor: 'var(--surface-color, #ffffff)', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' } },
                React.createElement("h4", { style: { marginTop: 0, marginBottom: '15px', color: '#111827' } },
                    "Currently Assigned to ",
                    selectedEmployee.name),
                employeeAssignedAssets.length > 0 ? (React.createElement(DetailsList, { items: employeeAssignedAssets, columns: [
                        { key: 'col1', name: 'Asset Name', fieldName: 'assetName', minWidth: 150, maxWidth: 200, isResizable: true, onRender: item => item.assetName || item.title },
                        { key: 'col2', name: 'Type', fieldName: 'assetType', minWidth: 100, maxWidth: 150, isResizable: true },
                        { key: 'col3', name: 'Serial Number', fieldName: 'serialNumber', minWidth: 120, maxWidth: 180, isResizable: true },
                        { key: 'col4', name: 'Status', fieldName: 'status', minWidth: 100, maxWidth: 120, isResizable: true },
                        {
                            key: 'col5',
                            name: 'Assigned Date',
                            fieldName: 'assignedDate',
                            minWidth: 120,
                            maxWidth: 150,
                            isResizable: true,
                            onRender: item => {
                                if (!item.assignedDate)
                                    return 'N/A';
                                try {
                                    return new Date(item.assignedDate).toLocaleString();
                                }
                                catch {
                                    return item.assignedDate;
                                }
                            }
                        }
                    ], selectionMode: SelectionMode.none, layoutMode: DetailsListLayoutMode.justified })) : (React.createElement("p", { style: { color: '#6b7280', fontSize: '0.9rem' } }, "This employee has no assets currently assigned.")))))));
};
//# sourceMappingURL=AssetTracking.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestList = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const react_1 = require("@fluentui/react");
const RequestList = (props) => {
    const columns = [
        {
            key: 'columnRequestKey',
            name: 'Request ID',
            fieldName: 'requestKey',
            minWidth: 90,
            maxWidth: 125,
            isResizable: true
        },
        {
            key: 'columnEmployeeName',
            name: 'Employee Name',
            fieldName: 'requesterName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'columnEmployeeId',
            name: 'Employee ID',
            fieldName: 'employeeId',
            minWidth: 90,
            maxWidth: 110,
            isResizable: true,
            onRender: (item) => item.employeeId || '-'
        },
        {
            key: 'columnAssetType',
            name: 'Asset Type',
            fieldName: 'assetTitle',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        {
            key: 'columnQuantity',
            name: 'Quantity',
            fieldName: 'quantity',
            minWidth: 60,
            maxWidth: 80,
            isResizable: true
        },
        {
            key: 'columnReason',
            name: 'Reason for Request',
            fieldName: 'reason',
            minWidth: 150,
            maxWidth: 250,
            isResizable: true,
            onRender: (item) => item.reason || '-'
        },
        {
            key: 'columnPriority',
            name: 'Priority',
            fieldName: 'priority',
            minWidth: 80,
            maxWidth: 100,
            isResizable: true,
            onRender: (item) => {
                const priority = item.priority || 'Medium';
                let color = '#4b5563'; // default medium (gray)
                let backgroundColor = '#f3f4f6';
                if (priority === 'High') {
                    color = '#b91c1c';
                    backgroundColor = '#fee2e2';
                }
                else if (priority === 'Low') {
                    color = '#1e3a8a';
                    backgroundColor = '#dbeafe';
                }
                return (React.createElement("span", { style: {
                        backgroundColor,
                        color,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600
                    } }, priority));
            }
        },
        {
            key: 'columnRequestDate',
            name: 'Request Date',
            fieldName: 'requestDate',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        ...(props.hideStatusColumn ? [] : [{
                key: 'column6',
                name: props.statusColumnLabel || 'Status',
                fieldName: props.statusField || 'status',
                minWidth: 80,
                maxWidth: 100,
                isResizable: true,
                onRender: (item) => {
                    let val = item[props.statusField || 'status'] || 'Pending';
                    if (val === 'Pending')
                        val = 'Pending';
                    let backgroundColor = '#fef3c7'; // default pending (yellow)
                    let textColor = '#92400e';
                    if (val === 'Approved') {
                        backgroundColor = '#dcfce7';
                        textColor = '#166534';
                    }
                    else if (val === 'Declined') {
                        backgroundColor = '#fee2e2';
                        textColor = '#991b1b';
                    }
                    return (React.createElement("span", { style: {
                            backgroundColor,
                            color: textColor,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block'
                        } }, val));
                }
            }]),
        ...(props.canApproveAsset ? [{
                key: 'columnAssetStatus',
                name: 'Asset Status',
                fieldName: 'assetStatus',
                minWidth: 140,
                maxWidth: 200,
                isResizable: true,
                onRender: (item) => {
                    const value = item.assetStatus || 'Pending';
                    const isApproved = value.toLowerCase().includes('approv');
                    const isBusy = props.actionInProgressId === item.id;
                    return (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
                        React.createElement("span", { style: {
                                backgroundColor: isApproved ? '#dcfce7' : '#fef3c7',
                                color: isApproved ? '#166534' : '#92400e',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-block'
                            } }, value),
                        !isApproved && (React.createElement(react_1.PrimaryButton, { text: "Approve", onClick: () => props.onApproveAsset && props.onApproveAsset(item), disabled: isBusy }))));
                }
            }] : []),
        ...(props.showResponseColumns ? [
            { key: 'columnManagerResponse', name: 'Manager Response', fieldName: 'managerResponse', minWidth: 170, maxWidth: 240, isResizable: true },
            {
                key: 'columnAdminResponse',
                name: 'Admin Response',
                fieldName: 'assetStatus',
                minWidth: 140,
                maxWidth: 200,
                isResizable: true,
                onRender: (item) => {
                    const managerStatus = (item.status || '').toLowerCase();
                    if (managerStatus === 'pending') {
                        return React.createElement("span", { style: { color: '#92400e', fontStyle: 'italic' } }, "Waiting on Manager");
                    }
                    if (managerStatus === 'declined' || managerStatus === 'rejected') {
                        return React.createElement("span", { style: { color: '#991b1b', fontStyle: 'italic' } }, "N/A (Rejected)");
                    }
                    const isApproved = (item.assetStatus || '').toLowerCase().includes('approv');
                    return isApproved ? (React.createElement("span", { style: { color: '#166534', fontWeight: 600 } }, "Asset Allocated")) : (React.createElement("span", { style: { color: '#92400e', fontWeight: 600 } }, "Pending Admin Approval"));
                }
            }
        ] : []),
        ...(props.canApproveReject ? [{
                key: 'column8',
                name: 'Actions',
                fieldName: 'actions',
                minWidth: 220,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const isPending = (item.status || '').toLowerCase() === 'pending';
                    const isBusy = props.actionInProgressId === item.id;
                    if (!isPending) {
                        return React.createElement("span", { style: { color: 'var(--text-muted)' } }, "No action");
                    }
                    return (React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                        React.createElement(react_1.PrimaryButton, { text: "Approve", onClick: () => props.onApproveRequest && props.onApproveRequest(item), disabled: isBusy }),
                        React.createElement(react_1.PrimaryButton, { text: "Reject", onClick: () => {
                                if (!props.onRejectRequest) {
                                    return;
                                }
                                const rejectionReason = window.prompt('Enter rejection reason for this request:');
                                if (!rejectionReason || !rejectionReason.trim()) {
                                    return;
                                }
                                void props.onRejectRequest(item, rejectionReason.trim());
                            }, disabled: isBusy, styles: {
                                root: { backgroundColor: '#991b1b', borderColor: '#991b1b' },
                                rootHovered: { backgroundColor: '#7f1d1d', borderColor: '#7f1d1d' }
                            } })));
                }
            }] : [])
    ];
    return (React.createElement("div", { style: { marginTop: '10px' } }, props.items.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, "No asset requests found.")) : (React.createElement(DetailsList_1.DetailsList, { items: props.items, columns: columns, setKey: "set", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }))));
};
exports.RequestList = RequestList;
//# sourceMappingURL=RequestList.js.map
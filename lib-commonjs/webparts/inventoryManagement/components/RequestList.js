"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RequestList = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const react_2 = require("@fluentui/react");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const RequestStatusUtils_1 = require("../utils/RequestStatusUtils");
const RequestList = (props) => {
    const [selectedRequestForDetails, setSelectedRequestForDetails] = (0, react_1.useState)(null);
    const [isDetailsPanelOpen, setIsDetailsPanelOpen] = (0, react_1.useState)(false);
    const sortedItems = React.useMemo(() => {
        return [...props.items].sort((a, b) => {
            const dateA = a.requestDate || '';
            const dateB = b.requestDate || '';
            if (dateA && dateB && dateA !== dateB) {
                return new Date(dateB).getTime() - new Date(dateA).getTime();
            }
            const numA = parseInt((a.id || '0').replace(/\D/g, ''), 10);
            const numB = parseInt((b.id || '0').replace(/\D/g, ''), 10);
            if (!isNaN(numA) && !isNaN(numB) && numA !== numB) {
                return numB - numA;
            }
            return (b.id || '').localeCompare(a.id || '');
        });
    }, [props.items]);
    const getStatusDisplayText = RequestStatusUtils_1.getAssetRequestStatusDisplayText;
    const columns = [
        {
            key: 'columnRequestKey',
            name: strings.Columns.RequestId,
            fieldName: 'requestKey',
            minWidth: 90,
            maxWidth: 125,
            isResizable: true
        },
        {
            key: 'columnEmployeeName',
            name: strings.Columns.EmployeeName,
            fieldName: 'requesterName',
            minWidth: 100,
            maxWidth: 150,
            isResizable: true
        },
        {
            key: 'columnManagerName',
            name: strings.Columns.ManagerName,
            fieldName: 'managerName',
            minWidth: 110,
            maxWidth: 140,
            isResizable: true,
            onRender: (item) => item.managerName || strings.Common.NotAvailable
        },
        {
            key: 'columnAssetType',
            name: strings.Columns.AssetType,
            fieldName: 'assetTitle',
            minWidth: 100,
            maxWidth: 120,
            isResizable: true
        },
        {
            key: 'columnPriority',
            name: strings.Columns.Priority,
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
        ...(props.hideStatusColumn ? [] : [{
                key: 'column6',
                name: props.statusColumnLabel || strings.Columns.Status,
                fieldName: props.statusField || 'status',
                minWidth: 80,
                maxWidth: 100,
                isResizable: true,
                onRender: (item) => {
                    const val = item[props.statusField || 'status'] || 'Pending';
                    let backgroundColor = '#fef3c7'; // default pending (yellow)
                    let textColor = '#92400e';
                    let displayVal = strings.RequestList.StatusPendingManagerApproval;
                    if (val === 'Approved by Manager' || val === 'Approved') {
                        backgroundColor = '#e0f2fe';
                        textColor = '#0369a1';
                        displayVal = strings.Dropdowns.AssetRequestStatus.ApprovedByManager;
                    }
                    else if (val === 'Asset Assigned') {
                        backgroundColor = '#dcfce7';
                        textColor = '#166534';
                        displayVal = strings.Dropdowns.AssetRequestStatus.AssetAssigned;
                    }
                    else if (val === 'Rejected' || val === 'Declined') {
                        backgroundColor = '#fee2e2';
                        textColor = '#991b1b';
                        displayVal = strings.Dropdowns.AssetRequestStatus.Rejected;
                    }
                    return (React.createElement("span", { style: {
                            backgroundColor,
                            color: textColor,
                            padding: '4px 12px',
                            borderRadius: '9999px',
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            display: 'inline-block'
                        } }, displayVal));
                }
            }]),
        {
            key: 'columnManagerComment',
            name: strings.Columns.ManagerComment,
            fieldName: 'managerResponse',
            minWidth: 150,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => {
                if (!item.managerResponse)
                    return React.createElement("span", { style: { color: 'var(--text-muted)', fontStyle: 'italic' } }, "-");
                const isDeclined = item.status === 'Declined';
                return (React.createElement("span", { style: { color: isDeclined ? '#991b1b' : 'inherit', fontWeight: isDeclined ? 600 : 400 } }, item.managerResponse));
            }
        },
        ...(props.canApproveAsset ? [{
                key: 'columnAssetStatus',
                name: strings.Columns.AssetStatus,
                fieldName: 'assetStatus',
                minWidth: 200,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const value = item.assetStatus || 'Pending';
                    const isApproved = value.toLowerCase().includes('approv');
                    const isBusy = props.actionInProgressId === item.id;
                    const displayValue = isApproved ? strings.Dropdowns.AuditLogStatus.Approved : strings.Dropdowns.AuditLogStatus.Pending;
                    return (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'nowrap' } },
                        React.createElement("span", { style: {
                                backgroundColor: isApproved ? '#dcfce7' : '#fef3c7',
                                color: isApproved ? '#166534' : '#92400e',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                display: 'inline-block'
                            } }, displayValue),
                        !isApproved && (React.createElement(react_2.PrimaryButton, { text: strings.RequestList.ButtonReviewAssign, onClick: () => {
                                if (props.onSelectRequestForAssignment) {
                                    props.onSelectRequestForAssignment(item);
                                }
                                else if (props.onApproveAsset) {
                                    props.onApproveAsset(item).catch(err => console.error(err));
                                }
                            }, disabled: isBusy, styles: {
                                root: { height: '24px', minHeight: '24px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px', border: 'none' }
                            } }))));
                }
            }] : []),
        ...(props.showResponseColumns ? [
            {
                key: 'columnAdminResponse',
                name: strings.Columns.AdminResponse,
                fieldName: 'assetStatus',
                minWidth: 140,
                maxWidth: 200,
                isResizable: true,
                onRender: (item) => {
                    const managerStatus = (item.status || '').toLowerCase();
                    if (managerStatus.includes('pending')) {
                        return React.createElement("span", { style: { color: '#92400e', fontStyle: 'italic' } }, strings.RequestList.AdminResponseWaitingOnManager);
                    }
                    if (managerStatus === 'declined' || managerStatus === 'rejected') {
                        return React.createElement("span", { style: { color: '#991b1b', fontStyle: 'italic' } }, strings.RequestList.AdminResponseRejected);
                    }
                    const isApproved = (item.assetStatus || '').toLowerCase().includes('approv') || managerStatus === 'asset assigned';
                    return isApproved ? (React.createElement("span", { style: { color: '#166534', fontWeight: 600 } }, strings.RequestList.AdminResponseAllocated)) : (React.createElement("span", { style: { color: '#92400e', fontWeight: 600 } }, strings.RequestList.AdminResponsePendingApproval));
                }
            }
        ] : []),
        ...(props.canApproveReject ? [{
                key: 'column8',
                name: strings.Columns.Actions,
                fieldName: 'actions',
                minWidth: 220,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const isPending = (item.status || '').toLowerCase().includes('pending');
                    const isBusy = props.actionInProgressId === item.id;
                    if (!isPending) {
                        return React.createElement("span", { style: { color: 'var(--text-muted)' } }, strings.RequestList.NoAction);
                    }
                    return (React.createElement("div", { style: { display: 'flex', gap: '8px' } },
                        React.createElement(react_2.PrimaryButton, { text: strings.Common.Approve, onClick: () => props.onApproveRequest && props.onApproveRequest(item), disabled: isBusy }),
                        React.createElement(react_2.PrimaryButton, { text: strings.Common.Reject, onClick: () => {
                                if (!props.onRejectRequest) {
                                    return;
                                }
                                const rejectionReason = window.prompt(strings.RequestList.RejectionPrompt);
                                if (!rejectionReason || !rejectionReason.trim()) {
                                    return;
                                }
                                props.onRejectRequest(item, rejectionReason.trim()).catch(err => console.error(err));
                            }, disabled: isBusy, styles: {
                                root: { backgroundColor: '#991b1b', borderColor: '#991b1b' },
                                rootHovered: { backgroundColor: '#7f1d1d', borderColor: '#7f1d1d' }
                            } })));
                }
            }] : []),
        {
            key: 'columnViewDetails',
            name: strings.Common.Details,
            minWidth: 70,
            maxWidth: 90,
            isResizable: true,
            onRender: (item) => (React.createElement(react_2.DefaultButton, { text: strings.Common.View, onClick: () => {
                    setSelectedRequestForDetails(item);
                    setIsDetailsPanelOpen(true);
                }, styles: {
                    root: { height: '24px', minHeight: '24px', padding: '0 8px', fontSize: '0.75rem', borderRadius: '4px' }
                } }))
        }
    ];
    return (React.createElement("div", { style: { marginTop: '10px' } },
        sortedItems.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, strings.RequestList.EmptyState)) : (React.createElement("div", { className: InventoryManagement_module_scss_1.default.tableWrapper },
            React.createElement(DetailsList_1.DetailsList, { items: sortedItems, columns: columns, setKey: "set", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }))),
        selectedRequestForDetails && (React.createElement(react_2.Panel, { isOpen: isDetailsPanelOpen, onDismiss: () => {
                setIsDetailsPanelOpen(false);
                setSelectedRequestForDetails(null);
            }, type: react_2.PanelType.medium, headerText: (0, LocalizationUtils_1.formatString)(strings.RequestList.DetailsHeaderPrefix, selectedRequestForDetails.requestKey || strings.RequestList.DetailsHeaderFallback), closeButtonAriaLabel: strings.Common.Close },
            React.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '20px', fontFamily: 'inherit' } },
                React.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    React.createElement("h4", { style: { margin: '0 0 16px 0', fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main, #333333)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '10px' } }, strings.RequestList.SectionRequestInformation),
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGridGap16, style: { fontSize: '0.85rem' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestId),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.requestKey || strings.Common.NotAvailable)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.RequestList.LabelRequestDate),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.requestDate)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.WorkflowPopup.LabelRequester),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.requesterName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.RequestForm.LabelEmployeeId),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.employeeId || '-')),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.ManagerName),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.managerName || '-')),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.RequestList.LabelAssetCategory),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.assetTitle)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.RequestForm.LabelQuantity),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.quantity)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.Priority),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, selectedRequestForDetails.priority || 'Medium')))),
                selectedRequestForDetails.reason && (React.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' } }, strings.RequestList.SectionJustification),
                    React.createElement("div", { style: {
                            backgroundColor: 'rgba(128, 128, 128, 0.05)',
                            border: '1px solid rgba(128, 128, 128, 0.1)',
                            borderRadius: '6px',
                            padding: '12px',
                            fontSize: '0.85rem',
                            color: 'var(--text-main, #333333)',
                            lineHeight: 1.5
                        } }, selectedRequestForDetails.reason))),
                React.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' } }, strings.RequestList.SectionManagerApproval),
                    React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        React.createElement("span", { style: {
                                backgroundColor: (selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? '#dcfce7' : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? '#fee2e2' : '#fef3c7',
                                color: (selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? '#166534' : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? '#991b1b' : '#92400e',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.75rem',
                                fontWeight: 600
                            } }, getStatusDisplayText(selectedRequestForDetails.status)),
                        selectedRequestForDetails.managerResponse && (React.createElement("span", { style: { fontSize: '0.85rem', color: 'var(--text-muted, #666666)' } },
                            "- \u201C",
                            selectedRequestForDetails.managerResponse,
                            "\u201D")))),
                React.createElement("div", { style: {
                        backgroundColor: 'var(--surface-bg, #ffffff)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '20px',
                        boxShadow: 'var(--card-shadow)'
                    } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', marginBottom: '8px' } }, strings.RequestList.SectionAdminAllocation),
                    React.createElement("div", { style: { fontSize: '0.85rem', color: 'var(--text-main, #333333)' } }, (selectedRequestForDetails.status === 'Approved' || selectedRequestForDetails.status === 'Approved by Manager' || selectedRequestForDetails.status === 'Asset Assigned') ? (((selectedRequestForDetails.assetStatus || '').toLowerCase().includes('approv') || selectedRequestForDetails.status === 'Asset Assigned') ? (React.createElement("span", { style: { color: '#166534', fontWeight: 600 } }, strings.RequestList.AllocationAllocated)) : (React.createElement("span", { style: { color: '#92400e', fontWeight: 600 } }, strings.RequestList.AllocationPendingAdmin))) : (selectedRequestForDetails.status === 'Declined' || selectedRequestForDetails.status === 'Rejected') ? (React.createElement("span", { style: { color: '#991b1b' } }, strings.RequestList.AllocationNotApplicable)) : (React.createElement("span", { style: { color: 'var(--text-muted, #666666)', fontStyle: 'italic' } }, strings.RequestList.AllocationPendingManager)))),
                props.canApproveReject && (selectedRequestForDetails.status || '').toLowerCase().includes('pending') && (React.createElement("div", { style: {
                        display: 'flex',
                        gap: '12px',
                        marginTop: '10px',
                        borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                        paddingTop: '15px'
                    } },
                    React.createElement(react_2.PrimaryButton, { text: props.actionInProgressId === selectedRequestForDetails.id ? strings.Common.Processing : strings.Common.Approve, onClick: () => {
                            if (props.onApproveRequest) {
                                props.onApproveRequest(selectedRequestForDetails)
                                    .then(() => {
                                    setIsDetailsPanelOpen(false);
                                    setSelectedRequestForDetails(null);
                                })
                                    .catch(err => console.error(err));
                            }
                        }, disabled: props.actionInProgressId === selectedRequestForDetails.id }),
                    React.createElement(react_2.DefaultButton, { text: strings.Common.Reject, onClick: () => {
                            if (!props.onRejectRequest)
                                return;
                            const rejectionReason = window.prompt(strings.RequestList.RejectionPrompt);
                            if (!rejectionReason || !rejectionReason.trim())
                                return;
                            props.onRejectRequest(selectedRequestForDetails, rejectionReason.trim())
                                .then(() => {
                                setIsDetailsPanelOpen(false);
                                setSelectedRequestForDetails(null);
                            })
                                .catch(err => console.error(err));
                        }, disabled: props.actionInProgressId === selectedRequestForDetails.id, styles: {
                            root: { color: '#dc2626', borderColor: '#dc2626' },
                            rootHovered: { color: '#ffffff', backgroundColor: '#dc2626', borderColor: '#dc2626' }
                        } }))),
                props.canApproveAsset && !(selectedRequestForDetails.assetStatus || '').toLowerCase().includes('approv') && (React.createElement("div", { style: {
                        display: 'flex',
                        gap: '12px',
                        marginTop: '10px',
                        borderTop: '1px solid rgba(128, 128, 128, 0.15)',
                        paddingTop: '15px'
                    } },
                    React.createElement(react_2.PrimaryButton, { text: strings.RequestList.ButtonReviewAssign, onClick: () => {
                            setIsDetailsPanelOpen(false);
                            setSelectedRequestForDetails(null);
                            if (props.onSelectRequestForAssignment) {
                                props.onSelectRequestForAssignment(selectedRequestForDetails);
                            }
                        }, iconProps: { iconName: 'CompletedSolid' } }))),
                React.createElement("div", { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '10px' } },
                    React.createElement(react_2.DefaultButton, { text: strings.Common.Close, onClick: () => {
                            setIsDetailsPanelOpen(false);
                            setSelectedRequestForDetails(null);
                        } })))))));
};
exports.RequestList = RequestList;
//# sourceMappingURL=RequestList.js.map
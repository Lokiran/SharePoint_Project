import * as React from 'react';
import { useState, useMemo } from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getReturnRequestStatusDisplayText } from '../utils/RequestStatusUtils';
const conditionOptions = RETURN_CONDITION_OPTIONS;
export const ReturnRequestList = (props) => {
    const { items, isAdmin, isManager, onUpdateStatus, loading } = props;
    const [searchQuery, setSearchQuery] = useState('');
    // Dialog / State for Actions
    const [activeRequest, setActiveRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [comment, setComment] = useState('');
    const [finalCondition, setFinalCondition] = useState('Good');
    const [submitting, setSubmitting] = useState(false);
    // Search filter and role filter
    const filteredItems = useMemo(() => {
        let roleFiltered = items;
        if (isAdmin) {
            roleFiltered = items.filter(item => item.status === 'Pending Admin Verification');
        }
        else if (isManager) {
            roleFiltered = items.filter(item => item.status === 'Pending Manager Approval' || item.status === 'Pending');
        }
        const filtered = !searchQuery ? roleFiltered : roleFiltered.filter(item => (item.assetName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.serialNumber || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.requesterName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.status || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
            (item.returnReason || '').toLowerCase().includes(searchQuery.toLowerCase()));
        return filtered.sort((a, b) => {
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
    }, [items, searchQuery, isAdmin, isManager]);
    const openDialog = (request, type) => {
        setActiveRequest(request);
        setActionType(type);
        setComment('');
        setFinalCondition(request.proposedCondition || 'Good');
    };
    const closeDialog = () => {
        setActiveRequest(null);
        setActionType(null);
        setComment('');
        setSubmitting(false);
    };
    const handleAction = async () => {
        if (!activeRequest || !actionType)
            return;
        if ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) {
            alert(actionType === 'Reject' ? strings.ReturnRequestList.AlertRejectionRequired : strings.ReturnRequestList.AlertVerificationRequired);
            return;
        }
        try {
            setSubmitting(true);
            if (actionType === 'Approve') {
                await onUpdateStatus(activeRequest.id, 'Pending Admin Verification', comment || 'Approved by Manager', undefined, undefined, 'Approved', 'Not Started');
            }
            else if (actionType === 'Reject') {
                await onUpdateStatus(activeRequest.id, 'Rejected', comment, undefined, undefined, 'Rejected', 'Not Started');
            }
            else if (actionType === 'Complete') {
                await onUpdateStatus(activeRequest.id, 'Completed', activeRequest.managerComment || '', finalCondition, comment, 'Approved', 'Completed');
            }
            closeDialog();
        }
        catch (e) {
            alert(strings.ReturnRequestList.AlertActionFailedPrefix + ' ' + (e.message || JSON.stringify(e)));
        }
        finally {
            setSubmitting(false);
        }
    };
    const getStatusDisplayText = getReturnRequestStatusDisplayText;
    const getStatusStyles = (status) => {
        switch (status) {
            case 'Pending':
            case 'Pending Manager Approval':
                return { bg: '#ffedd5', fg: '#9a3412' }; // Light orange
            case 'Approved':
            case 'Pending Admin Verification':
                return { bg: '#dbeafe', fg: '#1e40af' }; // Light blue
            case 'Rejected':
                return { bg: '#fee2e2', fg: '#991b1b' }; // Light red
            case 'Completed':
                return { bg: '#dcfce7', fg: '#166534' }; // Light green
            default:
                return { bg: '#f3f4f6', fg: '#374151' };
        }
    };
    const columns = [
        { key: 'id', name: strings.ReturnRequestList.ColId, fieldName: 'id', minWidth: 50, maxWidth: 80, isResizable: true, onRender: (item) => item.id.replace('RR-', '#') },
        { key: 'assetName', name: strings.Columns.AssetName, fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
        { key: 'serialNumber', name: strings.Columns.SerialNumber, fieldName: 'serialNumber', minWidth: 90, maxWidth: 120, isResizable: true },
        { key: 'requesterName', name: strings.ReturnRequestList.ColEmployee, fieldName: 'requesterName', minWidth: 100, maxWidth: 130, isResizable: true },
        { key: 'returnReason', name: strings.ReturnRequestList.ColReason, fieldName: 'returnReason', minWidth: 150, maxWidth: 220, isResizable: true, isMultiline: true },
        { key: 'proposedCondition', name: strings.Columns.Condition, fieldName: 'proposedCondition', minWidth: 80, maxWidth: 110, isResizable: true },
        {
            key: 'status',
            name: strings.Columns.Status,
            fieldName: 'status',
            minWidth: 90,
            maxWidth: 110,
            isResizable: true,
            onRender: (item) => {
                const { bg, fg } = getStatusStyles(item.status);
                return (React.createElement("span", { style: {
                        backgroundColor: bg,
                        color: fg,
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block'
                    } }, getStatusDisplayText(item.status)));
            }
        },
        { key: 'requestDate', name: strings.Columns.RequestedDate, fieldName: 'requestDate', minWidth: 90, maxWidth: 120, isResizable: true },
        {
            key: 'managerComment',
            name: strings.Columns.ManagerNotes,
            fieldName: 'managerComment',
            minWidth: 120,
            maxWidth: 200,
            isResizable: true,
            onRender: (item) => item.managerComment || React.createElement("span", { style: { color: '#9ca3af', fontStyle: 'italic' } }, strings.ReturnRequestList.None)
        },
        // Actions Column (Visible to managers/admins)
        ...((isManager || isAdmin) ? [
            {
                key: 'actions',
                name: strings.Columns.Actions,
                minWidth: 200,
                maxWidth: 260,
                isResizable: true,
                onRender: (item) => {
                    const viewButton = (React.createElement(DefaultButton, { text: strings.Common.View, onClick: () => openDialog(item, 'View'), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.75rem' } } }));
                    if (isManager && (item.status === 'Pending Manager Approval' || item.status === 'Pending')) {
                        return (React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 6 } },
                            viewButton,
                            React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonApprove, onClick: () => openDialog(item, 'Approve'), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.75rem' } } }),
                            React.createElement(DefaultButton, { text: strings.ReturnRequestList.ButtonReject, onClick: () => openDialog(item, 'Reject'), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.75rem', color: '#b91c1c', borderColor: '#fee2e2' } } })));
                    }
                    if (isAdmin && item.status === 'Pending Admin Verification') {
                        return (React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 6 } },
                            viewButton,
                            React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonVerifyComplete, onClick: () => openDialog(item, 'Complete'), styles: { root: { height: 26, padding: '4px 8px', fontSize: '0.75rem', backgroundColor: '#107c41', borderColor: '#107c41' } } })));
                    }
                    return (React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 6 }, verticalAlign: "center" }, viewButton));
                }
            }
        ] : [])
    ];
    return (React.createElement("div", { style: { marginTop: '10px' } },
        React.createElement("div", { style: { marginBottom: '15px' } },
            React.createElement(SearchBox, { placeholder: strings.ReturnRequestList.SearchPlaceholder, value: searchQuery, onChange: (_, val) => setSearchQuery(val || ''), styles: { root: { maxWidth: 350 } } })),
        loading ? (React.createElement("p", null, strings.ReturnRequestList.LoadingReturnRequests)) : filteredItems.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: '#6b7280' } }, strings.ReturnRequestList.EmptyState)) : (React.createElement("div", { className: styles.tableWrapper },
            React.createElement(DetailsList, { items: filteredItems, columns: columns, setKey: "returnSet", layoutMode: DetailsListLayoutMode.justified, selectionMode: SelectionMode.none }))),
        React.createElement(Dialog, { hidden: !activeRequest, onDismiss: closeDialog, dialogContentProps: {
                type: DialogType.normal,
                title: actionType === 'Approve' ? strings.ReturnRequestList.DialogTitleApprove :
                    actionType === 'Reject' ? strings.ReturnRequestList.DialogTitleReject :
                        actionType === 'Complete' ? strings.ReturnRequestList.DialogTitleComplete : strings.ReturnRequestList.DialogTitleView,
                subText: activeRequest ? formatString(strings.ReturnRequestList.DialogSubtext, activeRequest.requesterName, activeRequest.assetName) : ''
            }, modalProps: { isBlocking: true } },
            React.createElement(Stack, { tokens: { childrenGap: 15 }, style: { marginTop: '15px' } },
                activeRequest && (React.createElement("div", { style: {
                        backgroundColor: 'rgba(128, 128, 128, 0.05)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                    } },
                    React.createElement("h4", { style: { margin: '0 0 12px 0', fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '6px' } }, strings.ReturnRequestList.CardTitle),
                    React.createElement("div", { className: styles.responsiveGrid, style: { gap: '12px 16px' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestId),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.id.replace('RR-', '#'))),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestedDate),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.requestDate)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.AssetName),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.assetName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.SerialNumber),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.serialNumber || strings.Common.NotAvailable)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.ColEmployee),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.requesterName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.LabelProposedCondition),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.proposedCondition)),
                        React.createElement("div", { style: { gridColumn: 'span 2' } },
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.LabelReturnReason),
                            React.createElement("div", { style: {
                                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    fontWeight: 500,
                                    color: 'var(--text-main, #333333)'
                                } }, activeRequest.returnReason)),
                        activeRequest.managerComment && (React.createElement("div", { style: { gridColumn: 'span 2' } },
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.ManagerNotes),
                            React.createElement("div", { style: {
                                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    fontWeight: 500,
                                    color: 'var(--text-main, #333333)'
                                } }, activeRequest.managerComment)))))),
                actionType === 'Complete' && (React.createElement(Dropdown, { label: strings.ReturnRequestList.LabelFinalCondition, selectedKey: finalCondition, options: conditionOptions, onChange: (_, opt) => setFinalCondition(opt ? opt.key : 'Good') })),
                actionType !== 'View' && (React.createElement(TextField, { label: actionType === 'Reject' ? strings.ReturnRequestList.LabelRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.LabelVerificationComments :
                            strings.ReturnRequestList.LabelManagerComments, placeholder: actionType === 'Reject' ? strings.ReturnRequestList.PlaceholderRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.PlaceholderVerificationComments :
                            strings.ReturnRequestList.PlaceholderManagerComments, multiline: true, rows: 3, value: comment, onChange: (_, val) => setComment(val || ''), required: actionType === 'Reject' || actionType === 'Complete' }))),
            React.createElement(DialogFooter, null, actionType !== 'View' ? (React.createElement(React.Fragment, null,
                React.createElement(PrimaryButton, { text: actionType === 'Approve' ? strings.ReturnRequestList.ButtonApprove :
                        actionType === 'Reject' ? strings.ReturnRequestList.ButtonReject : strings.ReturnRequestList.ButtonVerifyComplete, onClick: handleAction, disabled: submitting || ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) }),
                React.createElement(DefaultButton, { text: strings.Common.Cancel, onClick: closeDialog, disabled: submitting }))) : (React.createElement(PrimaryButton, { text: strings.Common.Close, onClick: closeDialog }))))));
};
//# sourceMappingURL=ReturnRequestList.js.map
import * as React from 'react';
import { useState, useMemo } from 'react';
import { Stack, Text, TextField, Dropdown, Icon, DefaultButton, Panel, PanelType } from '@fluentui/react';
import styles from './InventoryManagement.module.scss';
export const MyRequestsView = (props) => {
    const { requests } = props;
    // Search and Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('All');
    const [selectedPriority, setSelectedPriority] = useState('All');
    // Detail Panel State
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);
    // Dynamic metrics derived from all requests
    const metrics = useMemo(() => {
        let pendingCount = 0;
        let approvedCount = 0;
        let declinedCount = 0;
        requests.forEach(r => {
            const status = r.status || 'Pending';
            if (status === 'Pending')
                pendingCount++;
            else if (status === 'Approved')
                approvedCount++;
            else if (status === 'Declined')
                declinedCount++;
        });
        return {
            total: requests.length,
            pending: pendingCount,
            approved: approvedCount,
            declined: declinedCount
        };
    }, [requests]);
    // Filtering Logic
    const filteredRequests = useMemo(() => {
        return requests.filter(r => {
            // 1. Search filter
            const normQuery = searchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (r.requestKey || '').toLowerCase().includes(normQuery) ||
                (r.assetTitle || '').toLowerCase().includes(normQuery) ||
                (r.reason || '').toLowerCase().includes(normQuery) ||
                (r.id || '').toLowerCase().includes(normQuery);
            // 2. Status filter
            const matchesStatus = selectedStatus === 'All' || (r.status || 'Pending') === selectedStatus;
            // 3. Priority filter
            const matchesPriority = selectedPriority === 'All' || (r.priority || 'Medium') === selectedPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [requests, searchQuery, selectedStatus, selectedPriority]);
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' } },
        React.createElement("div", { style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '24px',
                padding: '0 4px 16px 4px',
                borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
            } },
            React.createElement("div", { style: { flex: '1 1 auto', minWidth: '110px' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Total Requests"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, metrics.total)),
            React.createElement("div", { style: { width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' } }),
            React.createElement("div", { style: { flex: '1 1 auto', minWidth: '110px' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Pending Approval"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.pending > 0 ? '#d97706' : 'var(--text-muted)' } }, metrics.pending)),
            React.createElement("div", { style: { width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' } }),
            React.createElement("div", { style: { flex: '1 1 auto', minWidth: '110px' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Approved"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, metrics.approved)),
            React.createElement("div", { style: { width: '1px', backgroundColor: '#e2e8f0', alignSelf: 'stretch' } }),
            React.createElement("div", { style: { flex: '1 1 auto', minWidth: '110px' } },
                React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Declined"),
                React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.declined > 0 ? '#dc2626' : 'var(--text-muted)' } }, metrics.declined))),
        React.createElement("div", { style: {
                display: 'flex',
                flexWrap: 'wrap',
                gap: '12px',
                alignItems: 'flex-end',
                padding: '0 0 10px 0'
            } },
            React.createElement("div", { style: { flex: '1 1 200px' } },
                React.createElement(TextField, { placeholder: "Search by Request ID, asset type, reason...", value: searchQuery, onChange: (e, val) => setSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
            React.createElement("div", { style: { width: '130px' } },
                React.createElement(Dropdown, { options: [
                        { key: 'All', text: 'All Statuses' },
                        { key: 'Pending', text: 'Pending' },
                        { key: 'Approved', text: 'Approved' },
                        { key: 'Declined', text: 'Declined' }
                    ], selectedKey: selectedStatus, onChange: (e, option) => setSelectedStatus(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            React.createElement("div", { style: { width: '130px' } },
                React.createElement(Dropdown, { options: [
                        { key: 'All', text: 'All Priorities' },
                        { key: 'Low', text: 'Low' },
                        { key: 'Medium', text: 'Medium' },
                        { key: 'High', text: 'High' }
                    ], selectedKey: selectedPriority, onChange: (e, option) => setSelectedPriority(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
            React.createElement("div", null,
                React.createElement(DefaultButton, { text: "Reset", iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                        setSearchQuery('');
                        setSelectedStatus('All');
                        setSelectedPriority('All');
                    }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
        filteredRequests.length > 0 ? (React.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '16px',
                marginTop: '10px'
            } }, filteredRequests.map(item => {
            const status = item.status || 'Pending';
            const priority = item.priority || 'Medium';
            // Status Badge Colors
            let statusBg = '#fef7e0'; // Pending
            let statusText = '#b06000';
            if (status === 'Approved') {
                statusBg = '#e6f4ea';
                statusText = '#137333';
            }
            else if (status === 'Declined') {
                statusBg = '#fce8e6';
                statusText = '#c5221f';
            }
            // Priority Colors
            let priorityColor = '#5f6368';
            let priorityBg = '#f1f3f4';
            if (priority === 'High') {
                priorityColor = '#c5221f';
                priorityBg = '#fce8e6';
            }
            else if (priority === 'Low') {
                priorityColor = '#1a73e8';
                priorityBg = '#e8f0fe';
            }
            // Admin Allocation Status Text
            let adminAllocationText = '';
            let adminAllocationColor = 'var(--text-muted)';
            const managerStatusLower = status.toLowerCase();
            if (managerStatusLower === 'pending') {
                adminAllocationText = 'Waiting on Manager';
                adminAllocationColor = '#b06000';
            }
            else if (managerStatusLower === 'declined') {
                adminAllocationText = 'N/A (Rejected)';
                adminAllocationColor = '#c5221f';
            }
            else {
                const isAllocated = (item.assetStatus || '').toLowerCase().includes('approv');
                if (isAllocated) {
                    adminAllocationText = 'Asset Allocated ✓';
                    adminAllocationColor = '#137333';
                }
                else {
                    adminAllocationText = 'Pending Admin Allocation';
                    adminAllocationColor = '#b06000';
                }
            }
            return (React.createElement("div", { key: item.id, style: {
                    backgroundColor: 'var(--surface-bg)',
                    borderRadius: '6px',
                    border: '1px solid rgba(0, 0, 0, 0.08)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden'
                }, className: styles.assetCardHover },
                React.createElement("div", { style: {
                        padding: '14px 14px 6px 14px',
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between'
                    } },
                    React.createElement("div", null,
                        React.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.requestKey || `REQ-${item.id.substring(0, 6)}`),
                        React.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                            "Requested: ",
                            item.requestDate)),
                    React.createElement("span", { style: {
                            backgroundColor: statusBg,
                            color: statusText,
                            padding: '2px 8px',
                            borderRadius: '4px',
                            fontSize: '0.68rem',
                            fontWeight: 600
                        } }, status)),
                React.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                    React.createElement("div", { style: { fontSize: '0.82rem', color: 'var(--text-main)' } },
                        "Asset: ",
                        React.createElement("strong", null, item.assetTitle),
                        " (Qty: ",
                        item.quantity,
                        ")"),
                    item.reason && (React.createElement("p", { style: {
                            margin: '0 0 2px 0',
                            fontSize: '0.78rem',
                            color: 'var(--text-muted)',
                            lineHeight: '1.4',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            height: '32px'
                        } },
                        "Reason: ",
                        item.reason)),
                    React.createElement("div", { style: {
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: '0.75rem',
                            borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                            paddingTop: '6px',
                            marginTop: 'auto'
                        } },
                        React.createElement("span", { style: { color: adminAllocationColor, fontWeight: 500 } }, adminAllocationText),
                        React.createElement("span", { style: {
                                backgroundColor: priorityBg,
                                color: priorityColor,
                                padding: '2px 6px',
                                borderRadius: '3px',
                                fontSize: '0.68rem',
                                fontWeight: 500
                            } }, priority))),
                React.createElement("div", { style: {
                        padding: '8px 14px 10px 14px',
                        display: 'flex',
                        gap: '6px',
                        borderTop: '1px solid rgba(0, 0, 0, 0.04)',
                        alignItems: 'center'
                    } },
                    React.createElement(DefaultButton, { text: "View Details", onClick: () => {
                            setSelectedRequest(item);
                            setIsPanelOpen(true);
                        }, style: { height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' } }))));
        }))) : (React.createElement("div", { style: {
                textAlign: 'center',
                padding: '30px 10px',
                backgroundColor: 'var(--surface-bg)',
                borderRadius: '6px',
                border: '1px solid rgba(0, 0, 0, 0.08)'
            } },
            React.createElement(Icon, { iconName: "DatabaseNoData", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
            React.createElement(Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, "No Asset Requests Found"),
            React.createElement(Text, { variant: "small", style: { color: 'var(--text-muted)' } }, "Try adjusting your search query or filters."))),
        selectedRequest && (React.createElement(Panel, { isOpen: isPanelOpen, onDismiss: () => {
                setIsPanelOpen(false);
                setSelectedRequest(null);
            }, type: PanelType.medium, headerText: `Request Details: ${selectedRequest.requestKey || 'Asset Request'}`, closeButtonAriaLabel: "Close" },
            React.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                React.createElement("div", { style: {
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '12px',
                        backgroundColor: '#f1f5f9',
                        padding: '15px',
                        borderRadius: '8px',
                        fontSize: '0.88rem'
                    } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Request ID:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.requestKey || 'N/A')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Date Requested:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.requestDate)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Requester:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.requesterName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Employee ID:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.employeeId || '-')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Type:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.assetTitle)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Quantity:"),
                        " ",
                        React.createElement("strong", null, selectedRequest.quantity))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Reason for Request"),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.reason || 'No reason provided.')),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Manager Approval Status"),
                    React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        React.createElement("span", { style: {
                                backgroundColor: selectedRequest.status === 'Approved' ? '#e6f4ea' : selectedRequest.status === 'Declined' ? '#fce8e6' : '#fef7e0',
                                color: selectedRequest.status === 'Approved' ? '#137333' : selectedRequest.status === 'Declined' ? '#c5221f' : '#b06000',
                                padding: '2px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                fontWeight: 600
                            } }, selectedRequest.status || 'Pending'),
                        selectedRequest.managerResponse && (React.createElement("span", { style: { fontSize: '0.85rem', color: '#475569' } },
                            "- \u201C",
                            selectedRequest.managerResponse,
                            "\u201D")))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Admin Allocation Status"),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.status === 'Approved' ? ((selectedRequest.assetStatus || '').toLowerCase().includes('approv') ? (React.createElement("span", { style: { color: '#137333', fontWeight: 600 } }, "Asset Allocated & Dispatched \u2713")) : (React.createElement("span", { style: { color: '#b06000', fontWeight: 600 } }, "Pending physical asset allocation by system administrator"))) : selectedRequest.status === 'Declined' ? (React.createElement("span", { style: { color: '#c5221f' } }, "Not applicable (Request was rejected by manager)")) : (React.createElement("span", { style: { color: '#64748b', fontStyle: 'italic' } }, "Pending manager approval first")))),
                React.createElement(Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    React.createElement(DefaultButton, { text: "Close", onClick: () => {
                            setIsPanelOpen(false);
                            setSelectedRequest(null);
                        } })))))));
};
//# sourceMappingURL=MyRequestsView.js.map
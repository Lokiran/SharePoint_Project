"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MyRequestsView = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const react_2 = require("@fluentui/react");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const DropdownConstants_1 = require("../constants/DropdownConstants");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const RequestStatusUtils_1 = require("../utils/RequestStatusUtils");
const MyRequestsView = (props) => {
    const { requests, returnRequests = [] } = props;
    // Search and Filter States (Asset Requests)
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [selectedStatus, setSelectedStatus] = (0, react_1.useState)('All');
    const [selectedPriority, setSelectedPriority] = (0, react_1.useState)('All');
    // Search and Filter States (Return Requests)
    const [returnSearchQuery, setReturnSearchQuery] = (0, react_1.useState)('');
    const [returnSelectedStatus, setReturnSelectedStatus] = (0, react_1.useState)('All');
    // Detail Panel State
    const [selectedRequest, setSelectedRequest] = (0, react_1.useState)(null);
    const [isPanelOpen, setIsPanelOpen] = (0, react_1.useState)(false);
    // Return Request Detail Panel State
    const [selectedReturnRequest, setSelectedReturnRequest] = (0, react_1.useState)(null);
    const [isReturnPanelOpen, setIsReturnPanelOpen] = (0, react_1.useState)(false);
    // Dynamic metrics derived from all requests
    const metrics = (0, react_1.useMemo)(() => {
        let pendingCount = 0;
        let approvedCount = 0;
        let declinedCount = 0;
        requests.forEach(r => {
            const status = r.status || 'Pending Manager Approval';
            if (status === 'Pending Manager Approval' || status === 'Pending')
                pendingCount++;
            else if (status === 'Approved by Manager' || status === 'Asset Assigned' || status === 'Approved')
                approvedCount++;
            else if (status === 'Rejected' || status === 'Declined')
                declinedCount++;
        });
        return {
            total: requests.length,
            pending: pendingCount,
            approved: approvedCount,
            declined: declinedCount
        };
    }, [requests]);
    // Return Request metrics
    const returnMetrics = (0, react_1.useMemo)(() => {
        let pendingCount = 0;
        let approvedCount = 0;
        let rejectedCount = 0;
        let completedCount = 0;
        returnRequests.forEach(r => {
            const status = r.status || 'Pending';
            if (status === 'Pending' || status === 'Pending Manager Approval')
                pendingCount++;
            else if (status === 'Approved' || status === 'Pending Admin Verification')
                approvedCount++;
            else if (status === 'Rejected')
                rejectedCount++;
            else if (status === 'Completed')
                completedCount++;
        });
        return {
            total: returnRequests.length,
            pending: pendingCount,
            approved: approvedCount,
            rejected: rejectedCount,
            completed: completedCount
        };
    }, [returnRequests]);
    // Filtering Logic (Asset Requests - New to Old)
    const filteredRequests = (0, react_1.useMemo)(() => {
        const filtered = requests.filter(r => {
            const normQuery = searchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (r.requestKey || '').toLowerCase().includes(normQuery) ||
                (r.assetTitle || '').toLowerCase().includes(normQuery) ||
                (r.reason || '').toLowerCase().includes(normQuery) ||
                (r.managerName || '').toLowerCase().includes(normQuery) ||
                (r.id || '').toLowerCase().includes(normQuery);
            let rStatus = r.status || 'Pending Manager Approval';
            if (rStatus === 'Pending')
                rStatus = 'Pending Manager Approval';
            else if (rStatus === 'Approved')
                rStatus = 'Approved by Manager';
            else if (rStatus === 'Declined')
                rStatus = 'Rejected';
            const matchesStatus = selectedStatus === 'All' || rStatus === selectedStatus;
            const matchesPriority = selectedPriority === 'All' || (r.priority || 'Medium') === selectedPriority;
            return matchesSearch && matchesStatus && matchesPriority;
        });
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
    }, [requests, searchQuery, selectedStatus, selectedPriority]);
    // Filtering Logic (Return Requests - New to Old)
    const filteredReturnRequests = (0, react_1.useMemo)(() => {
        const filtered = returnRequests.filter(r => {
            const normQuery = returnSearchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (r.assetName || '').toLowerCase().includes(normQuery) ||
                (r.serialNumber || '').toLowerCase().includes(normQuery) ||
                (r.returnReason || '').toLowerCase().includes(normQuery) ||
                (r.id || '').toLowerCase().includes(normQuery);
            const matchesStatus = returnSelectedStatus === 'All' ||
                r.status === returnSelectedStatus ||
                (returnSelectedStatus === 'Pending' && (r.status === 'Pending Manager Approval' || r.status === 'Pending')) ||
                (returnSelectedStatus === 'Approved' && (r.status === 'Pending Admin Verification' || r.status === 'Approved'));
            return matchesSearch && matchesStatus;
        });
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
    }, [returnRequests, returnSearchQuery, returnSelectedStatus]);
    // Return status badge styles
    const getReturnStatusStyle = (status) => {
        switch (status) {
            case 'Pending':
            case 'Pending Manager Approval':
                return { bg: '#fff8e6', color: '#b06000' };
            case 'Approved':
            case 'Pending Admin Verification':
                return { bg: '#e8f0fe', color: '#1558d6' };
            case 'Rejected': return { bg: '#fce8e6', color: '#c5221f' };
            case 'Completed': return { bg: '#e6f4ea', color: '#137333' };
            default: return { bg: '#f1f3f4', color: '#5f6368' };
        }
    };
    const getReturnStatusIcon = (status) => {
        switch (status) {
            case 'Pending':
            case 'Pending Manager Approval':
                return 'Clock';
            case 'Approved':
            case 'Pending Admin Verification':
                return 'CompletedSolid';
            case 'Rejected': return 'ErrorBadge';
            case 'Completed': return 'CheckMark';
            default: return 'Info';
        }
    };
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' } },
        React.createElement(react_2.Pivot, { "aria-label": strings.MyRequests.PivotAriaLabel },
            React.createElement(react_2.PivotItem, { headerText: strings.MyRequests.TabAssetRequests, itemIcon: "Send", itemCount: metrics.total },
                React.createElement("div", { style: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricsRow },
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricTotalRequests),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, metrics.total)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricPendingApproval),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.pending > 0 ? '#d97706' : 'var(--text-muted)' } }, metrics.pending)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricApproved),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, metrics.approved)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricDeclined),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.declined > 0 ? '#dc2626' : 'var(--text-muted)' } }, metrics.declined))),
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.filtersRow },
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.searchField },
                            React.createElement(react_2.TextField, { placeholder: strings.MyRequests.SearchAssetRequestsPlaceholder, value: searchQuery, onChange: (e, val) => setSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.filterDropdown },
                            React.createElement(react_2.Dropdown, { options: [
                                    { key: 'All', text: strings.Dropdowns.AuditLogStatus.All },
                                    ...DropdownConstants_1.ASSET_REQUEST_STATUS_OPTIONS
                                ], selectedKey: selectedStatus, onChange: (e, option) => setSelectedStatus(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.filterDropdown },
                            React.createElement(react_2.Dropdown, { options: [
                                    { key: 'All', text: strings.MyRequests.AllPrioritiesOption },
                                    ...DropdownConstants_1.ASSET_REQUEST_PRIORITY_OPTIONS
                                ], selectedKey: selectedPriority, onChange: (e, option) => setSelectedPriority(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        React.createElement("div", null,
                            React.createElement(react_2.DefaultButton, { text: strings.Common.Reset, iconProps: { iconName: 'ClearFilter' }, onClick: () => {
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
                        const displayStatus = (0, RequestStatusUtils_1.getAssetRequestStatusDisplayText)(status);
                        let statusBg = '#fef7e0';
                        let statusText = '#b06000';
                        if (status === 'Approved by Manager' || status === 'Approved') {
                            statusBg = '#e0f2fe';
                            statusText = '#0369a1';
                        }
                        else if (status === 'Asset Assigned') {
                            statusBg = '#e6f4ea';
                            statusText = '#137333';
                        }
                        else if (status === 'Rejected' || status === 'Declined') {
                            statusBg = '#fce8e6';
                            statusText = '#c5221f';
                        }
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
                        let adminAllocationText = '';
                        let adminAllocationColor = 'var(--text-muted)';
                        const managerStatusLower = status.toLowerCase();
                        if (managerStatusLower.includes('pending')) {
                            adminAllocationText = strings.MyRequests.WaitingOnManager;
                            adminAllocationColor = '#b06000';
                        }
                        else if (managerStatusLower === 'declined' || managerStatusLower === 'rejected') {
                            adminAllocationText = strings.MyRequests.NotApplicableRejected;
                            adminAllocationColor = '#c5221f';
                        }
                        else {
                            const isAllocated = (item.assetStatus || '').toLowerCase().includes('approv');
                            if (isAllocated) {
                                adminAllocationText = strings.MyRequests.AssetAllocatedCheck;
                                adminAllocationColor = '#137333';
                            }
                            else {
                                adminAllocationText = strings.MyRequests.PendingAdminAllocation;
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
                            }, className: InventoryManagement_module_scss_1.default.assetCardHover },
                            React.createElement("div", { style: { padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
                                React.createElement("div", null,
                                    React.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.requestKey || `REQ-${item.id.substring(0, 6)}`),
                                    React.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, (0, LocalizationUtils_1.formatString)(strings.MyRequests.RequestedPrefix, item.requestDate))),
                                React.createElement("span", { style: { backgroundColor: statusBg, color: statusText, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 } }, displayStatus)),
                            React.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                                React.createElement("div", { style: { fontSize: '0.82rem', color: 'var(--text-main)' } },
                                    strings.WorkflowPopup.LabelAsset,
                                    ": ",
                                    React.createElement("strong", null, item.assetTitle),
                                    " (",
                                    strings.MyRequests.QtyLabel,
                                    ": ",
                                    item.quantity,
                                    ")"),
                                item.managerName && (React.createElement("div", { style: { fontSize: '0.78rem', color: 'var(--text-muted)' } },
                                    strings.MyRequests.ManagerLabel,
                                    " ",
                                    React.createElement("strong", { style: { color: 'var(--text-main)' } }, item.managerName))),
                                item.reason && (React.createElement("p", { style: { margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' } }, (0, LocalizationUtils_1.formatString)(strings.MyRequests.ReasonPrefix, item.reason))),
                                item.managerResponse && (React.createElement("div", { style: {
                                        backgroundColor: status === 'Declined' ? '#fef2f2' : '#f8fafc',
                                        borderRadius: '4px',
                                        padding: '4px 8px',
                                        borderLeft: `3px solid ${status === 'Declined' ? '#dc2626' : '#16a34a'}`,
                                        fontSize: '0.75rem',
                                        color: status === 'Declined' ? '#991b1b' : 'var(--text-main)'
                                    } },
                                    React.createElement("strong", null, strings.MyRequests.ManagerNoteLabel),
                                    " ",
                                    item.managerResponse)),
                                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px', marginTop: 'auto' } },
                                    React.createElement("span", { style: { color: adminAllocationColor, fontWeight: 500 } }, adminAllocationText),
                                    React.createElement("span", { style: { backgroundColor: priorityBg, color: priorityColor, padding: '2px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 500 } }, priority))),
                            React.createElement("div", { style: { padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' } },
                                React.createElement(react_2.DefaultButton, { text: strings.Common.ViewDetails, onClick: () => { setSelectedRequest(item); setIsPanelOpen(true); }, style: { height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' } }))));
                    }))) : (React.createElement("div", { style: { textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' } },
                        React.createElement(react_2.Icon, { iconName: "DatabaseNoData", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
                        React.createElement(react_2.Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, strings.MyRequests.EmptyAssetRequestsTitle),
                        React.createElement(react_2.Text, { variant: "small", style: { color: 'var(--text-muted)' } }, strings.MyRequests.EmptyFilterHint))))),
            React.createElement(react_2.PivotItem, { headerText: strings.MyRequests.TabReturnRequests, itemIcon: "ReturnToSession", itemCount: returnMetrics.total },
                React.createElement("div", { style: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricsRow },
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem, style: { minWidth: '90px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricTotal),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, returnMetrics.total)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem, style: { minWidth: '90px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricPending),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.pending > 0 ? '#d97706' : 'var(--text-muted)' } }, returnMetrics.pending)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem, style: { minWidth: '90px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricApproved),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#1558d6' } }, returnMetrics.approved)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem, style: { minWidth: '90px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricCompleted),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, returnMetrics.completed)),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricDivider }),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.metricItem, style: { minWidth: '90px' } },
                            React.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, strings.MyRequests.MetricRejected),
                            React.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.rejected > 0 ? '#dc2626' : 'var(--text-muted)' } }, returnMetrics.rejected))),
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.filtersRow },
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.searchField },
                            React.createElement(react_2.TextField, { placeholder: strings.MyRequests.SearchReturnRequestsPlaceholder, value: returnSearchQuery, onChange: (e, val) => setReturnSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
                        React.createElement("div", { className: InventoryManagement_module_scss_1.default.filterDropdown, style: { width: '150px' } },
                            React.createElement(react_2.Dropdown, { options: [
                                    { key: 'All', text: strings.Dropdowns.AuditLogStatus.All },
                                    ...DropdownConstants_1.RETURN_REQUEST_STATUS_OPTIONS
                                ], selectedKey: returnSelectedStatus, onChange: (e, option) => setReturnSelectedStatus(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        React.createElement("div", null,
                            React.createElement(react_2.DefaultButton, { text: strings.Common.Reset, iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                                    setReturnSearchQuery('');
                                    setReturnSelectedStatus('All');
                                }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
                    filteredReturnRequests.length > 0 ? (React.createElement("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '16px',
                            marginTop: '10px'
                        } }, filteredReturnRequests.map(item => {
                        const { bg: statusBg, color: statusColor } = getReturnStatusStyle(item.status);
                        const statusIcon = getReturnStatusIcon(item.status);
                        const displayReturnStatus = (0, RequestStatusUtils_1.getReturnRequestStatusDisplayText)(item.status);
                        // Condition badge
                        let condBg = '#e6f4ea';
                        let condColor = '#137333';
                        const cond = (item.proposedCondition || '').toLowerCase();
                        if (cond === 'fair') {
                            condBg = '#fff8e6';
                            condColor = '#b06000';
                        }
                        else if (cond === 'poor') {
                            condBg = '#ffe8d6';
                            condColor = '#a63e00';
                        }
                        else if (cond === 'damaged') {
                            condBg = '#fce8e6';
                            condColor = '#c5221f';
                        }
                        return (React.createElement("div", { key: item.id, style: {
                                backgroundColor: 'var(--surface-bg)',
                                borderRadius: '6px',
                                border: `1px solid ${item.status === 'Rejected' ? 'rgba(197, 34, 31, 0.15)' : item.status === 'Completed' ? 'rgba(19, 115, 51, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden'
                            }, className: InventoryManagement_module_scss_1.default.assetCardHover },
                            React.createElement("div", { style: { padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
                                React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } },
                                    React.createElement(react_2.Icon, { iconName: "ReturnToSession", style: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' } }),
                                    React.createElement("div", null,
                                        React.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.assetName),
                                        React.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } }, (0, LocalizationUtils_1.formatString)(strings.MyRequests.SubmittedPrefix, item.serialNumber || strings.Common.NotAvailable, item.requestDate)))),
                                React.createElement("span", { style: { backgroundColor: statusBg, color: statusColor, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' } },
                                    React.createElement(react_2.Icon, { iconName: statusIcon, style: { fontSize: '10px' } }),
                                    displayReturnStatus)),
                            React.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                                item.returnReason && (React.createElement("p", { style: { margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' } }, (0, LocalizationUtils_1.formatString)(strings.MyRequests.ReasonPrefix, item.returnReason))),
                                React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px' } },
                                    React.createElement("span", null,
                                        strings.ReturnRequestList.LabelProposedCondition,
                                        ": ",
                                        React.createElement("span", { style: { backgroundColor: condBg, color: condColor, padding: '1px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 600 } }, item.proposedCondition || strings.Common.NotAvailable)),
                                    item.completedDate && (React.createElement("span", { style: { color: '#16a34a', fontSize: '0.7rem' } },
                                        "\u2713 ",
                                        item.completedDate))),
                                item.managerComment && (React.createElement("div", { style: {
                                        backgroundColor: item.status === 'Rejected' ? '#fef2f2' : item.status === 'Completed' ? '#f0fdf4' : '#f8fafc',
                                        borderRadius: '4px',
                                        padding: '6px 8px',
                                        borderLeft: `3px solid ${item.status === 'Rejected' ? '#dc2626' : item.status === 'Completed' ? '#16a34a' : '#94a3b8'}`,
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)'
                                    } },
                                    React.createElement("strong", { style: { display: 'block', marginBottom: '2px', color: 'var(--text-main)' } }, strings.MyRequests.ManagerNotesLabel),
                                    item.managerComment)),
                                item.status === 'Pending' && (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#b06000' } },
                                    React.createElement(react_2.Icon, { iconName: "Clock", style: { fontSize: '10px' } }),
                                    React.createElement("span", null, strings.MyRequests.AwaitingManagerReview))),
                                item.status === 'Approved' && (React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#1558d6' } },
                                    React.createElement(react_2.Icon, { iconName: "Info", style: { fontSize: '10px' } }),
                                    React.createElement("span", null, strings.MyRequests.HandoverToItTeam)))),
                            React.createElement("div", { style: { padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' } },
                                React.createElement(react_2.DefaultButton, { text: strings.Common.ViewDetails, onClick: () => { setSelectedReturnRequest(item); setIsReturnPanelOpen(true); }, style: { height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' } }))));
                    }))) : (React.createElement("div", { style: { textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' } },
                        React.createElement(react_2.Icon, { iconName: "ReturnToSession", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
                        React.createElement(react_2.Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, strings.MyRequests.EmptyReturnRequestsTitle),
                        React.createElement(react_2.Text, { variant: "small", style: { color: 'var(--text-muted)' } }, returnRequests.length === 0
                            ? strings.MyRequests.EmptyReturnRequestsHint
                            : strings.MyRequests.EmptyFilterHint)))))),
        selectedRequest && (React.createElement(react_2.Panel, { isOpen: isPanelOpen, onDismiss: () => { setIsPanelOpen(false); setSelectedRequest(null); }, type: react_2.PanelType.medium, headerText: (0, LocalizationUtils_1.formatString)(strings.MyRequests.DetailsHeaderPrefix, selectedRequest.requestKey || strings.MyRequests.FallbackAssetRequest), closeButtonAriaLabel: strings.Common.Close },
            React.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGrid, style: { backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelRequestId),
                        " ",
                        React.createElement("strong", null, selectedRequest.requestKey || strings.Common.NotAvailable)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelDateRequested),
                        " ",
                        React.createElement("strong", null, selectedRequest.requestDate)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelRequester),
                        " ",
                        React.createElement("strong", null, selectedRequest.requesterName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelEmployeeId),
                        " ",
                        React.createElement("strong", null, selectedRequest.employeeId || '-')),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelAssetType),
                        " ",
                        React.createElement("strong", null, selectedRequest.assetTitle)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelQuantity),
                        " ",
                        React.createElement("strong", null, selectedRequest.quantity))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, strings.MyRequests.ReasonForRequestTitle),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.reason || strings.MyRequests.NoReasonProvided)),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, strings.MyRequests.ManagerApprovalStatusTitle),
                    React.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        React.createElement("span", { style: {
                                backgroundColor: selectedRequest.status === 'Approved' ? '#e6f4ea' : selectedRequest.status === 'Declined' ? '#fce8e6' : '#fef7e0',
                                color: selectedRequest.status === 'Approved' ? '#137333' : selectedRequest.status === 'Declined' ? '#c5221f' : '#b06000',
                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                            } }, (0, RequestStatusUtils_1.getAssetRequestStatusDisplayText)(selectedRequest.status)),
                        selectedRequest.managerResponse && (React.createElement("span", { style: { fontSize: '0.85rem', color: '#475569' } },
                            "- \u201C",
                            selectedRequest.managerResponse,
                            "\u201D")))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, strings.MyRequests.AdminAllocationStatusTitle),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.status === 'Approved' ? ((selectedRequest.assetStatus || '').toLowerCase().includes('approv') ? (React.createElement("span", { style: { color: '#137333', fontWeight: 600 } }, strings.RequestList.AllocationAllocated)) : (React.createElement("span", { style: { color: '#b06000', fontWeight: 600 } }, strings.RequestList.AllocationPendingAdmin))) : selectedRequest.status === 'Declined' ? (React.createElement("span", { style: { color: '#c5221f' } }, strings.RequestList.AllocationNotApplicable)) : (React.createElement("span", { style: { color: '#64748b', fontStyle: 'italic' } }, strings.RequestList.AllocationPendingManager)))),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    React.createElement(react_2.DefaultButton, { text: strings.Common.Close, onClick: () => { setIsPanelOpen(false); setSelectedRequest(null); } }))))),
        selectedReturnRequest && (React.createElement(react_2.Panel, { isOpen: isReturnPanelOpen, onDismiss: () => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); }, type: react_2.PanelType.medium, headerText: (0, LocalizationUtils_1.formatString)(strings.MyRequests.ReturnRequestDetailsPrefix, selectedReturnRequest.assetName), closeButtonAriaLabel: strings.Common.Close },
            React.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                (() => {
                    const { bg, color } = getReturnStatusStyle(selectedReturnRequest.status);
                    const icon = getReturnStatusIcon(selectedReturnRequest.status);
                    const statusMessages = {
                        'Pending': strings.MyRequests.StatusPendingSubmitted,
                        'Pending Manager Approval': strings.MyRequests.StatusPendingSubmitted,
                        'Pending Admin Verification': strings.MyRequests.StatusPendingAdminMsg,
                        'Approved': strings.MyRequests.StatusApprovedCompleted,
                        'Rejected': strings.MyRequests.StatusRejectedMsg,
                        'Completed': strings.MyRequests.StatusCompletedMsg
                    };
                    return (React.createElement("div", { style: { backgroundColor: bg, padding: '12px 15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' } },
                        React.createElement(react_2.Icon, { iconName: icon, style: { fontSize: '20px', color, marginTop: '2px' } }),
                        React.createElement("div", null,
                            React.createElement("strong", { style: { color, display: 'block', marginBottom: '2px' } }, (0, RequestStatusUtils_1.getReturnRequestStatusDisplayText)(selectedReturnRequest.status)),
                            React.createElement("span", { style: { fontSize: '0.85rem', color } }, statusMessages[selectedReturnRequest.status] || ''))));
                })(),
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGrid, style: { backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' } },
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelAssetName),
                        " ",
                        React.createElement("strong", null, selectedReturnRequest.assetName)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelSerialNumber),
                        " ",
                        React.createElement("strong", null, selectedReturnRequest.serialNumber || strings.Common.NotAvailable)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelSubmittedOn),
                        " ",
                        React.createElement("strong", null, selectedReturnRequest.requestDate)),
                    React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelProposedCondition),
                        " ",
                        React.createElement("strong", null, selectedReturnRequest.proposedCondition || strings.Common.NotAvailable)),
                    selectedReturnRequest.completedDate && (React.createElement("div", null,
                        React.createElement("span", { style: { color: '#64748b', display: 'block' } }, strings.MyRequests.LabelCompletedOn),
                        " ",
                        React.createElement("strong", { style: { color: '#16a34a' } }, selectedReturnRequest.completedDate)))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, strings.MyRequests.ReasonForReturnTitle),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' } }, selectedReturnRequest.returnReason || strings.MyRequests.NoReasonProvidedReturn)),
                selectedReturnRequest.managerComment && (React.createElement("div", { style: {
                        backgroundColor: selectedReturnRequest.status === 'Rejected' ? '#fef2f2' : '#f0fdf4',
                        padding: '12px 15px', borderRadius: '8px',
                        border: `1px solid ${selectedReturnRequest.status === 'Rejected' ? '#fecaca' : '#bbf7d0'}`
                    } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, strings.WorkflowPopup.LabelManagerAdminNotes),
                    React.createElement("span", { style: { fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' } }, selectedReturnRequest.managerComment))),
                React.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 } }, strings.MyRequests.ProgressTitle),
                    [
                        { label: strings.MyRequests.ProgressSubmitted, done: true },
                        { label: strings.MyRequests.ProgressManagerReview, done: selectedReturnRequest.status !== 'Pending' && selectedReturnRequest.status !== 'Pending Manager Approval' },
                        { label: strings.MyRequests.ProgressHandoverVerification, done: selectedReturnRequest.status === 'Completed' || selectedReturnRequest.status === 'Approved' }
                    ].map((step, idx) => (React.createElement("div", { key: idx, style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: idx < 3 ? '8px' : 0, fontSize: '0.85rem' } },
                        React.createElement("div", { style: {
                                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                backgroundColor: step.done ? '#16a34a' : '#e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            } }, step.done && React.createElement(react_2.Icon, { iconName: "CheckMark", style: { fontSize: '10px', color: '#ffffff' } })),
                        React.createElement("span", { style: { color: step.done ? '#166534' : '#94a3b8', fontWeight: step.done ? 600 : 400 } }, step.label))))),
                React.createElement(react_2.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    React.createElement(react_2.DefaultButton, { text: strings.Common.Close, onClick: () => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); } })))))));
};
exports.MyRequestsView = MyRequestsView;
//# sourceMappingURL=MyRequestsView.js.map
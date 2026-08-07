"use strict";
self["webpackHotUpdate_56f8f2dc_8391_46cb_b74c_2806d6953063_0_0_1"]("inventory-management-web-part",{

/***/ 12645:
/*!***********************************************************************!*\
  !*** ./lib/webparts/inventoryManagement/components/MyRequestsView.js ***!
  \***********************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   MyRequestsView: () => (/* binding */ MyRequestsView)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ 85959);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @fluentui/react */ 92070);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @fluentui/react */ 15369);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @fluentui/react */ 67102);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @fluentui/react */ 12042);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @fluentui/react */ 5613);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @fluentui/react */ 52394);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @fluentui/react */ 72674);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! @fluentui/react */ 27006);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! @fluentui/react */ 18681);
/* harmony import */ var _fluentui_react__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! @fluentui/react */ 21314);
/* harmony import */ var _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./InventoryManagement.module.scss */ 99623);
/* harmony import */ var _constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../constants/DropdownConstants */ 82889);





const MyRequestsView = (props) => {
    const { requests, returnRequests = [] } = props;
    // Search and Filter States (Asset Requests)
    const [searchQuery, setSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [selectedStatus, setSelectedStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    const [selectedPriority, setSelectedPriority] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    // Search and Filter States (Return Requests)
    const [returnSearchQuery, setReturnSearchQuery] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
    const [returnSelectedStatus, setReturnSelectedStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('All');
    // Detail Panel State
    const [selectedRequest, setSelectedRequest] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isPanelOpen, setIsPanelOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    // Return Request Detail Panel State
    const [selectedReturnRequest, setSelectedReturnRequest] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
    const [isReturnPanelOpen, setIsReturnPanelOpen] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
    // Dynamic metrics derived from all requests
    const metrics = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
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
    // Return Request metrics
    const returnMetrics = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
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
    const filteredRequests = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
        const filtered = requests.filter(r => {
            const normQuery = searchQuery.toLowerCase().trim();
            const matchesSearch = !normQuery ||
                (r.requestKey || '').toLowerCase().includes(normQuery) ||
                (r.assetTitle || '').toLowerCase().includes(normQuery) ||
                (r.reason || '').toLowerCase().includes(normQuery) ||
                (r.managerName || '').toLowerCase().includes(normQuery) ||
                (r.id || '').toLowerCase().includes(normQuery);
            const matchesStatus = selectedStatus === 'All' || (r.status || 'Pending') === selectedStatus;
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
    const filteredReturnRequests = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
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
    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' } },
        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_3__.Pivot, { "aria-label": "My Requests" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.PivotItem, { headerText: "Asset Requests", itemIcon: "Send", itemCount: metrics.total },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricsRow },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Total Requests"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, metrics.total)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Pending Approval"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.pending > 0 ? '#d97706' : 'var(--text-muted)' } }, metrics.pending)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Approved"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, metrics.approved)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Declined"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: metrics.declined > 0 ? '#dc2626' : 'var(--text-muted)' } }, metrics.declined))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filtersRow },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].searchField },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.TextField, { placeholder: "Search by Request ID, asset type, reason...", value: searchQuery, onChange: (e, val) => setSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Dropdown, { options: [
                                    { key: 'All', text: 'All Statuses' },
                                    ..._constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__.ASSET_REQUEST_STATUS_OPTIONS
                                ], selectedKey: selectedStatus, onChange: (e, option) => setSelectedStatus(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Dropdown, { options: [
                                    { key: 'All', text: 'All Priorities' },
                                    ..._constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__.ASSET_REQUEST_PRIORITY_OPTIONS
                                ], selectedKey: selectedPriority, onChange: (e, option) => setSelectedPriority(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "Reset", iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                                    setSearchQuery('');
                                    setSelectedStatus('All');
                                    setSelectedPriority('All');
                                }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
                    filteredRequests.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '16px',
                            marginTop: '10px'
                        } }, filteredRequests.map(item => {
                        const status = item.status || 'Pending';
                        const priority = item.priority || 'Medium';
                        let statusBg = '#fef7e0';
                        let statusText = '#b06000';
                        if (status === 'Approved') {
                            statusBg = '#e6f4ea';
                            statusText = '#137333';
                        }
                        else if (status === 'Declined') {
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
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: item.id, style: {
                                backgroundColor: 'var(--surface-bg)',
                                borderRadius: '6px',
                                border: '1px solid rgba(0, 0, 0, 0.08)',
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden'
                            }, className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].assetCardHover },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.requestKey || `REQ-${item.id.substring(0, 6)}`),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                                        "Requested: ",
                                        item.requestDate)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { backgroundColor: statusBg, color: statusText, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600 } }, status)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { fontSize: '0.82rem', color: 'var(--text-main)' } },
                                    "Asset: ",
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, item.assetTitle),
                                    " (Qty: ",
                                    item.quantity,
                                    ")"),
                                item.reason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' } },
                                    "Reason: ",
                                    item.reason)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px', marginTop: 'auto' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: adminAllocationColor, fontWeight: 500 } }, adminAllocationText),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { backgroundColor: priorityBg, color: priorityColor, padding: '2px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 500 } }, priority))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "View Details", onClick: () => { setSelectedRequest(item); setIsPanelOpen(true); }, style: { height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' } }))));
                    }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "DatabaseNoData", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, "No Asset Requests Found"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.Text, { variant: "small", style: { color: 'var(--text-muted)' } }, "Try adjusting your search query or filters."))))),
            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_4__.PivotItem, { headerText: "Return Requests", itemIcon: "ReturnToSession", itemCount: returnMetrics.total },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricsRow },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem, style: { minWidth: '90px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Total"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: 'var(--text-main)' } }, returnMetrics.total)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem, style: { minWidth: '90px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Pending"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.pending > 0 ? '#d97706' : 'var(--text-muted)' } }, returnMetrics.pending)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem, style: { minWidth: '90px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Approved"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#1558d6' } }, returnMetrics.approved)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem, style: { minWidth: '90px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Completed"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: '#16a34a' } }, returnMetrics.completed)),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricDivider }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].metricItem, style: { minWidth: '90px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' } }, "Rejected"),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '1.4rem', fontWeight: 600, color: returnMetrics.rejected > 0 ? '#dc2626' : 'var(--text-muted)' } }, returnMetrics.rejected))),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filtersRow },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].searchField },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_5__.TextField, { placeholder: "Search by asset name, serial number, reason...", value: returnSearchQuery, onChange: (e, val) => setReturnSearchQuery(val || ''), iconProps: { iconName: 'Search' }, underlined: true })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].filterDropdown, style: { width: '150px' } },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_6__.Dropdown, { options: [
                                    { key: 'All', text: 'All Statuses' },
                                    ..._constants_DropdownConstants__WEBPACK_IMPORTED_MODULE_2__.RETURN_REQUEST_STATUS_OPTIONS
                                ], selectedKey: returnSelectedStatus, onChange: (e, option) => setReturnSelectedStatus(option ? option.key : 'All'), styles: { root: { selectors: { '.ms-Dropdown-title': { border: 'none', borderBottom: '1px solid #a1a1a1', background: 'transparent', paddingLeft: 0 } } } } })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "Reset", iconProps: { iconName: 'ClearFilter' }, onClick: () => {
                                    setReturnSearchQuery('');
                                    setReturnSelectedStatus('All');
                                }, style: { height: '30px', border: 'none', background: 'transparent' } }))),
                    filteredReturnRequests.length > 0 ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                            gap: '16px',
                            marginTop: '10px'
                        } }, filteredReturnRequests.map(item => {
                        const { bg: statusBg, color: statusColor } = getReturnStatusStyle(item.status);
                        const statusIcon = getReturnStatusIcon(item.status);
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
                        return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: item.id, style: {
                                backgroundColor: 'var(--surface-bg)',
                                borderRadius: '6px',
                                border: `1px solid ${item.status === 'Rejected' ? 'rgba(197, 34, 31, 0.15)' : item.status === 'Completed' ? 'rgba(19, 115, 51, 0.15)' : 'rgba(0, 0, 0, 0.08)'}`,
                                display: 'flex',
                                flexDirection: 'column',
                                transition: 'all 0.2s ease',
                                overflow: 'hidden'
                            }, className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].assetCardHover },
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '14px 14px 6px 14px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'flex-start' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "ReturnToSession", style: { fontSize: '14px', color: 'var(--text-muted)', marginTop: '2px' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' } }, item.assetName),
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.72rem', color: 'var(--text-muted)' } },
                                            "S/N: ",
                                            item.serialNumber || 'N/A',
                                            " \u2022 Submitted: ",
                                            item.requestDate))),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { backgroundColor: statusBg, color: statusColor, padding: '2px 8px', borderRadius: '4px', fontSize: '0.68rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: statusIcon, style: { fontSize: '10px' } }),
                                    item.status)),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '4px 14px 12px 14px', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '8px' } },
                                item.returnReason && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("p", { style: { margin: '0 0 2px 0', fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', height: '32px' } },
                                    "Reason: ",
                                    item.returnReason)),
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', borderTop: '1px solid rgba(0, 0, 0, 0.04)', paddingTop: '6px' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null,
                                        "Condition: ",
                                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { backgroundColor: condBg, color: condColor, padding: '1px 6px', borderRadius: '3px', fontSize: '0.68rem', fontWeight: 600 } }, item.proposedCondition || 'N/A')),
                                    item.completedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#16a34a', fontSize: '0.7rem' } },
                                        "\u2713 ",
                                        item.completedDate))),
                                item.managerComment && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                        backgroundColor: item.status === 'Rejected' ? '#fef2f2' : item.status === 'Completed' ? '#f0fdf4' : '#f8fafc',
                                        borderRadius: '4px',
                                        padding: '6px 8px',
                                        borderLeft: `3px solid ${item.status === 'Rejected' ? '#dc2626' : item.status === 'Completed' ? '#16a34a' : '#94a3b8'}`,
                                        fontSize: '0.75rem',
                                        color: 'var(--text-muted)'
                                    } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { display: 'block', marginBottom: '2px', color: 'var(--text-main)' } }, "Manager Notes:"),
                                    item.managerComment)),
                                item.status === 'Pending' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#b06000' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "Clock", style: { fontSize: '10px' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "Awaiting manager review"))),
                                item.status === 'Approved' && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.72rem', color: '#1558d6' } },
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "Info", style: { fontSize: '10px' } }),
                                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", null, "Please physically hand over the asset to the IT team")))),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { padding: '8px 14px 10px 14px', display: 'flex', gap: '6px', borderTop: '1px solid rgba(0, 0, 0, 0.04)', alignItems: 'center' } },
                                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "View Details", onClick: () => { setSelectedReturnRequest(item); setIsReturnPanelOpen(true); }, style: { height: '24px', padding: '0 8px', fontSize: '0.72rem', borderRadius: '4px', border: '1px solid #e0e0e0', width: '100%' } }))));
                    }))) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { textAlign: 'center', padding: '30px 10px', backgroundColor: 'var(--surface-bg)', borderRadius: '6px', border: '1px solid rgba(0, 0, 0, 0.08)' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "ReturnToSession", style: { fontSize: '32px', color: 'var(--text-muted)', marginBottom: '8px' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.Text, { variant: "medium", block: true, style: { fontWeight: 600, color: 'var(--text-main)', marginBottom: '4px' } }, "No Return Requests Found"),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_9__.Text, { variant: "small", style: { color: 'var(--text-muted)' } }, returnRequests.length === 0
                            ? 'You have not submitted any return requests yet. Use the "Return" button on an asset in My Assets.'
                            : 'Try adjusting your search query or filters.')))))),
        selectedRequest && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Panel, { isOpen: isPanelOpen, onDismiss: () => { setIsPanelOpen(false); setSelectedRequest(null); }, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_11__.PanelType.medium, headerText: `Request Details: ${selectedRequest.requestKey || 'Asset Request'}`, closeButtonAriaLabel: "Close" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Request ID:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.requestKey || 'N/A')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Date Requested:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.requestDate)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Requester:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.requesterName)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Employee ID:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.employeeId || '-')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Type:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.assetTitle)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Quantity:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedRequest.quantity))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Reason for Request"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.reason || 'No reason provided.')),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Manager Approval Status"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: {
                                backgroundColor: selectedRequest.status === 'Approved' ? '#e6f4ea' : selectedRequest.status === 'Declined' ? '#fce8e6' : '#fef7e0',
                                color: selectedRequest.status === 'Approved' ? '#137333' : selectedRequest.status === 'Declined' ? '#c5221f' : '#b06000',
                                padding: '2px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 600
                            } }, selectedRequest.status || 'Pending'),
                        selectedRequest.managerResponse && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.85rem', color: '#475569' } },
                            "- \u201C",
                            selectedRequest.managerResponse,
                            "\u201D")))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Admin Allocation Status"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155' } }, selectedRequest.status === 'Approved' ? ((selectedRequest.assetStatus || '').toLowerCase().includes('approv') ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#137333', fontWeight: 600 } }, "Asset Allocated & Dispatched \u2713")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#b06000', fontWeight: 600 } }, "Pending physical asset allocation by system administrator"))) : selectedRequest.status === 'Declined' ? (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#c5221f' } }, "Not applicable (Request was rejected by manager)")) : (react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', fontStyle: 'italic' } }, "Pending manager approval first")))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '25px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "Close", onClick: () => { setIsPanelOpen(false); setSelectedRequest(null); } }))))),
        selectedReturnRequest && (react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_10__.Panel, { isOpen: isReturnPanelOpen, onDismiss: () => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); }, type: _fluentui_react__WEBPACK_IMPORTED_MODULE_11__.PanelType.medium, headerText: `Return Request: ${selectedReturnRequest.assetName}`, closeButtonAriaLabel: "Close" },
            react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { marginTop: '20px', display: 'flex', flexDirection: 'column', gap: '15px' } },
                (() => {
                    const { bg, color } = getReturnStatusStyle(selectedReturnRequest.status);
                    const icon = getReturnStatusIcon(selectedReturnRequest.status);
                    const statusMessages = {
                        'Pending': 'Your return request has been submitted and is awaiting manager review.',
                        'Pending Manager Approval': 'Your return request has been submitted and is awaiting manager review.',
                        'Pending Admin Verification': 'Your return has been approved by your manager and is awaiting final IT Admin verification.',
                        'Approved': 'Your return has been approved and completed. The asset has been checked in.',
                        'Rejected': 'Your return request was rejected. Please check the manager notes below.',
                        'Completed': 'The asset has been successfully checked in. This return is complete.'
                    };
                    return (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: bg, padding: '12px 15px', borderRadius: '8px', display: 'flex', gap: '10px', alignItems: 'flex-start' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: icon, style: { fontSize: '20px', color, marginTop: '2px' } }),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color, display: 'block', marginBottom: '2px' } }, selectedReturnRequest.status),
                            react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.85rem', color } }, statusMessages[selectedReturnRequest.status] || ''))));
                })(),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { className: _InventoryManagement_module_scss__WEBPACK_IMPORTED_MODULE_1__["default"].responsiveGrid, style: { backgroundColor: '#f1f5f9', padding: '15px', borderRadius: '8px', fontSize: '0.88rem' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Asset Name:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedReturnRequest.assetName)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Serial Number:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedReturnRequest.serialNumber || 'N/A')),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Submitted On:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedReturnRequest.requestDate)),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Proposed Condition:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", null, selectedReturnRequest.proposedCondition || 'N/A')),
                    selectedReturnRequest.completedDate && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", null,
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: '#64748b', display: 'block' } }, "Completed On:"),
                        " ",
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("strong", { style: { color: '#16a34a' } }, selectedReturnRequest.completedDate)))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Reason for Return"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' } }, selectedReturnRequest.returnReason || 'No reason provided.')),
                selectedReturnRequest.managerComment && (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                        backgroundColor: selectedReturnRequest.status === 'Rejected' ? '#fef2f2' : '#f0fdf4',
                        padding: '12px 15px', borderRadius: '8px',
                        border: `1px solid ${selectedReturnRequest.status === 'Rejected' ? '#fecaca' : '#bbf7d0'}`
                    } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '4px', fontWeight: 600 } }, "Manager / Admin Notes"),
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' } }, selectedReturnRequest.managerComment))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: { backgroundColor: '#f8fafc', padding: '12px 15px', borderRadius: '8px', border: '1px solid #e2e8f0' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { display: 'block', fontSize: '0.85rem', color: '#64748b', marginBottom: '12px', fontWeight: 600 } }, "Return Workflow Progress"),
                    [
                        { label: 'Return Submitted', done: true },
                        { label: 'Manager Review', done: selectedReturnRequest.status !== 'Pending' && selectedReturnRequest.status !== 'Pending Manager Approval' },
                        { label: 'Physical Asset Handover & Admin Verification', done: selectedReturnRequest.status === 'Completed' || selectedReturnRequest.status === 'Approved' }
                    ].map((step, idx) => (react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { key: idx, style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: idx < 3 ? '8px' : 0, fontSize: '0.85rem' } },
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("div", { style: {
                                width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0,
                                backgroundColor: step.done ? '#16a34a' : '#e2e8f0',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            } }, step.done && react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_8__.Icon, { iconName: "CheckMark", style: { fontSize: '10px', color: '#ffffff' } })),
                        react__WEBPACK_IMPORTED_MODULE_0__.createElement("span", { style: { color: step.done ? '#166534' : '#94a3b8', fontWeight: step.done ? 600 : 400 } }, step.label))))),
                react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_12__.Stack, { horizontal: true, tokens: { childrenGap: 10 }, style: { marginTop: '10px', borderTop: '1px solid #e2e8f0', paddingTop: '15px' } },
                    react__WEBPACK_IMPORTED_MODULE_0__.createElement(_fluentui_react__WEBPACK_IMPORTED_MODULE_7__.DefaultButton, { text: "Close", onClick: () => { setIsReturnPanelOpen(false); setSelectedReturnRequest(null); } })))))));
};


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ /* webpack/runtime/getFullHash */
/******/ (() => {
/******/ 	__webpack_require__.h = () => ("0c68bad00d2dcfce8fcd")
/******/ })();
/******/ 
/******/ }
);
//# sourceMappingURL=inventory-management-web-part.bb8e2ff9d1c545dd91b8.hot-update.js.map
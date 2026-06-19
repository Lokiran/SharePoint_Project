"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStream = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const SearchBox_1 = require("@fluentui/react/lib/SearchBox");
const RoleUtils_1 = require("../utils/RoleUtils");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const EventStream = (props) => {
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const pageSize = 10;
    const isAdmin = props.currentUserRole === 'Admin';
    const isManager = props.currentUserRole === 'Inventory Manager';
    const isEmployee = props.currentUserRole === 'Inventory Employee';
    const columns = [
        {
            key: 'column_action',
            name: 'Action',
            fieldName: 'action',
            minWidth: 120,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => {
                let backgroundColor = '#f3f4f6';
                let textColor = '#374151';
                let displayText = item.action || '';
                const normalizedAction = displayText.toLowerCase().trim();
                if (normalizedAction === 'created' || normalizedAction === 'create') {
                    backgroundColor = '#dbeafe'; // Light blue
                    textColor = '#1e40af'; // Dark blue
                    displayText = 'created';
                }
                else if (normalizedAction === 'manager approved') {
                    backgroundColor = '#dcfce7'; // Light green
                    textColor = '#166534'; // Dark green
                    displayText = 'manager approved';
                }
                else if (normalizedAction === 'manager rejected') {
                    backgroundColor = '#fee2e2'; // Light red
                    textColor = '#991b1b'; // Dark red
                    displayText = 'manager rejected';
                }
                else if (normalizedAction === 'admin assigned') {
                    backgroundColor = '#f3e8ff'; // Light purple
                    textColor = '#6b21a8'; // Dark purple
                    displayText = 'admin assigned';
                }
                else if (normalizedAction === 'status updated to in progress') {
                    backgroundColor = '#ffedd5'; // Light orange/yellow
                    textColor = '#9a3412'; // Dark orange
                    displayText = 'status updated to in progress';
                }
                else if (normalizedAction === 'status updated to resolved') {
                    backgroundColor = '#ccfbf1'; // Light teal
                    textColor = '#115e59'; // Dark teal
                    displayText = 'status updated to resolved';
                }
                else if (normalizedAction === 'deleted' || normalizedAction === 'delete') {
                    backgroundColor = '#fee2e2'; // Light red
                    textColor = '#991b1b'; // Dark red
                    displayText = 'deleted';
                }
                else if (normalizedAction === 'return requested') {
                    backgroundColor = '#ffedd5'; // Light orange
                    textColor = '#9a3412'; // Dark orange
                    displayText = 'return requested';
                }
                else if (normalizedAction === 'return approved') {
                    backgroundColor = '#dcfce7'; // Light green
                    textColor = '#166534'; // Dark green
                    displayText = 'return approved';
                }
                else if (normalizedAction === 'return completed') {
                    backgroundColor = '#ccfbf1'; // Light teal
                    textColor = '#115e59'; // Dark teal
                    displayText = 'return completed';
                }
                else if (normalizedAction === 'return rejected') {
                    backgroundColor = '#fee2e2'; // Light red
                    textColor = '#991b1b'; // Dark red
                    displayText = 'return rejected';
                }
                else if (normalizedAction === 'activated') {
                    backgroundColor = '#dcfce7'; // Light green
                    textColor = '#166534'; // Dark green
                    displayText = 'activated';
                }
                else if (normalizedAction === 'inactivated') {
                    backgroundColor = '#fef3c7'; // Light amber
                    textColor = '#92400e'; // Dark amber
                    displayText = 'inactivated';
                }
                else if (normalizedAction === 'deactivated') {
                    backgroundColor = '#fee2e2'; // Light red
                    textColor = '#991b1b'; // Dark red
                    displayText = 'deactivated';
                }
                else if (normalizedAction === 'update') {
                    backgroundColor = '#ffedd5'; // Light orange/yellow (fallback for generic Update)
                    textColor = '#9a3412';
                    displayText = 'updated';
                }
                return (React.createElement("span", { style: {
                        backgroundColor,
                        color: textColor,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        display: 'inline-block',
                        textTransform: 'lowercase'
                    } }, displayText));
            }
        },
        { key: 'column_type', name: 'Type', fieldName: 'entityType', minWidth: 60, maxWidth: 80, isResizable: true },
        { key: 'column_title', name: 'Title', fieldName: 'title', minWidth: 150, maxWidth: 200, isResizable: true },
        { key: 'column_assetName', name: 'Asset Name', fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
        ...(RoleUtils_1.RoleUtils.canViewAuditLogs(props.currentUserRole) ? [
            { key: 'column_user', name: 'User', fieldName: 'user', minWidth: 100, maxWidth: 150, isResizable: true }
        ] : []),
        { key: 'column_timestamp', name: 'Timestamp', fieldName: 'timestamp', minWidth: 120, maxWidth: 160, isResizable: true },
        ...(RoleUtils_1.RoleUtils.canViewAuditLogs(props.currentUserRole) ? [
            { key: 'column_details', name: 'Details', fieldName: 'details', minWidth: 200, maxWidth: 400, isResizable: true, isMultiline: true }
        ] : [])
    ];
    const roleBasedFilteredLogs = (0, react_1.useMemo)(() => {
        if (isEmployee) {
            return props.logs.filter(log => (log.user || '').toLowerCase().includes(props.currentUserName.toLowerCase()) ||
                (log.details || '').toLowerCase().includes(props.currentUserName.toLowerCase()));
        }
        return props.logs;
    }, [props.logs, isEmployee, props.currentUserName]);
    const filteredLogs = (0, react_1.useMemo)(() => {
        if (!searchQuery) {
            return roleBasedFilteredLogs;
        }
        const lowerQuery = searchQuery.toLowerCase();
        return roleBasedFilteredLogs.filter(log => log.title?.toLowerCase().includes(lowerQuery) ||
            log.assetName?.toLowerCase().includes(lowerQuery) ||
            log.details?.toLowerCase().includes(lowerQuery) ||
            log.user?.toLowerCase().includes(lowerQuery) ||
            log.action?.toLowerCase().includes(lowerQuery) ||
            log.entityType?.toLowerCase().includes(lowerQuery) ||
            log.entityId?.toLowerCase().includes(lowerQuery));
    }, [roleBasedFilteredLogs, searchQuery]);
    // Reset page when searchQuery or logs array changes
    (0, react_1.useEffect)(() => {
        setCurrentPage(1);
    }, [searchQuery, props.logs]);
    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / pageSize);
    const activePage = Math.min(currentPage, Math.max(1, totalPages));
    const startIndex = (activePage - 1) * pageSize;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + pageSize);
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        }
        else {
            pages.push(1);
            const start = Math.max(2, activePage - 1);
            const end = Math.min(totalPages - 1, activePage + 1);
            if (start > 2) {
                pages.push('...');
            }
            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
            if (end < totalPages - 1) {
                pages.push('...');
            }
            pages.push(totalPages);
        }
        return pages;
    };
    return (React.createElement("div", { style: { marginTop: '20px' } },
        React.createElement("div", { style: { marginBottom: '20px' } },
            props.errorMessage && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '15px' } },
                React.createElement("strong", null, "Notice:"),
                " ",
                props.errorMessage)),
            React.createElement(SearchBox_1.SearchBox, { placeholder: "Search by asset name, title, details, user, or action...", value: searchQuery, onChange: (_, newValue) => setSearchQuery(newValue || ''), onClear: () => setSearchQuery(''), styles: { root: { maxWidth: 400 } } })),
        props.loading ? (React.createElement("p", null, "Loading audit logs...")) : roleBasedFilteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } },
            "No audit events ",
            isEmployee ? 'for you' : '',
            " recorded yet.")) : filteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, "No audit events match your search query.")) : (React.createElement(React.Fragment, null,
            React.createElement(DetailsList_1.DetailsList, { items: paginatedLogs, columns: columns, setKey: "set", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }),
            totalPages > 1 && (React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationContainer },
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationInfo },
                    "Showing ",
                    React.createElement("strong", null, startIndex + 1),
                    " to ",
                    React.createElement("strong", null, Math.min(startIndex + pageSize, totalItems)),
                    " of ",
                    React.createElement("strong", null, totalItems),
                    " entries"),
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationControls },
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(1), title: "First Page" }, "\u00AB"),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(prev => prev - 1), title: "Previous Page" }, "\u2039"),
                    getPageNumbers().map((page, idx) => {
                        if (page === '...') {
                            return React.createElement("span", { key: `ellipsis-${idx}`, style: { padding: '0 8px', color: 'var(--text-muted)' } }, "...");
                        }
                        return (React.createElement("button", { key: page, className: `${InventoryManagement_module_scss_1.default.paginationButton} ${activePage === page ? InventoryManagement_module_scss_1.default.active : ''}`, onClick: () => setCurrentPage(page) }, page));
                    }),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(prev => prev + 1), title: "Next Page" }, "\u203A"),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(totalPages), title: "Last Page" }, "\u00BB"))))))));
};
exports.EventStream = EventStream;
//# sourceMappingURL=EventStream.js.map
import * as React from 'react';
import { useState, useMemo, useEffect } from 'react';
import { DetailsList, DetailsListLayoutMode, SelectionMode } from '@fluentui/react/lib/DetailsList';
import { RoleUtils } from '../utils/RoleUtils';
import styles from './InventoryManagement.module.scss';
import { EventFilters } from './EventFilters';
import { InventoryService } from '../services/InventoryService';
export const EventStream = (props) => {
    const [filters, setFilters] = useState({
        searchQuery: '',
        dateRangeType: 'All',
        action: 'All',
        module: 'All',
        assetType: 'All',
        user: 'All',
        status: 'All',
        sortOrder: 'NewestFirst'
    });
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;
    // Filter option lists
    const [actionsList, setActionsList] = useState([]);
    const [assetTypesList, setAssetTypesList] = useState([]);
    const [usersList, setUsersList] = useState([]);
    const isEmployee = props.currentUserRole === 'Inventory Employee';
    // Load filter lists from the recent logs to populate dropdown options dynamically
    useEffect(() => {
        const loadFilterMetadata = async () => {
            try {
                // Fetch last 90 days of logs as a baseline for filter options
                const initLogs = await InventoryService.getFilteredAuditLogs({
                    searchQuery: '',
                    dateRangeType: 'Last90',
                    action: 'All',
                    module: 'All',
                    assetType: 'All',
                    user: 'All',
                    status: 'All',
                    sortOrder: 'NewestFirst'
                });
                // Extract unique options
                const actions = Array.from(new Set(initLogs.map(l => l.action).filter(Boolean)));
                const users = Array.from(new Set(initLogs.map(l => l.user).filter(Boolean)));
                const defaultAssetTypes = ['Laptop', 'Mouse', 'Keyboard', 'Monitor', 'Headset', 'Dock', 'Printer'];
                const foundAssetTypes = initLogs.map(l => l.assetName).filter(Boolean);
                const uniqueAssetTypes = Array.from(new Set([...defaultAssetTypes, ...foundAssetTypes]));
                setActionsList(actions.sort());
                setUsersList(users.sort());
                setAssetTypesList(uniqueAssetTypes.sort());
            }
            catch (err) {
                console.warn("Failed to load filter metadata:", err);
            }
        };
        loadFilterMetadata();
    }, []);
    // Fetch logs whenever server-side filters or refresh trigger change
    useEffect(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                const fetched = await InventoryService.getFilteredAuditLogs({
                    ...filters,
                    searchQuery: ''
                });
                setLogs(fetched);
            }
            catch (err) {
                console.error("Failed to fetch filtered audit logs:", err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchLogs();
        setCurrentPage(1); // Reset page to 1 when filters change
    }, [
        filters.dateRangeType,
        filters.startDate,
        filters.endDate,
        filters.action,
        filters.module,
        filters.user,
        props.refreshTrigger
    ]);
    // Reset to page 1 when client-side filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filters.searchQuery, filters.assetType, filters.status, filters.sortOrder]);
    const handleClearFilters = () => {
        setFilters(prev => ({
            searchQuery: prev.searchQuery, // Preserve search text
            dateRangeType: 'All',
            startDate: undefined,
            endDate: undefined,
            action: 'All',
            module: 'All',
            assetType: 'All',
            user: 'All',
            status: 'All',
            sortOrder: 'NewestFirst'
        }));
    };
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
                    backgroundColor = '#ffedd5'; // Light orange/yellow
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
        ...(RoleUtils.canViewAuditLogs(props.currentUserRole) ? [
            { key: 'column_user', name: 'User', fieldName: 'user', minWidth: 100, maxWidth: 150, isResizable: true }
        ] : []),
        { key: 'column_timestamp', name: 'Timestamp', fieldName: 'timestamp', minWidth: 120, maxWidth: 160, isResizable: true },
        ...(RoleUtils.canViewAuditLogs(props.currentUserRole) ? [
            { key: 'column_details', name: 'Details', fieldName: 'details', minWidth: 200, maxWidth: 400, isResizable: true, isMultiline: true }
        ] : [])
    ];
    // 1. Apply role-based visibility filtering client-side
    const roleBasedFilteredLogs = useMemo(() => {
        if (isEmployee) {
            return logs.filter(log => (log.user || '').toLowerCase().includes(props.currentUserName.toLowerCase()) ||
                (log.details || '').toLowerCase().includes(props.currentUserName.toLowerCase()));
        }
        return logs;
    }, [logs, isEmployee, props.currentUserName]);
    // 2. Apply client-side search, assetType, status filters, and sorting
    const filteredLogs = useMemo(() => {
        let result = [...roleBasedFilteredLogs];
        // Search query filtering
        if (filters.searchQuery) {
            const lowerQuery = filters.searchQuery.toLowerCase();
            result = result.filter(log => log.title?.toLowerCase().includes(lowerQuery) ||
                log.assetName?.toLowerCase().includes(lowerQuery) ||
                log.details?.toLowerCase().includes(lowerQuery) ||
                log.user?.toLowerCase().includes(lowerQuery) ||
                log.action?.toLowerCase().includes(lowerQuery) ||
                log.entityType?.toLowerCase().includes(lowerQuery) ||
                log.entityId?.toLowerCase().includes(lowerQuery));
        }
        // Asset type filtering
        if (filters.assetType && filters.assetType !== 'All') {
            const lowerAssetType = filters.assetType.toLowerCase();
            result = result.filter(log => (log.assetName || '').toLowerCase().includes(lowerAssetType) ||
                (log.title || '').toLowerCase().includes(lowerAssetType));
        }
        // Status filtering
        if (filters.status && filters.status !== 'All') {
            const lowerStatus = filters.status.toLowerCase();
            result = result.filter(log => (log.details || '').toLowerCase().includes(lowerStatus) ||
                (log.action || '').toLowerCase().includes(lowerStatus) ||
                (log.title || '').toLowerCase().includes(lowerStatus));
        }
        // Sorting
        if (filters.sortOrder) {
            result.sort((a, b) => {
                switch (filters.sortOrder) {
                    case 'NewestFirst':
                        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
                    case 'OldestFirst':
                        return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
                    case 'AssetNameAZ':
                        return (a.assetName || '').localeCompare(b.assetName || '');
                    case 'AssetNameZA':
                        return (b.assetName || '').localeCompare(a.assetName || '');
                    case 'UserAZ':
                        return (a.user || '').localeCompare(b.user || '');
                    case 'UserZA':
                        return (b.user || '').localeCompare(a.user || '');
                    default:
                        return 0;
                }
            });
        }
        return result;
    }, [roleBasedFilteredLogs, filters.searchQuery, filters.assetType, filters.status, filters.sortOrder]);
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
        props.errorMessage && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '15px' } },
            React.createElement("strong", null, "Notice:"),
            " ",
            props.errorMessage)),
        React.createElement(EventFilters, { filters: filters, onChange: setFilters, onClear: handleClearFilters, actionsList: actionsList, assetTypesList: assetTypesList, usersList: usersList }),
        loading ? (React.createElement("p", null, "Loading audit logs...")) : roleBasedFilteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } },
            "No audit events ",
            isEmployee ? 'for you' : '',
            " recorded yet.")) : filteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, "No audit events match your active filters.")) : (React.createElement(React.Fragment, null,
            React.createElement(DetailsList, { items: paginatedLogs, columns: columns, setKey: "set", layoutMode: DetailsListLayoutMode.justified, selectionMode: SelectionMode.none }),
            totalPages > 1 && (React.createElement("div", { className: styles.paginationContainer },
                React.createElement("div", { className: styles.paginationInfo },
                    "Showing ",
                    React.createElement("strong", null, startIndex + 1),
                    " to ",
                    React.createElement("strong", null, Math.min(startIndex + pageSize, totalItems)),
                    " of ",
                    React.createElement("strong", null, totalItems),
                    " entries"),
                React.createElement("div", { className: styles.paginationControls },
                    React.createElement("button", { className: styles.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(1), title: "First Page" }, "\u00AB"),
                    React.createElement("button", { className: styles.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(prev => prev - 1), title: "Previous Page" }, "\u2039"),
                    getPageNumbers().map((page, idx) => {
                        if (page === '...') {
                            return React.createElement("span", { key: `ellipsis-${idx}`, style: { padding: '0 8px', color: 'var(--text-muted)' } }, "...");
                        }
                        return (React.createElement("button", { key: page, className: `${styles.paginationButton} ${activePage === page ? styles.active : ''}`, onClick: () => setCurrentPage(page) }, page));
                    }),
                    React.createElement("button", { className: styles.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(prev => prev + 1), title: "Next Page" }, "\u203A"),
                    React.createElement("button", { className: styles.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(totalPages), title: "Last Page" }, "\u00BB"))))))));
};
//# sourceMappingURL=EventStream.js.map
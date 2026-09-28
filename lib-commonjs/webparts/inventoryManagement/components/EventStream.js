"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStream = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const DetailsList_1 = require("@fluentui/react/lib/DetailsList");
const RoleUtils_1 = require("../utils/RoleUtils");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const EventFilters_1 = require("./EventFilters");
const EventActionBadge_1 = require("./EventActionBadge");
const InventoryService_1 = require("../services/InventoryService");
const AssetTypeLookupService_1 = require("../services/AssetTypeLookupService");
const DropdownConstants_1 = require("../constants/DropdownConstants");
const EventLogUtils_1 = require("../utils/EventLogUtils");
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const PAGE_SIZE = 10;
const DEFAULT_FILTERS = {
    searchQuery: '',
    dateRangeType: 'All',
    action: 'All',
    module: 'All',
    assetType: 'All',
    user: 'All',
    status: 'All',
    sortOrder: 'NewestFirst'
};
const STANDARD_ASSET_TYPES = DropdownConstants_1.DEFAULT_ASSET_TYPE_OPTIONS.map(o => String(o.key));
const EventStream = (props) => {
    const [filters, setFilters] = (0, react_1.useState)(DEFAULT_FILTERS);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    // Filter option lists
    const [actionsList, setActionsList] = (0, react_1.useState)([]);
    const [baseAssetTypes, setBaseAssetTypes] = (0, react_1.useState)(STANDARD_ASSET_TYPES);
    const [knownUsers, setKnownUsers] = (0, react_1.useState)([]);
    const isEmployee = props.currentUserRole === 'Inventory Employee';
    // Load filter option lists: actions/users from the last 90 days of logs,
    // asset types from the standard types plus every type used in Inventory/Requests.
    (0, react_1.useEffect)(() => {
        const loadFilterMetadata = async () => {
            try {
                const [initLogs, lookup] = await Promise.all([
                    InventoryService_1.InventoryService.getFilteredAuditLogs({ ...DEFAULT_FILTERS, dateRangeType: 'Last90' }),
                    AssetTypeLookupService_1.AssetTypeLookupService.getLookup()
                ]);
                const actions = Array.from(new Set(initLogs.map(l => l.action).filter(Boolean)));
                const users = Array.from(new Set(initLogs.map(l => l.user).filter(Boolean)));
                setActionsList(actions.sort());
                setKnownUsers(users);
                setBaseAssetTypes((0, EventLogUtils_1.mergeAssetTypes)(STANDARD_ASSET_TYPES, lookup.knownTypes, initLogs.map(l => l.assetType)));
            }
            catch (err) {
                console.warn("Failed to load filter metadata:", err);
            }
        };
        loadFilterMetadata().catch(() => undefined);
    }, []);
    // Fetch logs whenever server-side filters or refresh trigger change
    (0, react_1.useEffect)(() => {
        const fetchLogs = async () => {
            setLoading(true);
            try {
                // Search and User are filtered client-side, against the names actually displayed.
                const fetched = await InventoryService_1.InventoryService.getFilteredAuditLogs({
                    ...filters,
                    searchQuery: '',
                    user: 'All'
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
        fetchLogs().catch(() => undefined);
        setCurrentPage(1); // Reset page to 1 when filters change
    }, [
        filters.dateRangeType,
        filters.startDate,
        filters.endDate,
        filters.action,
        filters.module,
        props.refreshTrigger
    ]);
    // Reset to page 1 when client-side filters change
    (0, react_1.useEffect)(() => {
        setCurrentPage(1);
    }, [filters.searchQuery, filters.assetType, filters.user, filters.status, filters.sortOrder]);
    const handleClearFilters = () => {
        setFilters(prev => ({
            ...DEFAULT_FILTERS,
            searchQuery: prev.searchQuery // Preserve search text
        }));
    };
    // Include types seen in the currently loaded logs so a newly used type is selectable immediately.
    const assetTypesList = (0, react_1.useMemo)(() => (0, EventLogUtils_1.mergeAssetTypes)(baseAssetTypes, logs.map(l => l.assetType)), [baseAssetTypes, logs]);
    const canViewAuditDetails = RoleUtils_1.RoleUtils.canViewAuditLogs(props.currentUserRole);
    const columns = [
        {
            key: 'column_action',
            name: strings.EventStream.ColumnAction,
            fieldName: 'action',
            minWidth: 120,
            maxWidth: 220,
            isResizable: true,
            onRender: (item) => React.createElement(EventActionBadge_1.EventActionBadge, { action: item.action })
        },
        { key: 'column_type', name: strings.Columns.Type, fieldName: 'entityType', minWidth: 60, maxWidth: 80, isResizable: true },
        { key: 'column_title', name: strings.Columns.Title, fieldName: 'title', minWidth: 150, maxWidth: 200, isResizable: true },
        { key: 'column_assetName', name: strings.Columns.AssetName, fieldName: 'assetName', minWidth: 100, maxWidth: 150, isResizable: true },
        ...(canViewAuditDetails ? [
            { key: 'column_user', name: strings.EventStream.ColumnUser, fieldName: 'user', minWidth: 100, maxWidth: 150, isResizable: true }
        ] : []),
        { key: 'column_timestamp', name: strings.EventStream.ColumnTimestamp, fieldName: 'timestamp', minWidth: 120, maxWidth: 160, isResizable: true },
        ...(canViewAuditDetails ? [
            { key: 'column_details', name: strings.EventStream.ColumnDetails, fieldName: 'details', minWidth: 200, maxWidth: 400, isResizable: true, isMultiline: true }
        ] : [])
    ];
    // 1. Apply role-based visibility filtering client-side
    const roleBasedFilteredLogs = (0, react_1.useMemo)(() => {
        if (isEmployee) {
            const me = props.currentUserName.toLowerCase();
            return logs.filter(log => (log.user || '').toLowerCase().includes(me) ||
                (log.details || '').toLowerCase().includes(me));
        }
        return logs;
    }, [logs, isEmployee, props.currentUserName]);
    // User options with event counts under the current server-side filters. Users seen in the
    // last 90 days (and the current selection) are kept with a 0 count so the list stays stable.
    const userOptions = (0, react_1.useMemo)(() => {
        const extra = filters.user !== 'All' && filters.user !== EventLogUtils_1.MY_ACTIVITY_KEY ? knownUsers.concat([filters.user]) : knownUsers;
        return (0, EventLogUtils_1.buildUserOptions)(roleBasedFilteredLogs, extra);
    }, [roleBasedFilteredLogs, knownUsers, filters.user]);
    // 2. Apply client-side search, asset type, user, status filters, and sorting
    const filteredLogs = (0, react_1.useMemo)(() => {
        const userFilter = filters.user === EventLogUtils_1.MY_ACTIVITY_KEY ? props.currentUserName : filters.user;
        return (0, EventLogUtils_1.applyClientFilters)(roleBasedFilteredLogs, { ...filters, user: userFilter });
    }, [roleBasedFilteredLogs, filters.searchQuery, filters.assetType, filters.user, filters.status, filters.sortOrder, props.currentUserName]);
    const totalItems = filteredLogs.length;
    const totalPages = Math.ceil(totalItems / PAGE_SIZE);
    const activePage = Math.min(currentPage, Math.max(1, totalPages));
    const startIndex = (activePage - 1) * PAGE_SIZE;
    const paginatedLogs = filteredLogs.slice(startIndex, startIndex + PAGE_SIZE);
    return (React.createElement("div", { style: { marginTop: '20px' } },
        props.errorMessage && (React.createElement("div", { style: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '15px', borderRadius: '8px', marginBottom: '15px' } },
            React.createElement("strong", null, strings.EventStream.NoticeLabel),
            " ",
            props.errorMessage)),
        React.createElement(EventFilters_1.EventFilters, { filters: filters, onChange: setFilters, onClear: handleClearFilters, actionsList: actionsList, assetTypesList: assetTypesList, userOptions: userOptions, currentUserName: props.currentUserName }),
        loading ? (React.createElement("p", null, strings.EventStream.LoadingAuditLogs)) : roleBasedFilteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, isEmployee ? strings.EventStream.NoEventsForYou : strings.EventStream.NoEventsRecorded)) : filteredLogs.length === 0 ? (React.createElement("p", { style: { fontStyle: 'italic', color: 'var(--text-muted)' } }, strings.EventStream.NoEventsMatchFilters)) : (React.createElement(React.Fragment, null,
            React.createElement(DetailsList_1.DetailsList, { items: paginatedLogs, columns: columns, setKey: "set", layoutMode: DetailsList_1.DetailsListLayoutMode.justified, selectionMode: DetailsList_1.SelectionMode.none }),
            totalPages > 1 && (React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationContainer },
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationInfo }, (0, LocalizationUtils_1.formatString)(strings.Pagination.ShowingEntries, startIndex + 1, Math.min(startIndex + PAGE_SIZE, totalItems), totalItems)),
                React.createElement("div", { className: InventoryManagement_module_scss_1.default.paginationControls },
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(1), title: strings.Pagination.FirstPage }, "\u00AB"),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === 1, onClick: () => setCurrentPage(prev => prev - 1), title: strings.Pagination.PreviousPage }, "\u2039"),
                    (0, EventLogUtils_1.getPageNumbers)(activePage, totalPages).map((page, idx) => {
                        if (page === '...') {
                            return React.createElement("span", { key: `ellipsis-${idx}`, style: { padding: '0 8px', color: 'var(--text-muted)' } }, "...");
                        }
                        return (React.createElement("button", { key: page, className: `${InventoryManagement_module_scss_1.default.paginationButton} ${activePage === page ? InventoryManagement_module_scss_1.default.active : ''}`, onClick: () => setCurrentPage(page) }, page));
                    }),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(prev => prev + 1), title: strings.Pagination.NextPage }, "\u203A"),
                    React.createElement("button", { className: InventoryManagement_module_scss_1.default.paginationButton, disabled: activePage === totalPages, onClick: () => setCurrentPage(totalPages), title: strings.Pagination.LastPage }, "\u00BB"))))))));
};
exports.EventStream = EventStream;
//# sourceMappingURL=EventStream.js.map
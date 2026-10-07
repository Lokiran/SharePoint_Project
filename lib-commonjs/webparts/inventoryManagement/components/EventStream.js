"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventStream = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const Styling_1 = require("@fluentui/react/lib/Styling");
const Button_1 = require("@fluentui/react/lib/Button");
const Icon_1 = require("@fluentui/react/lib/Icon");
const Shimmer_1 = require("@fluentui/react/lib/Shimmer");
const RoleUtils_1 = require("../utils/RoleUtils");
const EventFilters_1 = require("./EventFilters");
const EventTimeline_1 = require("./events/EventTimeline");
const Pager_1 = require("./common/Pager");
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
const css = (0, Styling_1.mergeStyleSets)({
    root: { color: 'var(--text-main, #242424)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 16, flexWrap: 'wrap', marginBottom: 16 },
    title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
    subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
    notice: { color: '#991b1b', backgroundColor: '#fee2e2', padding: '12px 16px', borderRadius: 10, marginBottom: 16 },
    resultLine: { fontSize: 13, color: 'var(--text-muted, #616161)', margin: '0 0 12px' },
    empty: { padding: '48px 16px', textAlign: 'center', color: 'var(--text-muted, #616161)', border: '1px dashed rgba(128, 128, 128, 0.3)', borderRadius: 12 },
    loading: { display: 'flex', flexDirection: 'column', gap: 18, padding: '8px 0' },
    pager: { marginTop: 12 }
});
const EventStream = (props) => {
    const [filters, setFilters] = (0, react_1.useState)(DEFAULT_FILTERS);
    const [logs, setLogs] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [currentPage, setCurrentPage] = (0, react_1.useState)(1);
    const [manualRefresh, setManualRefresh] = (0, react_1.useState)(0);
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
        props.refreshTrigger,
        manualRefresh
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
    // Day headings only make sense while the events are in date order.
    const inDateOrder = filters.sortOrder === 'NewestFirst' || filters.sortOrder === 'OldestFirst';
    return (React.createElement("div", { className: css.root },
        React.createElement("div", { className: css.header },
            React.createElement("div", null,
                React.createElement("h3", { className: css.title }, strings.Nav.EventStream),
                React.createElement("p", { className: css.subtitle }, strings.EventFeed.Subtitle)),
            React.createElement(Button_1.DefaultButton, { text: strings.EventFeed.Refresh, iconProps: { iconName: 'Refresh' }, onClick: () => setManualRefresh(n => n + 1), disabled: loading })),
        props.errorMessage && (React.createElement("div", { className: css.notice },
            React.createElement("strong", null, strings.EventStream.NoticeLabel),
            " ",
            props.errorMessage)),
        React.createElement(EventTimeline_1.ActivityPulse, { logs: filteredLogs, showPeople: canViewAuditDetails }),
        React.createElement(EventFilters_1.EventFilters, { filters: filters, onChange: setFilters, onClear: handleClearFilters, actionsList: actionsList, assetTypesList: assetTypesList, userOptions: userOptions, currentUserName: props.currentUserName }),
        loading ? (React.createElement("div", { className: css.loading, "aria-busy": "true", "aria-label": strings.EventStream.LoadingAuditLogs }, [0, 1, 2, 3].map(i => (React.createElement("div", { key: i },
            React.createElement(Shimmer_1.Shimmer, { width: "45%", styles: { root: { marginBottom: 8 } } }),
            React.createElement(Shimmer_1.Shimmer, { width: "80%" })))))) : filteredLogs.length === 0 ? (React.createElement("div", { className: css.empty },
            React.createElement(Icon_1.Icon, { iconName: roleBasedFilteredLogs.length === 0 ? 'ActivityFeed' : 'Search', style: { fontSize: 28, display: 'block', marginBottom: 8 } }),
            roleBasedFilteredLogs.length === 0
                ? (isEmployee ? strings.EventStream.NoEventsForYou : strings.EventStream.NoEventsRecorded)
                : strings.EventStream.NoEventsMatchFilters)) : (React.createElement(React.Fragment, null,
            React.createElement("p", { className: css.resultLine }, (0, LocalizationUtils_1.formatString)(strings.EventFeed.ResultEvents, totalItems, roleBasedFilteredLogs.length)),
            React.createElement(EventTimeline_1.EventTimeline, { logs: paginatedLogs, groupByDay: inDateOrder, showAudit: canViewAuditDetails }),
            React.createElement("div", { className: css.pager },
                React.createElement(Pager_1.Pager, { page: activePage, pageSize: PAGE_SIZE, totalItems: totalItems, onChange: setCurrentPage }))))));
};
exports.EventStream = EventStream;
//# sourceMappingURL=EventStream.js.map
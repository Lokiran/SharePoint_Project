import * as React from 'react';
import { Pivot, PivotItem, PrimaryButton, DefaultButton, ActionButton, MessageBar, MessageBarType, TextField, ProgressIndicator, Icon } from '@fluentui/react';
import { ListHealthService, LIST_DEFINITIONS } from '../services/ListHealthService';
import styles from '../components/InventoryManagement.module.scss';
import css from './ConfigPage.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
const CORE_LISTS = LIST_DEFINITIONS.filter(d => !d.optional);
const OPTIONAL_LISTS = LIST_DEFINITIONS.filter(d => d.optional);
const ROLE_GROUPS = [
    { group: 'MSFT Owners', role: () => strings.ConfigPage.RoleLabel_Owners, desc: () => strings.ConfigPage.RoleDesc_Owners },
    { group: 'MSFT Members', role: () => strings.ConfigPage.RoleLabel_Members, desc: () => strings.ConfigPage.RoleDesc_Members },
    { group: 'MSFT Visitors', role: () => strings.ConfigPage.RoleLabel_Visitors, desc: () => strings.ConfigPage.RoleDesc_Visitors }
];
// Resolved on every render so the runtime language switcher takes effect immediately.
const getListText = (key) => {
    const s = strings.ConfigPage;
    switch (key) {
        case 'inventory': return { title: s.ListTitle_InventoryList, desc: s.ListDesc_InventoryList, tag: s.SchemaAssetDatabase };
        case 'request': return { title: s.ListTitle_RequestList, desc: s.ListDesc_RequestList, tag: s.SchemaApprovalWorkflows };
        case 'returnRequest': return { title: s.ListTitle_AssetReturnRequestList, desc: s.ListDesc_AssetReturnRequestList, tag: s.SchemaReturnsHandling };
        case 'mapping': return { title: s.ListTitle_MappingList, desc: s.ListDesc_MappingList, tag: s.SchemaCustodyTracking };
        case 'eventLog': return { title: s.ListTitle_EventLogList, desc: s.ListDesc_EventLogList, tag: s.SchemaAuditTrail };
        case 'incident': return { title: s.ListTitle_IncidentList, desc: s.ListDesc_IncidentList };
        case 'employee': return { title: s.ListTitle_EmployeeList, desc: s.ListDesc_EmployeeList };
        case 'replacement': return { title: s.ListTitle_ReplacementList, desc: s.ListDesc_ReplacementList };
        default: return { title: key, desc: '' };
    }
};
const formatDate = (iso) => {
    if (!iso)
        return '—';
    const d = new Date(iso);
    return isNaN(d.getTime()) ? '—' : d.toLocaleString();
};
const StatusPill = ({ status, testing }) => {
    if (testing) {
        return React.createElement("span", { className: `${css.pill} ${css.pillInfo}` },
            React.createElement(Icon, { iconName: "ProgressLoopOuter", className: css.spin }),
            " ",
            strings.ConfigPage.StatusVerifying);
    }
    switch (status) {
        case 'healthy': return React.createElement("span", { className: `${css.pill} ${css.pillGood}` },
            React.createElement(Icon, { iconName: "Completed" }),
            " ",
            strings.ConfigPage.StatusConnected);
        case 'warning': return React.createElement("span", { className: `${css.pill} ${css.pillWarn}` },
            React.createElement(Icon, { iconName: "Warning" }),
            " ",
            strings.ConfigPage.StatusWarning);
        case 'missing': return React.createElement("span", { className: `${css.pill} ${css.pillBad}` },
            React.createElement(Icon, { iconName: "Blocked2" }),
            " ",
            strings.ConfigPage.StatusMissing);
        case 'error': return React.createElement("span", { className: `${css.pill} ${css.pillBad}` },
            React.createElement(Icon, { iconName: "ErrorBadge" }),
            " ",
            strings.ConfigPage.StatusFailed);
        default: return React.createElement("span", { className: `${css.pill} ${css.pillNeutral}` }, strings.ConfigPage.StatusNotVerified);
    }
};
const collectIssues = (results) => {
    const s = strings.ConfigPage;
    const issues = [];
    LIST_DEFINITIONS.forEach(def => {
        const r = results[def.key];
        if (!r)
            return;
        const title = getListText(def.key).title;
        const add = (severity, text) => issues.push({ severity, text, listKey: def.key });
        if (r.status === 'error') {
            add('bad', formatString(s.Issue_Error, title, r.error || ''));
        }
        else if (!r.resolvedTitle) {
            if (def.autoCreated) {
                add('warn', formatString(s.Issue_AutoCreated, title));
            }
            else {
                add(def.optional ? 'warn' : 'bad', formatString(s.Issue_Missing, title, def.candidates[0]));
            }
        }
        else {
            if (r.missingColumns.length > 0) {
                add('warn', formatString(s.Issue_Columns, title, r.missingColumns.length, r.missingColumns.join(', ')));
            }
            if (!r.canWrite) {
                add('bad', formatString(s.Issue_Write, title));
            }
        }
    });
    return issues.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === 'bad' ? -1 : 1));
};
export const ConfigPage = (props) => {
    const { state, actions } = props;
    const s = strings.ConfigPage;
    const cached = ListHealthService.lastReport;
    const [results, setResults] = React.useState(() => {
        const map = {};
        if (cached)
            cached.results.forEach(r => { map[r.key] = r; });
        return map;
    });
    const [environment, setEnvironment] = React.useState(cached ? cached.environment : undefined);
    const [checkedAt, setCheckedAt] = React.useState(cached ? cached.checkedAt : undefined);
    const [runningAll, setRunningAll] = React.useState(false);
    const [runError, setRunError] = React.useState();
    const [testing, setTesting] = React.useState({});
    const [expanded, setExpanded] = React.useState({});
    const [groups, setGroups] = React.useState({});
    const [loadingGroups, setLoadingGroups] = React.useState({});
    const [memberFilter, setMemberFilter] = React.useState('');
    const mounted = React.useRef(true);
    React.useEffect(() => () => { mounted.current = false; }, []);
    const runHealthCheck = React.useCallback(async () => {
        setRunningAll(true);
        setRunError(undefined);
        try {
            const report = await ListHealthService.runHealthCheck();
            if (!mounted.current)
                return;
            const map = {};
            report.results.forEach(r => { map[r.key] = r; });
            setResults(map);
            setEnvironment(report.environment);
            setCheckedAt(report.checkedAt);
        }
        catch (e) {
            if (mounted.current)
                setRunError(e && e.message ? e.message : String(e));
        }
        finally {
            if (mounted.current)
                setRunningAll(false);
        }
    }, []);
    const testList = async (def) => {
        setTesting(prev => ({ ...prev, [def.key]: true }));
        const r = await ListHealthService.checkList(def);
        if (!mounted.current)
            return;
        setResults(prev => ({ ...prev, [def.key]: r }));
        setTesting(prev => ({ ...prev, [def.key]: false }));
        if (r.status !== 'healthy')
            setExpanded(prev => ({ ...prev, [def.key]: true }));
        const report = ListHealthService.lastReport;
        if (report) {
            report.results = report.results.filter(x => x.key !== r.key).concat([r]);
        }
    };
    const loadGroup = async (groupName) => {
        setLoadingGroups(prev => ({ ...prev, [groupName]: true }));
        const info = await ListHealthService.loadGroup(groupName);
        if (!mounted.current)
            return;
        setGroups(prev => ({ ...prev, [groupName]: info }));
        setLoadingGroups(prev => ({ ...prev, [groupName]: false }));
    };
    const loadAllGroups = () => {
        ROLE_GROUPS.forEach(g => { loadGroup(g.group).catch(() => undefined); });
    };
    const exportReport = () => {
        const payload = {
            checkedAt,
            environment,
            lists: LIST_DEFINITIONS.map(def => ({
                name: getListText(def.key).title,
                expectedTitles: def.candidates,
                optional: !!def.optional,
                ...(results[def.key] || { status: 'not-checked' })
            })),
            groups: Object.keys(groups).map(k => ({ name: k, exists: groups[k].exists, memberCount: groups[k].members.length, error: groups[k].error }))
        };
        const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `inventory-health-${new Date().toISOString().substring(0, 10)}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };
    // First visit this session: run the check automatically so the admin lands on live data.
    React.useEffect(() => {
        if (!ListHealthService.lastReport) {
            runHealthCheck().catch(() => undefined);
        }
    }, [runHealthCheck]);
    // Load group membership the first time the RBAC tab is opened.
    React.useEffect(() => {
        if (state.configSelectedTab === 'rbac' && Object.keys(groups).length === 0) {
            loadAllGroups();
        }
    }, [state.configSelectedTab]);
    const hasResults = Object.keys(results).length > 0;
    const coreResults = CORE_LISTS.map(d => results[d.key]).filter(Boolean);
    const coreReady = coreResults.filter(r => r.status === 'healthy').length;
    const missingColumnCount = coreResults.reduce((sum, r) => sum + (r.resolvedTitle ? r.missingColumns.length : 0), 0);
    const writeIssues = coreResults.filter(r => r.resolvedTitle && !r.canWrite).length;
    const optionalReady = OPTIONAL_LISTS.filter(d => { const r = results[d.key]; return r && r.resolvedTitle; }).length;
    const issues = collectIssues(results);
    const criticalCount = issues.filter(i => i.severity === 'bad').length;
    const warningCount = issues.length - criticalCount;
    const openIssue = (listKey) => {
        setExpanded(prev => ({ ...prev, [listKey]: true }));
        actions.onTabChange('connections');
    };
    const toneFor = (ok, bad) => !hasResults ? css.toneNeutral : ok ? css.toneGood : bad ? css.toneBad : css.toneWarn;
    const checkButtons = (React.createElement("div", { className: css.actions },
        React.createElement(PrimaryButton, { text: runningAll ? s.RunningHealthCheck : s.RunHealthCheckButton, iconProps: { iconName: 'Health' }, onClick: () => { runHealthCheck().catch(() => undefined); }, disabled: runningAll }),
        React.createElement(DefaultButton, { text: s.ExportReportButton, iconProps: { iconName: 'Download' }, onClick: exportReport, disabled: !hasResults || runningAll })));
    const renderOverview = () => (React.createElement(React.Fragment, null,
        React.createElement("div", { className: css.panel },
            React.createElement("div", { className: css.panelHeader },
                React.createElement("div", null,
                    React.createElement("h4", null, s.OverviewTitle),
                    React.createElement("p", null, checkedAt ? formatString(s.LastChecked, formatDate(checkedAt)) : s.NeverChecked)),
                checkButtons),
            runError && (React.createElement(MessageBar, { messageBarType: MessageBarType.error, onDismiss: () => setRunError(undefined), styles: { root: { marginBottom: 12 } } }, runError)),
            runningAll ? (React.createElement(ProgressIndicator, { label: s.RunningHealthCheck, styles: { root: { marginBottom: 16 } } })) : (React.createElement("div", { className: `${css.banner} ${!hasResults ? css.bannerNeutral : criticalCount > 0 ? css.bannerBad : warningCount > 0 ? css.bannerWarn : css.bannerGood}` },
                React.createElement(Icon, { className: css.bannerIcon, iconName: !hasResults ? 'Info' : criticalCount > 0 ? 'StatusErrorFull' : warningCount > 0 ? 'WarningSolid' : 'CompletedSolid' }),
                React.createElement("div", { className: css.bannerText },
                    React.createElement("strong", null, !hasResults
                        ? s.NeverChecked
                        : criticalCount > 0
                            ? formatString(s.OverallCritical, criticalCount)
                            : warningCount > 0
                                ? formatString(s.OverallWarning, warningCount)
                                : s.OverallHealthy),
                    React.createElement("span", { className: css.muted }, hasResults && issues.length > 0 ? s.OverallHint : s.OverviewSubtitle)))),
            React.createElement("div", { className: css.tiles }, [
                { icon: 'Database', label: s.Tile_CoreLists, value: `${coreReady}/${CORE_LISTS.length}`, tone: toneFor(coreReady === CORE_LISTS.length, coreResults.some(r => r.status === 'missing' || r.status === 'error')) },
                { icon: 'TableGroup', label: s.Tile_SchemaIssues, value: String(missingColumnCount), tone: toneFor(missingColumnCount === 0, false) },
                { icon: 'Lock', label: s.Tile_PermissionIssues, value: String(writeIssues), tone: toneFor(writeIssues === 0, writeIssues > 0) },
                { icon: 'Puzzle', label: s.Tile_OptionalLists, value: `${optionalReady}/${OPTIONAL_LISTS.length}`, tone: toneFor(optionalReady === OPTIONAL_LISTS.length, false) }
            ].map(tile => (React.createElement("div", { key: tile.icon, className: `${css.tile} ${tile.tone}` },
                React.createElement("div", { className: css.tileHead },
                    React.createElement(Icon, { iconName: tile.icon }),
                    " ",
                    tile.label),
                React.createElement("div", { className: css.tileValue }, hasResults ? tile.value : '—')))))),
        React.createElement("div", { className: css.twoCol },
            React.createElement("div", { className: css.panel },
                React.createElement("div", { className: css.panelHeader },
                    React.createElement("div", null,
                        React.createElement("h4", null, s.IssuesTitle)),
                    issues.length > 0 && (React.createElement(ActionButton, { iconProps: { iconName: 'Database' }, text: s.ViewDetails, onClick: () => actions.onTabChange('connections') }))),
                !hasResults ? (React.createElement("span", { className: css.muted }, runningAll ? s.RunningHealthCheck : s.NeverChecked)) : issues.length === 0 ? (React.createElement("ul", { className: css.issueList },
                    React.createElement("li", null,
                        React.createElement(Icon, { iconName: "CompletedSolid", className: css.issueIconGood }),
                        " ",
                        s.NoIssues))) : (React.createElement("ul", { className: css.issueList }, issues.map((issue, i) => (React.createElement("li", { key: i },
                    React.createElement("button", { type: "button", className: css.issueButton, onClick: () => openIssue(issue.listKey) },
                        React.createElement(Icon, { iconName: issue.severity === 'bad' ? 'StatusErrorFull' : 'WarningSolid', className: issue.severity === 'bad' ? css.issueIconBad : css.issueIconWarn }),
                        React.createElement("span", { className: css.issueText }, issue.text),
                        React.createElement(Icon, { iconName: "ChevronRight", className: css.issueChevron })))))))),
            React.createElement("div", { className: css.panel },
                React.createElement("div", { className: css.panelHeader },
                    React.createElement("div", null,
                        React.createElement("h4", null, s.EnvironmentTitle))),
                environment ? (React.createElement("table", { className: css.envTable },
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            React.createElement("th", null, s.Env_Site),
                            React.createElement("td", null,
                                environment.siteTitle,
                                React.createElement("br", null),
                                React.createElement("span", { className: css.muted }, environment.siteUrl))),
                        React.createElement("tr", null,
                            React.createElement("th", null, s.Env_User),
                            React.createElement("td", null,
                                environment.userName,
                                React.createElement("br", null),
                                React.createElement("span", { className: css.muted }, environment.userEmail))),
                        React.createElement("tr", null,
                            React.createElement("th", null, s.Env_SiteAdmin),
                            React.createElement("td", null, environment.isSiteAdmin ? s.Yes : s.No)),
                        React.createElement("tr", null,
                            React.createElement("th", null, s.Env_Language),
                            React.createElement("td", null, environment.uiCulture)),
                        React.createElement("tr", null,
                            React.createElement("th", null, s.Env_TotalLists),
                            React.createElement("td", null, environment.totalSiteLists))))) : (React.createElement("span", { className: css.muted }, s.NeverChecked))))));
    const renderListCard = (def) => {
        const text = getListText(def.key);
        const r = results[def.key];
        const isTesting = !!testing[def.key] || (runningAll && !r);
        const isExpanded = !!expanded[def.key];
        const access = !r || !r.resolvedTitle ? undefined : r.canWrite ? s.AccessReadWrite : r.canRead ? s.AccessReadOnly : s.AccessNone;
        return (React.createElement("div", { key: def.key, className: css.listCard },
            React.createElement("div", { className: css.listCardTop },
                React.createElement("div", { style: { flex: '1 1 300px', minWidth: 0 } },
                    React.createElement("h5", { className: css.listTitle },
                        text.title,
                        React.createElement("span", { className: css.internal },
                            "(",
                            r && r.resolvedTitle ? r.resolvedTitle : def.candidates[0],
                            ")"),
                        def.optional && React.createElement("span", { className: css.badge }, s.OptionalBadge),
                        def.autoCreated && React.createElement("span", { className: css.badge }, s.AutoCreatedBadge)),
                    React.createElement("span", { className: css.muted }, text.desc)),
                React.createElement("div", { className: css.actions },
                    React.createElement(StatusPill, { status: r ? r.status : undefined, testing: isTesting }),
                    React.createElement(DefaultButton, { text: s.TestLiveButton, iconProps: { iconName: 'PlugConnected' }, onClick: () => { testList(def).catch(() => undefined); }, disabled: isTesting || runningAll }))),
            r && r.resolvedTitle && (React.createElement("div", { className: css.metrics },
                React.createElement("span", null,
                    s.Items,
                    React.createElement("strong", null, r.itemCount)),
                React.createElement("span", null,
                    s.LastModified,
                    React.createElement("strong", null, formatDate(r.lastModified))),
                React.createElement("span", null,
                    s.Access,
                    React.createElement("strong", null, access)),
                def.requiredColumns.length > 0 && (React.createElement("span", null,
                    s.Columns,
                    React.createElement("strong", null, formatString(s.ColumnsSummary, r.presentColumns.length, def.requiredColumns.length)))),
                React.createElement("span", null,
                    s.ResponseTime,
                    React.createElement("strong", null,
                        r.durationMs,
                        " ms")))),
            r && r.error && (React.createElement("div", { className: css.errorBox },
                React.createElement("strong", null, s.ErrorLabel),
                " ",
                r.error)),
            r && (React.createElement("div", { className: css.actions, style: { marginTop: 6 } },
                React.createElement(ActionButton, { iconProps: { iconName: isExpanded ? 'ChevronUp' : 'ChevronDown' }, text: s.ViewDetails, onClick: () => setExpanded(prev => ({ ...prev, [def.key]: !isExpanded })) }),
                r.url && (React.createElement(ActionButton, { iconProps: { iconName: 'OpenInNewWindow' }, text: s.OpenList, href: r.url, target: "_blank" })))),
            r && isExpanded && (React.createElement("div", { className: css.details },
                React.createElement("div", null,
                    React.createElement("strong", null,
                        s.TriedNames,
                        ":"),
                    " ",
                    def.candidates.map(c => `"${c}"`).join(', ')),
                !r.resolvedTitle && (React.createElement("div", null,
                    React.createElement("strong", null,
                        s.SimilarLists,
                        ":"),
                    ' ',
                    r.suggestions.length > 0 ? r.suggestions.map(x => `"${x}"`).join(', ') : '—',
                    React.createElement("div", { className: css.muted }, formatString(s.RenameHint, def.candidates[0])))),
                r.resolvedTitle && r.missingColumns.length > 0 && (React.createElement("div", null,
                    React.createElement("strong", null,
                        s.MissingColumnsLabel,
                        ":"),
                    React.createElement("div", { className: css.chips }, r.missingColumns.map(c => React.createElement("span", { key: c, className: `${css.chip} ${css.chipBad}` }, c))))),
                r.resolvedTitle && r.missingColumns.length === 0 && def.requiredColumns.length > 0 && (React.createElement("div", null, s.AllColumnsPresent))))));
    };
    const renderConnections = () => (React.createElement("div", { className: css.panel },
        React.createElement("div", { className: css.panelHeader },
            React.createElement("div", null,
                React.createElement("h4", null, s.ConnectionsTitle),
                React.createElement("p", null, s.ConnectionsDesc)),
            checkButtons),
        React.createElement("div", { className: css.groupHeading }, s.CoreListsGroup),
        CORE_LISTS.map(renderListCard),
        React.createElement("div", { className: css.groupHeading }, s.OptionalListsGroup),
        OPTIONAL_LISTS.map(renderListCard)));
    const renderSchema = () => (React.createElement("div", { className: css.panel },
        React.createElement("div", { className: css.panelHeader },
            React.createElement("div", null,
                React.createElement("h4", null, s.SchemaTitle),
                React.createElement("p", null, s.SchemaDesc)),
            checkButtons),
        !hasResults && (React.createElement(MessageBar, { messageBarType: MessageBarType.info, styles: { root: { marginBottom: 12 } } }, s.SchemaUnchecked)),
        CORE_LISTS.map(def => {
            const r = results[def.key];
            const text = getListText(def.key);
            const validated = !!(r && r.resolvedTitle);
            return (React.createElement("div", { key: def.key, className: css.schemaBlock },
                React.createElement("h5", null,
                    r && r.resolvedTitle ? r.resolvedTitle : def.candidates[0],
                    text.tag && React.createElement("span", { className: css.muted }, text.tag),
                    r && React.createElement(StatusPill, { status: r.status })),
                React.createElement("div", { className: css.chips }, def.requiredColumns.map(col => {
                    const present = !!r && validated && r.presentColumns.indexOf(col.name) >= 0;
                    const missing = !!r && validated && r.missingColumns.indexOf(col.name) >= 0;
                    const hint = col.aliases && col.aliases.length > 0 ? formatString(s.SchemaAliasesHint, col.aliases.join(', ')) : undefined;
                    return (React.createElement("span", { key: col.name, title: hint, className: `${css.chip} ${present ? css.chipGood : ''} ${missing ? css.chipBad : ''}` },
                        present && React.createElement(Icon, { iconName: "CheckMark" }),
                        missing && React.createElement(Icon, { iconName: "Cancel" }),
                        col.name));
                }))));
        })));
    const renderRbac = () => {
        const filter = memberFilter.trim().toLowerCase();
        return (React.createElement("div", { className: css.panel },
            React.createElement("div", { className: css.panelHeader },
                React.createElement("div", null,
                    React.createElement("h4", null, s.RbacTitle),
                    React.createElement("p", null,
                        s.RbacDesc,
                        " ",
                        s.RbacRoleRule)),
                React.createElement("div", { className: css.actions },
                    React.createElement(TextField, { placeholder: s.FilterMembersPlaceholder, value: memberFilter, onChange: (_, v) => setMemberFilter(v || ''), iconProps: { iconName: 'Filter' }, styles: { root: { width: 220 } } }),
                    React.createElement(DefaultButton, { text: s.LoadAllGroupsButton, iconProps: { iconName: 'Refresh' }, onClick: loadAllGroups }))),
            ROLE_GROUPS.map(item => {
                const isLoading = !!loadingGroups[item.group];
                const info = groups[item.group];
                const members = info ? info.members.filter(m => !filter || m.name.toLowerCase().indexOf(filter) >= 0 || m.email.toLowerCase().indexOf(filter) >= 0) : [];
                return (React.createElement("div", { key: item.group, className: css.listCard },
                    React.createElement("div", { className: css.listCardTop },
                        React.createElement("div", { style: { flex: '1 1 300px' } },
                            React.createElement("h5", { className: css.listTitle },
                                item.group,
                                React.createElement("span", { className: css.roleTag }, item.role()),
                                info && info.exists && !info.error && React.createElement("span", { className: `${css.pill} ${css.pillNeutral}` }, formatString(s.MemberCount, info.members.length)),
                                info && info.currentUserIsMember && React.createElement("span", { className: `${css.pill} ${css.pillInfo}` }, s.YouAreMember)),
                            React.createElement("span", { className: css.muted }, item.desc())),
                        React.createElement(DefaultButton, { text: isLoading ? s.LoadingButton : s.ViewMembersButton, iconProps: { iconName: 'People' }, onClick: () => { loadGroup(item.group).catch(() => undefined); }, disabled: isLoading })),
                    info && !info.exists && React.createElement("div", { className: css.errorBox }, s.GroupNotFound),
                    info && info.exists && info.error && React.createElement("div", { className: css.errorBox }, formatString(s.GroupLoadError, info.error)),
                    info && info.exists && !info.error && (info.members.length === 0 ? (React.createElement("div", { className: css.muted, style: { marginTop: 10, fontStyle: 'italic' } }, s.NoMembersFound)) : (React.createElement("div", { className: css.chips, style: { marginTop: 10 } }, members.map((m, idx) => (React.createElement("span", { key: idx, className: css.chip, title: m.email },
                        React.createElement(Icon, { iconName: "Contact" }),
                        " ",
                        m.name))))))));
            })));
    };
    const renderOperations = () => (React.createElement("div", { className: css.panel },
        React.createElement("div", { className: css.panelHeader },
            React.createElement("div", null,
                React.createElement("h4", null, s.OperationsTitle),
                React.createElement("p", null,
                    s.OperationsDescBefore,
                    " ",
                    React.createElement("strong", null, s.ListTitle_MappingList),
                    ". ",
                    s.OperationsDescAfter))),
        React.createElement("div", { className: css.actions, style: { marginBottom: 15 } },
            React.createElement(PrimaryButton, { text: state.syncInProgress ? s.SyncButtonProcessing : s.SyncButtonDefault, iconProps: { iconName: 'Sync' }, onClick: actions.onSyncAssignedAssets, disabled: state.syncInProgress }),
            React.createElement(DefaultButton, { text: state.syncInProgress ? s.DiagnosticsButtonChecking : s.DiagnosticsButtonDefault, iconProps: { iconName: 'Database' }, onClick: actions.onRunDiagnostics, disabled: state.syncInProgress })),
        state.syncMessage && (React.createElement(MessageBar, { messageBarType: state.syncMessageType, onDismiss: actions.onDismissSyncMessage, styles: { root: { marginBottom: 15, borderRadius: 6 } } }, state.syncMessage)),
        state.diagnosticInfo && (React.createElement("div", { style: { marginTop: 15 } },
            React.createElement("span", { style: { display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: 6 } }, s.DiagnosticLogLabel),
            React.createElement("textarea", { readOnly: true, value: state.diagnosticInfo, rows: 10, className: css.diagnosticLog })))));
    const tab = state.configSelectedTab || 'overview';
    return (React.createElement("div", null,
        React.createElement("div", { className: styles.cardHeader },
            React.createElement("h3", null, s.HeaderTitle),
            React.createElement("p", { style: { color: 'var(--text-muted)', margin: '4px 0 0 0', fontSize: '0.85rem' } }, s.HeaderSubtitle)),
        React.createElement("div", { className: css.configTabs },
            React.createElement(Pivot, { selectedKey: tab, onLinkClick: (item) => actions.onTabChange(item ? item.props.itemKey || 'overview' : 'overview'), styles: { root: { marginBottom: '20px', borderBottom: '1px solid rgba(128,128,128,0.1)' } } },
                React.createElement(PivotItem, { headerText: s.TabOverview, itemKey: "overview", itemIcon: "Health" }),
                React.createElement(PivotItem, { headerText: s.TabListConnections, itemKey: "connections", itemIcon: "Database", itemCount: issues.length > 0 ? issues.length : undefined }),
                React.createElement(PivotItem, { headerText: s.TabSchemaGuides, itemKey: "schema", itemIcon: "TableGroup" }),
                React.createElement(PivotItem, { headerText: s.TabRbacGroups, itemKey: "rbac", itemIcon: "Permissions" }),
                React.createElement(PivotItem, { headerText: s.TabSyncOperations, itemKey: "operations", itemIcon: "Sync" }))),
        tab === 'overview' && renderOverview(),
        tab === 'connections' && renderConnections(),
        tab === 'schema' && renderSchema(),
        tab === 'rbac' && renderRbac(),
        tab === 'operations' && renderOperations()));
};
//# sourceMappingURL=ConfigPage.js.map
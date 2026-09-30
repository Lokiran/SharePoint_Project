"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const react_1 = require("@fluentui/react");
const Styling_1 = require("@fluentui/react/lib/Styling");
const NotificationUtils_1 = require("../utils/NotificationUtils");
const PAGE_SIZE = 25;
const GROUP_ORDER = ['today', 'yesterday', 'week', 'older'];
const css = (0, Styling_1.mergeStyleSets)({
    root: { marginTop: 8, color: 'var(--text-main, #242424)' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
    title: { margin: 0, fontSize: 22, fontWeight: 600, lineHeight: '28px' },
    subtitle: { margin: '4px 0 0', fontSize: 14, color: 'var(--text-muted, #616161)' },
    headerActions: { display: 'flex', gap: 4, flexWrap: 'wrap' },
    toolbar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 },
    chips: { display: 'flex', gap: 8, flexWrap: 'wrap' },
    chip: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        height: 32,
        padding: '0 12px',
        borderRadius: 16,
        border: '1px solid rgba(0, 0, 0, 0.14)',
        background: 'var(--surface-bg, #ffffff)',
        color: 'var(--text-main, #242424)',
        font: 'inherit',
        fontSize: 13,
        fontWeight: 600,
        cursor: 'pointer',
        selectors: {
            ':hover': { borderColor: 'rgba(0, 0, 0, 0.3)' },
            ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: 2 }
        }
    },
    chipActive: {
        background: '#0f6cbd',
        borderColor: '#0f6cbd',
        color: '#ffffff',
        selectors: { ':hover': { borderColor: '#0f6cbd' } }
    },
    chipCount: {
        minWidth: 20,
        height: 20,
        padding: '0 6px',
        borderRadius: 10,
        fontSize: 11,
        lineHeight: '20px',
        textAlign: 'center',
        boxSizing: 'border-box',
        background: 'rgba(0, 0, 0, 0.06)'
    },
    chipCountActive: { background: 'rgba(255, 255, 255, 0.25)' },
    search: { width: 260, maxWidth: '100%' },
    card: {
        background: 'var(--surface-bg, #ffffff)',
        border: '1px solid rgba(0, 0, 0, 0.1)',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: 'var(--card-shadow, 0 1px 2px rgba(0, 0, 0, 0.06))'
    },
    groupLabel: {
        margin: 0,
        padding: '10px 20px',
        fontSize: 12,
        fontWeight: 600,
        letterSpacing: '0.04em',
        textTransform: 'uppercase',
        color: 'var(--text-muted, #616161)',
        background: 'rgba(0, 0, 0, 0.025)',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)'
    },
    list: { listStyle: 'none', margin: 0, padding: 0 },
    row: {
        position: 'relative',
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 12px 14px 20px',
        cursor: 'pointer',
        borderBottom: '1px solid rgba(0, 0, 0, 0.06)',
        selectors: {
            ':hover': { background: 'rgba(0, 0, 0, 0.03)' },
            ':focus-visible': { outline: '2px solid #0f6cbd', outlineOffset: -2 },
            ':hover .notif-actions, :focus-within .notif-actions': { opacity: 1 }
        }
    },
    rowUnread: { background: 'rgba(15, 108, 189, 0.05)' },
    unreadDot: { position: 'absolute', left: 7, top: 26, width: 8, height: 8, borderRadius: '50%', background: '#0f6cbd' },
    iconWrap: {
        width: 36,
        height: 36,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        fontSize: 16
    },
    body: { flex: 1, minWidth: 0 },
    titleLine: { display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
    rowTitle: { fontSize: 14, lineHeight: '20px' },
    pill: {
        fontSize: 11,
        fontWeight: 600,
        padding: '1px 8px',
        borderRadius: 999,
        color: 'var(--text-muted, #616161)',
        border: '1px solid rgba(0, 0, 0, 0.12)'
    },
    message: {
        margin: '2px 0 0',
        fontSize: 13,
        lineHeight: '20px',
        color: 'var(--text-muted, #424242)',
        display: '-webkit-box',
        WebkitLineClamp: 2,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden'
    },
    openLink: { display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 13, fontWeight: 600 },
    side: { display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 2, flexShrink: 0 },
    time: { fontSize: 12, color: 'var(--text-muted, #616161)', whiteSpace: 'nowrap', paddingRight: 8, lineHeight: '20px' },
    actions: { display: 'flex', opacity: 0.55, transition: 'opacity 0.15s ease' },
    showMore: { display: 'flex', justifyContent: 'center', padding: 8 },
    empty: { textAlign: 'center', padding: '56px 24px' },
    emptyIcon: {
        width: 56,
        height: 56,
        margin: '0 auto 14px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 24,
        color: '#0f6cbd',
        background: 'rgba(15, 108, 189, 0.1)'
    },
    emptyTitle: { margin: '0 0 4px', fontSize: 16, fontWeight: 600 },
    emptyText: { margin: 0, fontSize: 14, color: 'var(--text-muted, #616161)' },
    undo: { marginBottom: 12 }
});
const NotificationCenter = (props) => {
    const n = strings.Notifications;
    const [filter, setFilter] = React.useState('All');
    const [search, setSearch] = React.useState('');
    const [limit, setLimit] = React.useState(PAGE_SIZE);
    const [undo, setUndo] = React.useState();
    const undoTimer = React.useRef();
    React.useEffect(() => () => window.clearTimeout(undoTimer.current), []);
    React.useEffect(() => setLimit(PAGE_SIZE), [filter, search]);
    const all = props.isAllCleared ? [] : props.notifications;
    const counts = {
        All: all.length,
        Unread: all.filter(x => !x.isRead).length,
        Request: all.filter(x => x.category === 'Request').length,
        Assignment: all.filter(x => x.category === 'Assignment').length,
        Audit: all.filter(x => x.category === 'Audit').length
    };
    const query = search.trim().toLowerCase();
    const filtered = all.filter(x => {
        if (filter === 'Unread' && x.isRead)
            return false;
        if ((filter === 'Request' || filter === 'Assignment' || filter === 'Audit') && x.category !== filter)
            return false;
        return !query || `${x.title} ${x.message}`.toLowerCase().indexOf(query) >= 0;
    });
    const shown = filtered.slice(0, limit);
    const now = new Date();
    const groups = GROUP_ORDER
        .map(group => ({ group, items: shown.filter(x => (0, NotificationUtils_1.getDateGroup)(x.timestamp, now) === group) }))
        .filter(g => g.items.length > 0);
    const showUndo = (ids) => {
        if (!props.onRestoreNotifications)
            return;
        setUndo({ ids });
        window.clearTimeout(undoTimer.current);
        undoTimer.current = window.setTimeout(() => setUndo(undefined), 8000);
    };
    const dismiss = (id) => {
        props.onClearNotification(id);
        showUndo([id]);
    };
    const dismissShown = () => {
        const ids = filtered.map(x => x.id);
        if (ids.length === 0)
            return;
        if (props.onClearNotifications) {
            props.onClearNotifications(ids);
            showUndo(ids);
        }
        else {
            props.onClearAllNotifications(filter === 'Unread' ? 'All' : filter);
        }
    };
    const open = (x) => props.onNotificationAction(x.actionLink, x.id);
    const filters = [
        { key: 'All', label: n.TabAll },
        { key: 'Unread', label: n.FilterUnread },
        { key: 'Request', label: n.TabRequests },
        { key: 'Assignment', label: n.TabAssignments },
        { key: 'Audit', label: n.TabSystemAlerts }
    ];
    const subtitle = counts.Unread === 0
        ? n.NoUnreadSummary
        : counts.Unread === 1 ? n.UnreadSummaryOne : (0, LocalizationUtils_1.formatString)(n.UnreadSummary, counts.Unread);
    const renderEmpty = () => {
        let title = n.AllCaughtUpTitle;
        let text = (0, LocalizationUtils_1.formatString)(n.EmptyStateMessage, filters.filter(f => f.key === filter)[0].label);
        if (query) {
            title = n.NoSearchResultsTitle;
            text = (0, LocalizationUtils_1.formatString)(n.NoSearchResults, search.trim());
        }
        else if (filter === 'Unread') {
            text = n.EmptyUnread;
        }
        return (React.createElement("div", { className: css.empty },
            React.createElement("div", { className: css.emptyIcon },
                React.createElement(react_1.Icon, { iconName: query ? 'Search' : 'Ringer' })),
            React.createElement("h4", { className: css.emptyTitle }, title),
            React.createElement("p", { className: css.emptyText }, text)));
    };
    const renderRow = (x) => {
        const tone = (0, NotificationUtils_1.getNotificationTone)(x.type);
        const page = (0, NotificationUtils_1.getNotificationPage)(x, props.availablePages);
        return (React.createElement("li", { key: x.id, className: `${css.row} ${x.isRead ? '' : css.rowUnread}`, onClick: () => open(x), onKeyDown: e => {
                if (e.target === e.currentTarget && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    open(x);
                }
            }, tabIndex: 0, role: "button", "aria-label": `${x.isRead ? '' : n.FilterUnread + ': '}${x.title}. ${x.message}` },
            !x.isRead && React.createElement("span", { className: css.unreadDot, "aria-hidden": "true" }),
            React.createElement("span", { className: css.iconWrap, style: { backgroundColor: tone.soft, color: tone.color }, "aria-hidden": "true" },
                React.createElement(react_1.Icon, { iconName: tone.icon })),
            React.createElement("div", { className: css.body },
                React.createElement("div", { className: css.titleLine },
                    React.createElement("span", { className: css.rowTitle, style: { fontWeight: x.isRead ? 400 : 600 } }, x.title),
                    React.createElement("span", { className: css.pill }, (0, NotificationUtils_1.getCategoryLabel)(x.category))),
                React.createElement("p", { className: css.message }, x.message),
                page && props.onOpenPage && (React.createElement(react_1.Link, { className: css.openLink, onClick: e => {
                        e.stopPropagation();
                        props.onMarkAsRead(x.id);
                        props.onOpenPage(page.key);
                    } },
                    (0, LocalizationUtils_1.formatString)(n.OpenPage, page.text),
                    " ",
                    React.createElement(react_1.Icon, { iconName: "ChevronRight", style: { fontSize: 10 } })))),
            React.createElement("div", { className: css.side },
                React.createElement("span", { className: css.time, title: (0, NotificationUtils_1.formatFullTime)(x.timestamp) }, (0, NotificationUtils_1.formatRelativeTime)(x.timestamp, now)),
                React.createElement("div", { className: `${css.actions} notif-actions`, onClick: e => e.stopPropagation() },
                    x.isRead ? (props.onMarkAsUnread && (React.createElement(react_1.IconButton, { iconProps: { iconName: 'Mail' }, title: n.MarkAsUnread, ariaLabel: n.MarkAsUnread, onClick: () => props.onMarkAsUnread(x.id) }))) : (React.createElement(react_1.IconButton, { iconProps: { iconName: 'Read' }, title: n.MarkAsRead, ariaLabel: n.MarkAsRead, onClick: () => props.onMarkAsRead(x.id) })),
                    React.createElement(react_1.IconButton, { iconProps: { iconName: 'Cancel' }, title: n.DismissNotification, ariaLabel: n.DismissNotification, onClick: () => dismiss(x.id) })))));
    };
    return (React.createElement("div", { className: css.root },
        React.createElement("div", { className: css.header },
            React.createElement("div", null,
                React.createElement("h3", { className: css.title }, strings.Nav.Notifications),
                React.createElement("p", { className: css.subtitle }, subtitle)),
            React.createElement("div", { className: css.headerActions },
                React.createElement(react_1.ActionButton, { iconProps: { iconName: 'CheckMark' }, text: n.MarkAllAsRead, onClick: props.onMarkAllAsRead, disabled: counts.Unread === 0 }),
                React.createElement(react_1.ActionButton, { iconProps: { iconName: 'Clear' }, text: n.DismissShown, onClick: dismissShown, disabled: filtered.length === 0 }))),
        React.createElement("div", { className: css.toolbar },
            React.createElement("div", { className: css.chips, role: "group", "aria-label": n.FilterAriaLabel }, filters.map(f => {
                const active = f.key === filter;
                return (React.createElement("button", { key: f.key, type: "button", className: `${css.chip} ${active ? css.chipActive : ''}`, "aria-pressed": active, onClick: () => setFilter(f.key) },
                    f.label,
                    React.createElement("span", { className: `${css.chipCount} ${active ? css.chipCountActive : ''}` }, counts[f.key])));
            })),
            React.createElement(react_1.SearchBox, { className: css.search, placeholder: n.SearchPlaceholder, value: search, onChange: (_, v) => setSearch(v || ''), onClear: () => setSearch('') })),
        undo && (React.createElement(react_1.MessageBar, { className: css.undo, messageBarType: react_1.MessageBarType.info, onDismiss: () => setUndo(undefined), dismissButtonAriaLabel: strings.Common.Close, actions: React.createElement(react_1.ActionButton, { iconProps: { iconName: 'Undo' }, text: n.Undo, onClick: () => {
                    if (props.onRestoreNotifications)
                        props.onRestoreNotifications(undo.ids);
                    setUndo(undefined);
                } }), isMultiline: false }, undo.ids.length === 1 ? n.DismissedOne : (0, LocalizationUtils_1.formatString)(n.DismissedMany, undo.ids.length))),
        React.createElement("div", { className: css.card }, filtered.length === 0 ? renderEmpty() : (React.createElement(React.Fragment, null,
            groups.map(g => (React.createElement("section", { key: g.group, "aria-label": (0, NotificationUtils_1.getDateGroupLabel)(g.group) },
                React.createElement("h4", { className: css.groupLabel }, (0, NotificationUtils_1.getDateGroupLabel)(g.group)),
                React.createElement("ul", { className: css.list }, g.items.map(renderRow))))),
            filtered.length > shown.length && (React.createElement("div", { className: css.showMore },
                React.createElement(react_1.ActionButton, { iconProps: { iconName: 'ChevronDown' }, text: (0, LocalizationUtils_1.formatString)(n.ShowMore, filtered.length - shown.length), onClick: () => setLimit(limit + PAGE_SIZE) }))))))));
};
exports.NotificationCenter = NotificationCenter;
//# sourceMappingURL=NotificationCenter.js.map
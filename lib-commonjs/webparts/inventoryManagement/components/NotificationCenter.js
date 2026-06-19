"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationCenter = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("@fluentui/react");
const NotificationCenter = (props) => {
    const [filter, setFilter] = React.useState('All');
    const containerStackTokens = { childrenGap: 15 };
    const itemStackTokens = { childrenGap: 10 };
    const handleFilterClick = (item) => {
        if (item) {
            setFilter(item.props.itemKey || 'All');
        }
    };
    const filteredNotifications = props.notifications.filter(n => {
        if (filter === 'All')
            return true;
        if (filter === 'Request' && n.category === 'Request')
            return true;
        if (filter === 'Assignment' && n.category === 'Assignment')
            return true;
        if (filter === 'Audit' && n.category === 'Audit')
            return true;
        return false;
    });
    const unreadCount = filteredNotifications.filter(n => !n.isRead).length;
    const getTypeStyles = (type) => {
        switch (type) {
            case 'success':
                return {
                    backgroundColor: '#f0fdf4',
                    borderColor: '#22c55e',
                    iconName: 'StatusCircleCheckmark',
                    iconColor: '#16a34a'
                };
            case 'warning':
                return {
                    backgroundColor: '#fff7ed',
                    borderColor: '#f97316',
                    iconName: 'Warning',
                    iconColor: '#ea580c'
                };
            case 'error':
                return {
                    backgroundColor: '#fef2f2',
                    borderColor: '#ef4444',
                    iconName: 'ErrorBadge',
                    iconColor: '#dc2626'
                };
            case 'info':
            default:
                return {
                    backgroundColor: '#eff6ff',
                    borderColor: '#3b82f6',
                    iconName: 'Info',
                    iconColor: '#2563eb'
                };
        }
    };
    return (React.createElement(react_1.Stack, { tokens: containerStackTokens, style: { marginTop: '20px', padding: '5px' } },
        React.createElement(react_1.Stack, { horizontal: true, horizontalAlign: "space-between", verticalAlign: "center", styles: { root: { flexWrap: 'wrap', gap: '10px' } } },
            React.createElement(react_1.Pivot, { "aria-label": "Filter Notifications", selectedKey: filter, onLinkClick: handleFilterClick, styles: { root: { marginBottom: 0 } } },
                React.createElement(react_1.PivotItem, { headerText: "All", itemKey: "All" }),
                React.createElement(react_1.PivotItem, { headerText: "Requests", itemKey: "Request" }),
                React.createElement(react_1.PivotItem, { headerText: "Assignments", itemKey: "Assignment" }),
                React.createElement(react_1.PivotItem, { headerText: "System Alerts", itemKey: "Audit" })),
            React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                unreadCount > 0 && (React.createElement(react_1.DefaultButton, { iconProps: { iconName: 'CheckMark' }, text: "Mark all as read", onClick: props.onMarkAllAsRead, styles: { root: { borderRadius: '6px' } } })),
                filteredNotifications.length > 0 && (React.createElement(react_1.DefaultButton, { iconProps: { iconName: 'Clear' }, text: "Clear filtered", onClick: props.onClearAllNotifications, styles: { root: { borderRadius: '6px', color: '#b91c1c' } } })))),
        React.createElement(react_1.Stack, { tokens: itemStackTokens }, filteredNotifications.length === 0 ? (React.createElement("div", { style: {
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '50px 20px',
                backgroundColor: 'var(--surface-color, #ffffff)',
                borderRadius: '8px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
            } },
            React.createElement(react_1.Icon, { iconName: "Ringer", style: { fontSize: '48px', color: '#9ca3af', marginBottom: '15px' } }),
            React.createElement("h4", { style: { margin: '0 0 5px 0', color: '#1f2937' } }, "All Caught Up!"),
            React.createElement("p", { style: { margin: 0, color: '#6b7280', fontSize: '0.85rem' } },
                "No notifications found in the \"",
                filter === 'All' ? 'All' : filter + 's',
                "\" category."))) : (filteredNotifications.map((notif) => {
            const styles = getTypeStyles(notif.type);
            return (React.createElement("div", { key: notif.id, style: {
                    display: 'flex',
                    alignItems: 'flex-start',
                    padding: '16px',
                    backgroundColor: notif.isRead ? 'var(--surface-color, #ffffff)' : styles.backgroundColor,
                    borderLeft: `4px solid ${styles.borderColor}`,
                    borderRadius: '6px',
                    boxShadow: notif.isRead ? '0 1px 2px rgba(0,0,0,0.05)' : '0 2px 4px rgba(0,0,0,0.08)',
                    borderTop: '1px solid #f3f4f6',
                    borderRight: '1px solid #f3f4f6',
                    borderBottom: '1px solid #f3f4f6',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    gap: '12px'
                } },
                React.createElement(react_1.Icon, { iconName: styles.iconName, style: {
                        fontSize: '20px',
                        color: styles.iconColor,
                        marginTop: '2px'
                    } }),
                React.createElement("div", { style: { flexGrow: 1 } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
                        React.createElement("strong", { style: { color: '#111827', fontSize: '0.95rem' } }, notif.title),
                        !notif.isRead && (React.createElement("span", { style: {
                                width: '8px',
                                height: '8px',
                                backgroundColor: '#ef4444',
                                borderRadius: '50%',
                                display: 'inline-block',
                                boxShadow: '0 0 0 2px rgba(239, 68, 68, 0.4)'
                            } })),
                        React.createElement("span", { style: { fontSize: '0.75rem', color: '#6b7280', marginLeft: 'auto' } }, notif.timestamp)),
                    React.createElement("p", { style: { margin: '0 0 10px 0', color: '#4b5563', fontSize: '0.88rem', lineHeight: '1.4' } }, notif.message),
                    React.createElement(react_1.Stack, { horizontal: true, tokens: { childrenGap: 8 } },
                        React.createElement(react_1.PrimaryButton, { text: "View details", onClick: () => props.onNotificationAction(notif.actionLink, notif.id), styles: {
                                root: {
                                    height: '28px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    padding: '0 12px'
                                }
                            } }),
                        !notif.isRead && (React.createElement(react_1.DefaultButton, { text: "Mark as read", onClick: () => props.onMarkAsRead(notif.id), styles: {
                                root: {
                                    height: '28px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    padding: '0 12px'
                                }
                            } })))),
                React.createElement(react_1.IconButton, { iconProps: { iconName: 'Cancel' }, title: "Dismiss notification", ariaLabel: "Dismiss notification", onClick: () => props.onClearNotification(notif.id), styles: {
                        root: {
                            color: '#9ca3af',
                            marginTop: '-8px',
                            marginRight: '-8px'
                        },
                        rootHovered: {
                            color: '#4b5563',
                            backgroundColor: 'rgba(0,0,0,0.03)'
                        }
                    } })));
        })))));
};
exports.NotificationCenter = NotificationCenter;
//# sourceMappingURL=NotificationCenter.js.map
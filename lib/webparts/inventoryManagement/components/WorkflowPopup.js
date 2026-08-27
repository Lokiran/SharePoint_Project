import * as React from 'react';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton } from '@fluentui/react/lib/Button';
import { Icon } from '@fluentui/react/lib/Icon';
export const WorkflowPopup = (props) => {
    const { isOpen, title, stage, type, message, details, onDismiss } = props;
    if (!isOpen)
        return null;
    let iconName = 'CheckMark';
    let iconColor = '#15803d';
    let badgeBg = '#dcfce7';
    let badgeTextColor = '#166534';
    let borderColor = '#22c55e';
    let iconBg = '#f0fdf4';
    if (type === 'error' || (details?.status || '').toLowerCase().includes('reject') || (details?.status || '').toLowerCase().includes('declin')) {
        iconName = 'ErrorBadge';
        iconColor = '#b91c1c';
        badgeBg = '#fee2e2';
        badgeTextColor = '#991b1b';
        borderColor = '#ef4444';
        iconBg = '#fef2f2';
    }
    else if (type === 'warning' || (details?.status || '').toLowerCase().includes('pending')) {
        iconName = 'Clock';
        iconColor = '#b45309';
        badgeBg = '#fef3c7';
        badgeTextColor = '#92400e';
        borderColor = '#f59e0b';
        iconBg = '#fffbeb';
    }
    else if (type === 'info') {
        iconName = 'Info';
        iconColor = '#1d4ed8';
        badgeBg = '#dbeafe';
        badgeTextColor = '#1e40af';
        borderColor = '#3b82f6';
        iconBg = '#eff6ff';
    }
    return (React.createElement(Dialog, { hidden: !isOpen, onDismiss: onDismiss, dialogContentProps: {
            type: DialogType.normal,
            title: '',
        }, modalProps: {
            isBlocking: true,
            styles: {
                main: {
                    maxWidth: '520px',
                    minWidth: '340px',
                    borderRadius: '16px',
                    padding: '24px 28px',
                    borderTop: `5px solid ${borderColor}`,
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.15), 0 0 0 1px rgba(0, 0, 0, 0.05)',
                    backgroundColor: '#ffffff'
                }
            }
        } },
        React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '18px', fontFamily: '"Segoe UI", -apple-system, BlinkMacSystemFont, Roboto, sans-serif' } },
            React.createElement("div", { style: { display: 'flex', alignItems: 'flex-start', gap: '14px' } },
                React.createElement("div", { style: {
                        width: '46px',
                        height: '46px',
                        borderRadius: '12px',
                        backgroundColor: iconBg,
                        border: `1px solid ${borderColor}33`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 4px 12px ${borderColor}22`
                    } },
                    React.createElement(Icon, { iconName: iconName, style: { fontSize: '22px', color: iconColor, fontWeight: 'bold' } })),
                React.createElement("div", { style: { flex: 1 } },
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
                        React.createElement("span", { style: {
                                display: 'inline-block',
                                backgroundColor: badgeBg,
                                color: badgeTextColor,
                                padding: '3px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.7rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.06em'
                            } }, stage)),
                    React.createElement("h3", { style: { margin: 0, fontSize: '1.15rem', fontWeight: 600, color: '#0f172a', lineHeight: 1.3 } }, title))),
            React.createElement("p", { style: { margin: 0, fontSize: '0.88rem', color: '#475569', lineHeight: 1.55 } }, message),
            details && (React.createElement("div", { style: {
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    padding: '16px',
                    border: '1px solid #e2e8f0',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: '12px',
                    fontSize: '0.82rem'
                } },
                details.requestId && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Request ID"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requestId))),
                details.incidentId && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, details.incidentId.startsWith('REP-') ? 'Replacement ID' : 'Incident ID'),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.incidentId))),
                details.assetTitle && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Asset"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } },
                        details.assetTitle,
                        " ",
                        details.quantity ? `(Qty: ${details.quantity})` : ''))),
                details.requesterName && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Requester"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.requesterName))),
                details.managerName && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Manager's Name"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.managerName))),
                details.status && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Workflow Status"),
                    React.createElement("span", { style: {
                            backgroundColor: badgeBg,
                            color: badgeTextColor,
                            padding: '3px 9px',
                            borderRadius: '6px',
                            fontWeight: 600,
                            fontSize: '0.75rem',
                            display: 'inline-block'
                        } }, details.status))),
                details.date && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Date"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.date))),
                details.condition && (React.createElement("div", null,
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '2px' } }, "Condition"),
                    React.createElement("strong", { style: { color: '#0f172a', fontSize: '0.88rem' } }, details.condition))),
                details.comment && (React.createElement("div", { style: { gridColumn: '1 / -1', marginTop: '4px' } },
                    React.createElement("span", { style: { color: '#64748b', display: 'block', fontSize: '0.75rem', fontWeight: 500, marginBottom: '4px' } }, "Manager / Admin Notes"),
                    React.createElement("div", { style: {
                            backgroundColor: '#ffffff',
                            padding: '10px 12px',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            color: '#334155',
                            fontStyle: 'italic',
                            lineHeight: 1.4
                        } },
                        "\u201C",
                        details.comment,
                        "\u201D")))))),
        React.createElement(DialogFooter, { styles: { actionsRight: { marginTop: '20px' } } },
            React.createElement(PrimaryButton, { text: "Got it", onClick: onDismiss, iconProps: { iconName: 'Accept' }, styles: {
                    root: {
                        borderRadius: '8px',
                        padding: '0 20px',
                        height: '36px',
                        backgroundColor: '#005a9e',
                        border: 'none'
                    },
                    rootHovered: {
                        backgroundColor: '#004578'
                    }
                } }))));
};
//# sourceMappingURL=WorkflowPopup.js.map
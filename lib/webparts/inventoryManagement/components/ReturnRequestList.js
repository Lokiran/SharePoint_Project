import * as React from 'react';
import { useState, useMemo } from 'react';
import { PrimaryButton, DefaultButton, ActionButton, IconButton } from '@fluentui/react/lib/Button';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { Dropdown } from '@fluentui/react/lib/Dropdown';
import { TextField } from '@fluentui/react/lib/TextField';
import { Stack } from '@fluentui/react/lib/Stack';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Icon } from '@fluentui/react/lib/Icon';
import { MessageBar, MessageBarType } from '@fluentui/react/lib/MessageBar';
import { Shimmer } from '@fluentui/react/lib/Shimmer';
import { RETURN_CONDITION_OPTIONS } from '../constants/DropdownConstants';
import styles from './InventoryManagement.module.scss';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { getReturnRequestStatusDisplayText } from '../utils/RequestStatusUtils';
import { TONES, conditionTone } from './inventory/inventoryUi';
import { Pager } from './common/Pager';
import { recordCss as css, ACCENTS, cardButtonStyles, Pill, StatusChips, LayoutSwitch, useRecordLayout, RecordCard, MetaItem, BoardLanes, formatFlexibleDay, relativeDay, timeOf, dateRangeOptions, inDateRange } from './common/listUi';
const conditionOptions = RETURN_CONDITION_OPTIONS;
const PAGE_SIZE = 10;
const STAGES = ['manager', 'admin', 'completed', 'rejected'];
const STAGE_COLOR = { manager: ACCENTS.orange, admin: ACCENTS.blue, completed: ACCENTS.green, rejected: ACCENTS.red };
const stageOf = (status) => {
    switch (status) {
        case 'Approved':
        case 'Pending Admin Verification': return 'admin';
        case 'Rejected': return 'rejected';
        case 'Completed':
        case 'Returned': return 'completed';
        default: return 'manager'; // Pending, Pending Manager Approval
    }
};
const stageTone = (stage) => stage === 'manager' ? TONES.orange : stage === 'admin' ? TONES.blue : stage === 'rejected' ? TONES.red : TONES.green;
export const ReturnRequestList = (props) => {
    const { items, isAdmin, isManager, onUpdateStatus, loading } = props;
    const s = strings.RecordLists;
    const [layout, setLayout] = useRecordLayout('returns');
    const [searchQuery, setSearchQuery] = useState('');
    // Cards start on the requests waiting for this role, as the page always has; the board shows the whole pipeline.
    const [quick, setQuick] = useState((isAdmin || isManager) && layout === 'cards' ? 'mine' : 'all');
    const [condition, setCondition] = useState('all');
    const [range, setRange] = useState('all');
    const [sort, setSort] = useState('newest');
    const [page, setPage] = useState(1);
    // Dialog / State for Actions
    const [activeRequest, setActiveRequest] = useState(null);
    const [actionType, setActionType] = useState(null);
    const [comment, setComment] = useState('');
    const [finalCondition, setFinalCondition] = useState('Good');
    const [submitting, setSubmitting] = useState(false);
    const [actionError, setActionError] = useState();
    React.useEffect(() => setPage(1), [searchQuery, quick, condition, range, sort]);
    /** What this role can act on: managers approve, admins verify the check-in. */
    const needsMe = (item) => (isManager && stageOf(item.status) === 'manager') || (isAdmin && item.status === 'Pending Admin Verification');
    const stageLabel = (stage) => stage === 'manager' ? s.ReturnAwaitingManager : stage === 'admin' ? s.ReturnAwaitingAdmin : stage === 'completed' ? s.ReturnCompleted : s.ReturnRejected;
    const stageParts = STAGES.map(stage => ({
        key: stage,
        label: stageLabel(stage),
        count: items.filter(i => stageOf(i.status) === stage).length,
        color: STAGE_COLOR[stage]
    }));
    const chips = [
        ...(isAdmin || isManager ? [{ key: 'mine', label: s.ReturnNeedsMe, count: items.filter(needsMe).length, color: ACCENTS.blue }] : []),
        ...stageParts,
        { key: 'all', label: s.TileAll, count: items.length }
    ];
    const conditions = useMemo(() => Array.from(new Set(items.map(i => (i.proposedCondition || '').trim()).filter(Boolean))).sort(), [items]);
    const filteredItems = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = items.filter(item => {
            if (quick === 'mine' && !needsMe(item))
                return false;
            if (quick !== 'mine' && quick !== 'all' && stageOf(item.status) !== quick)
                return false;
            if (condition !== 'all' && (item.proposedCondition || '').trim() !== condition)
                return false;
            if (!inDateRange(item.requestDate, range))
                return false;
            if (!query)
                return true;
            return [item.id, item.assetName, item.serialNumber, item.requesterName, item.status, item.returnReason, item.managerComment]
                .some(v => (v || '').toLowerCase().includes(query));
        });
        const idOf = (i) => parseInt((i.id || '0').replace(/\D/g, ''), 10) || 0;
        const newestFirst = (a, b) => timeOf(b.requestDate) - timeOf(a.requestDate) || idOf(b) - idOf(a);
        return filtered.sort((a, b) => {
            switch (sort) {
                case 'oldest': return -newestFirst(a, b);
                case 'employee': return (a.requesterName || '').localeCompare(b.requesterName || '') || newestFirst(a, b);
                case 'asset': return (a.assetName || '').localeCompare(b.assetName || '') || newestFirst(a, b);
                default: return newestFirst(a, b);
            }
        });
    }, [items, searchQuery, quick, condition, range, sort, isAdmin, isManager]);
    const openDialog = (request, type) => {
        setActiveRequest(request);
        setActionType(type);
        setComment('');
        setActionError(undefined);
        setFinalCondition(request.proposedCondition || 'Good');
    };
    const closeDialog = () => {
        setActiveRequest(null);
        setActionType(null);
        setComment('');
        setActionError(undefined);
        setSubmitting(false);
    };
    const handleAction = async () => {
        if (!activeRequest || !actionType)
            return;
        if ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) {
            setActionError(actionType === 'Reject' ? strings.ReturnRequestList.AlertRejectionRequired : strings.ReturnRequestList.AlertVerificationRequired);
            return;
        }
        try {
            setSubmitting(true);
            setActionError(undefined);
            if (actionType === 'Approve') {
                await onUpdateStatus(activeRequest.id, 'Pending Admin Verification', comment || 'Approved by Manager', undefined, undefined, 'Approved', 'Not Started');
            }
            else if (actionType === 'Reject') {
                await onUpdateStatus(activeRequest.id, 'Rejected', comment, undefined, undefined, 'Rejected', 'Not Started');
            }
            else if (actionType === 'Complete') {
                await onUpdateStatus(activeRequest.id, 'Completed', activeRequest.managerComment || '', finalCondition, comment, 'Approved', 'Completed');
            }
            closeDialog();
        }
        catch (e) {
            setActionError(strings.ReturnRequestList.AlertActionFailedPrefix + ' ' + (e.message || JSON.stringify(e)));
        }
        finally {
            setSubmitting(false);
        }
    };
    const getStatusDisplayText = getReturnRequestStatusDisplayText;
    const changeLayout = (next) => {
        setLayout(next);
        // The board is the whole pipeline, so it starts unfiltered.
        if (next === 'board' && quick === 'mine')
            setQuick('all');
    };
    const totalPages = Math.max(1, Math.ceil(filteredItems.length / PAGE_SIZE));
    const activePage = Math.min(page, totalPages);
    const visible = filteredItems.slice((activePage - 1) * PAGE_SIZE, activePage * PAGE_SIZE);
    // Only what this role may do for the request's current step.
    const renderActions = (item, compact) => {
        const ref = item.id.replace('RR-', '#');
        return (React.createElement(React.Fragment, null,
            compact ? (React.createElement(IconButton, { iconProps: { iconName: 'RedEye' }, title: strings.Common.View, ariaLabel: `${strings.Common.View} ${ref}`, onClick: () => openDialog(item, 'View') })) : (React.createElement(DefaultButton, { text: strings.Common.View, iconProps: { iconName: 'RedEye' }, ariaLabel: `${strings.Common.View} ${ref}`, onClick: () => openDialog(item, 'View'), styles: cardButtonStyles })),
            isManager && stageOf(item.status) === 'manager' && (React.createElement(React.Fragment, null,
                React.createElement(DefaultButton, { text: strings.ReturnRequestList.ButtonReject, onClick: () => openDialog(item, 'Reject'), styles: { ...cardButtonStyles, root: { ...cardButtonStyles.root, color: '#a4262c', borderColor: '#f1bbbc' } } }),
                React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonApprove, iconProps: { iconName: 'CheckMark' }, onClick: () => openDialog(item, 'Approve'), styles: cardButtonStyles }))),
            isAdmin && item.status === 'Pending Admin Verification' && (React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonVerifyComplete, iconProps: { iconName: 'CheckMark' }, onClick: () => openDialog(item, 'Complete'), styles: {
                    ...cardButtonStyles,
                    root: { ...cardButtonStyles.root, backgroundColor: '#107c10', borderColor: '#107c10' },
                    rootHovered: { backgroundColor: '#0e5c0e', borderColor: '#0e5c0e' }
                } }))));
    };
    const renderCard = (item, compact) => {
        const stage = stageOf(item.status);
        const ago = relativeDay(item.requestDate);
        return (React.createElement(RecordCard, { key: item.id, compact: compact, idText: item.id.replace('RR-', '#'), badges: React.createElement(React.Fragment, null,
                !compact && React.createElement(Pill, { tone: stageTone(stage), text: getStatusDisplayText(item.status), title: strings.Columns.Status }),
                item.proposedCondition && React.createElement(Pill, { tone: conditionTone(item.proposedCondition), text: item.proposedCondition, title: strings.Columns.Condition })), title: item.assetName || s.Unspecified, text: item.returnReason, meta: React.createElement(React.Fragment, null,
                item.serialNumber && React.createElement(MetaItem, { icon: "Tag", title: strings.Columns.SerialNumber }, item.serialNumber),
                React.createElement(MetaItem, { icon: "Contact", title: strings.ReturnRequestList.ColEmployee }, item.requesterName || '—'),
                React.createElement(MetaItem, { icon: "Calendar", title: strings.Columns.RequestedDate },
                    formatFlexibleDay(item.requestDate),
                    ago ? ` · ${ago}` : '')), actions: renderActions(item, compact), onOpen: () => openDialog(item, 'View') }));
    };
    const conditionFilterOptions = [{ key: 'all', text: s.AllConditions }].concat(conditions.map(c => ({ key: c, text: c })));
    const sortOptions = [
        { key: 'newest', text: s.SortNewest },
        { key: 'oldest', text: s.SortOldest },
        { key: 'employee', text: s.SortEmployee },
        { key: 'asset', text: s.SortAsset }
    ];
    const hasFilters = condition !== 'all' || range !== 'all' || !!searchQuery.trim();
    // A stage chip narrows the board to that one lane; every other filter keeps all four.
    const laneStages = STAGES.filter(stage => quick === 'all' || quick === 'mine' || quick === stage);
    const renderEmpty = () => {
        // Nothing waiting for this role, but other returns exist: say so and offer the full list.
        if (quick === 'mine' && !hasFilters && items.length > 0) {
            return (React.createElement("div", { className: css.empty },
                React.createElement(Icon, { iconName: "CompletedSolid", style: { fontSize: 28, display: 'block', marginBottom: 8, color: ACCENTS.green } }),
                React.createElement("div", { style: { fontWeight: 600, color: 'var(--text-main, #242424)', marginBottom: 4 } }, s.ReturnNothingForMe),
                React.createElement(ActionButton, { iconProps: { iconName: 'List' }, text: formatString(s.ReturnShowAll, items.length), onClick: () => setQuick('all') })));
        }
        return (React.createElement("div", { className: css.empty },
            React.createElement(Icon, { iconName: items.length === 0 ? 'ReturnToSession' : 'Search', style: { fontSize: 28, display: 'block', marginBottom: 8 } }),
            items.length === 0 ? strings.ReturnRequestList.EmptyState : s.EmptyFiltered));
    };
    return (React.createElement("div", { className: css.root },
        React.createElement("div", { className: css.header },
            React.createElement("div", null,
                props.title && React.createElement("h3", { className: css.title }, props.title),
                props.subtitle && React.createElement("p", { className: css.subtitle }, props.subtitle)),
            React.createElement(LayoutSwitch, { layout: layout, onChange: changeLayout })),
        React.createElement(StatusChips, { chips: chips, selected: quick, ariaLabel: s.TilesAria, onSelect: (key) => setQuick(key) }),
        React.createElement("div", { className: css.filters },
            React.createElement(SearchBox, { className: css.search, placeholder: strings.ReturnRequestList.SearchPlaceholder, value: searchQuery, onChange: (_, val) => setSearchQuery(val || ''), onClear: () => setSearchQuery('') }),
            conditions.length > 1 && (React.createElement(Dropdown, { label: strings.Columns.Condition, options: conditionFilterOptions, selectedKey: condition, onChange: (_, o) => o && setCondition(String(o.key)), styles: { root: { width: 150 } } })),
            React.createElement(Dropdown, { label: strings.Columns.RequestedDate, options: dateRangeOptions(), selectedKey: range, onChange: (_, o) => o && setRange(o.key), styles: { root: { width: 150 } } }),
            React.createElement(Dropdown, { label: s.SortLabel, options: sortOptions, selectedKey: sort, onChange: (_, o) => o && setSort(o.key), styles: { root: { width: 180 } } })),
        React.createElement("div", { className: css.resultLine },
            React.createElement("span", null, formatString(s.ReturnResultCount, filteredItems.length, items.length)),
            hasFilters && (React.createElement(ActionButton, { iconProps: { iconName: 'ClearFilter' }, text: s.ClearFilters, onClick: () => { setCondition('all'); setRange('all'); setSearchQuery(''); } }))),
        loading && items.length === 0 ? (React.createElement("div", { className: css.grid, "aria-busy": "true", "aria-label": strings.ReturnRequestList.LoadingReturnRequests }, Array.from({ length: 3 }).map((_, i) => (React.createElement("div", { key: i, className: css.card, style: { cursor: 'default' } },
            React.createElement(Shimmer, { width: "35%" }),
            React.createElement(Shimmer, { width: "70%" }),
            React.createElement(Shimmer, null)))))) : filteredItems.length === 0 ? renderEmpty() : layout === 'board' ? (React.createElement(BoardLanes, { lanes: laneStages.map(stage => ({ key: stage, label: stageLabel(stage), color: STAGE_COLOR[stage], items: filteredItems.filter(i => stageOf(i.status) === stage) })), keyOf: (item) => item.id, renderCard: (item) => renderCard(item, true) })) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: css.grid }, visible.map(item => renderCard(item, false))),
            React.createElement("div", { className: css.pager },
                React.createElement(Pager, { page: activePage, pageSize: PAGE_SIZE, totalItems: filteredItems.length, onChange: setPage })))),
        React.createElement(Dialog, { hidden: !activeRequest, onDismiss: closeDialog, minWidth: 560, maxWidth: 640, dialogContentProps: {
                type: DialogType.normal,
                title: actionType === 'Approve' ? strings.ReturnRequestList.DialogTitleApprove :
                    actionType === 'Reject' ? strings.ReturnRequestList.DialogTitleReject :
                        actionType === 'Complete' ? strings.ReturnRequestList.DialogTitleComplete : strings.ReturnRequestList.DialogTitleView,
                subText: activeRequest ? formatString(strings.ReturnRequestList.DialogSubtext, activeRequest.requesterName, activeRequest.assetName) : ''
            }, modalProps: { isBlocking: actionType !== 'View' } },
            React.createElement(Stack, { tokens: { childrenGap: 15 }, style: { marginTop: '15px' } },
                activeRequest && (React.createElement("div", { style: {
                        backgroundColor: 'rgba(128, 128, 128, 0.05)',
                        border: '1px solid rgba(128, 128, 128, 0.15)',
                        borderRadius: '8px',
                        padding: '16px',
                        fontSize: '0.85rem',
                        fontFamily: 'inherit'
                    } },
                    React.createElement("div", { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, margin: '0 0 12px 0', borderBottom: '1px solid rgba(128, 128, 128, 0.1)', paddingBottom: '6px' } },
                        React.createElement("h4", { style: { margin: 0, fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main, #333333)' } }, strings.ReturnRequestList.CardTitle),
                        React.createElement(Pill, { tone: stageTone(stageOf(activeRequest.status)), text: getStatusDisplayText(activeRequest.status) })),
                    React.createElement("div", { className: styles.responsiveGrid, style: { gap: '12px 16px' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestId),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.id.replace('RR-', '#'))),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestedDate),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, formatFlexibleDay(activeRequest.requestDate))),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.AssetName),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.assetName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.SerialNumber),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.serialNumber || strings.Common.NotAvailable)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.ColEmployee),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.requesterName)),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.LabelProposedCondition),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.proposedCondition)),
                        (activeRequest.completedDate || activeRequest.verifiedDate) && (React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, s.ReturnCompletedOn),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, formatFlexibleDay(activeRequest.completedDate || activeRequest.verifiedDate)))),
                        React.createElement("div", { style: { gridColumn: 'span 2' } },
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.LabelReturnReason),
                            React.createElement("div", { style: {
                                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    fontWeight: 500,
                                    color: 'var(--text-main, #333333)'
                                } }, activeRequest.returnReason)),
                        activeRequest.managerComment && (React.createElement("div", { style: { gridColumn: 'span 2' } },
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.ManagerNotes),
                            React.createElement("div", { style: {
                                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    fontWeight: 500,
                                    color: 'var(--text-main, #333333)'
                                } }, activeRequest.managerComment))),
                        activeRequest.adminComments && (React.createElement("div", { style: { gridColumn: 'span 2' } },
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.ReturnRequestList.LabelVerificationComments),
                            React.createElement("div", { style: {
                                    backgroundColor: 'rgba(128, 128, 128, 0.05)',
                                    padding: '8px 12px',
                                    borderRadius: '4px',
                                    marginTop: '4px',
                                    border: '1px solid rgba(128, 128, 128, 0.1)',
                                    fontWeight: 500,
                                    color: 'var(--text-main, #333333)'
                                } }, activeRequest.adminComments)))))),
                actionType === 'Complete' && (React.createElement(Dropdown, { label: strings.ReturnRequestList.LabelFinalCondition, selectedKey: finalCondition, options: conditionOptions, onChange: (_, opt) => setFinalCondition(opt ? opt.key : 'Good') })),
                actionType !== 'View' && (React.createElement(TextField, { label: actionType === 'Reject' ? strings.ReturnRequestList.LabelRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.LabelVerificationComments :
                            strings.ReturnRequestList.LabelManagerComments, placeholder: actionType === 'Reject' ? strings.ReturnRequestList.PlaceholderRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.PlaceholderVerificationComments :
                            strings.ReturnRequestList.PlaceholderManagerComments, multiline: true, rows: 3, value: comment, onChange: (_, val) => { setComment(val || ''); setActionError(undefined); }, required: actionType === 'Reject' || actionType === 'Complete' })),
                actionError && (React.createElement(MessageBar, { messageBarType: MessageBarType.error, isMultiline: true, onDismiss: () => setActionError(undefined) }, actionError))),
            React.createElement(DialogFooter, null, actionType !== 'View' ? (React.createElement(React.Fragment, null,
                React.createElement(PrimaryButton, { text: actionType === 'Approve' ? strings.ReturnRequestList.ButtonApprove :
                        actionType === 'Reject' ? strings.ReturnRequestList.ButtonReject : strings.ReturnRequestList.ButtonVerifyComplete, onClick: handleAction, disabled: submitting || ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) }),
                React.createElement(DefaultButton, { text: strings.Common.Cancel, onClick: closeDialog, disabled: submitting }))) : (React.createElement(React.Fragment, null,
                activeRequest && isManager && stageOf(activeRequest.status) === 'manager' && (React.createElement(React.Fragment, null,
                    React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonApprove, onClick: () => setActionType('Approve') }),
                    React.createElement(DefaultButton, { text: strings.ReturnRequestList.ButtonReject, onClick: () => setActionType('Reject') }))),
                activeRequest && isAdmin && activeRequest.status === 'Pending Admin Verification' && (React.createElement(PrimaryButton, { text: strings.ReturnRequestList.ButtonVerifyComplete, onClick: () => setActionType('Complete') })),
                React.createElement(DefaultButton, { text: strings.Common.Close, onClick: closeDialog })))))));
};
//# sourceMappingURL=ReturnRequestList.js.map
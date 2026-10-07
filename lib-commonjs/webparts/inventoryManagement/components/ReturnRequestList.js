"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReturnRequestList = void 0;
const tslib_1 = require("tslib");
const React = tslib_1.__importStar(require("react"));
const react_1 = require("react");
const Button_1 = require("@fluentui/react/lib/Button");
const Dialog_1 = require("@fluentui/react/lib/Dialog");
const Dropdown_1 = require("@fluentui/react/lib/Dropdown");
const TextField_1 = require("@fluentui/react/lib/TextField");
const Stack_1 = require("@fluentui/react/lib/Stack");
const SearchBox_1 = require("@fluentui/react/lib/SearchBox");
const Icon_1 = require("@fluentui/react/lib/Icon");
const MessageBar_1 = require("@fluentui/react/lib/MessageBar");
const Shimmer_1 = require("@fluentui/react/lib/Shimmer");
const DropdownConstants_1 = require("../constants/DropdownConstants");
const InventoryManagement_module_scss_1 = tslib_1.__importDefault(require("./InventoryManagement.module.scss"));
const strings = tslib_1.__importStar(require("InventoryManagementWebPartStrings"));
const LocalizationUtils_1 = require("../utils/LocalizationUtils");
const RequestStatusUtils_1 = require("../utils/RequestStatusUtils");
const inventoryUi_1 = require("./inventory/inventoryUi");
const Pager_1 = require("./common/Pager");
const listUi_1 = require("./common/listUi");
const conditionOptions = DropdownConstants_1.RETURN_CONDITION_OPTIONS;
const PAGE_SIZE = 10;
const STAGES = ['manager', 'admin', 'completed', 'rejected'];
const STAGE_COLOR = { manager: listUi_1.ACCENTS.orange, admin: listUi_1.ACCENTS.blue, completed: listUi_1.ACCENTS.green, rejected: listUi_1.ACCENTS.red };
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
const stageTone = (stage) => stage === 'manager' ? inventoryUi_1.TONES.orange : stage === 'admin' ? inventoryUi_1.TONES.blue : stage === 'rejected' ? inventoryUi_1.TONES.red : inventoryUi_1.TONES.green;
const ReturnRequestList = (props) => {
    const { items, isAdmin, isManager, onUpdateStatus, loading } = props;
    const s = strings.RecordLists;
    const [layout, setLayout] = (0, listUi_1.useRecordLayout)('returns');
    const [searchQuery, setSearchQuery] = (0, react_1.useState)('');
    // Cards start on the requests waiting for this role, as the page always has; the board shows the whole pipeline.
    const [quick, setQuick] = (0, react_1.useState)((isAdmin || isManager) && layout === 'cards' ? 'mine' : 'all');
    const [condition, setCondition] = (0, react_1.useState)('all');
    const [range, setRange] = (0, react_1.useState)('all');
    const [sort, setSort] = (0, react_1.useState)('newest');
    const [page, setPage] = (0, react_1.useState)(1);
    // Dialog / State for Actions
    const [activeRequest, setActiveRequest] = (0, react_1.useState)(null);
    const [actionType, setActionType] = (0, react_1.useState)(null);
    const [comment, setComment] = (0, react_1.useState)('');
    const [finalCondition, setFinalCondition] = (0, react_1.useState)('Good');
    const [submitting, setSubmitting] = (0, react_1.useState)(false);
    const [actionError, setActionError] = (0, react_1.useState)();
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
        ...(isAdmin || isManager ? [{ key: 'mine', label: s.ReturnNeedsMe, count: items.filter(needsMe).length, color: listUi_1.ACCENTS.blue }] : []),
        ...stageParts,
        { key: 'all', label: s.TileAll, count: items.length }
    ];
    const conditions = (0, react_1.useMemo)(() => Array.from(new Set(items.map(i => (i.proposedCondition || '').trim()).filter(Boolean))).sort(), [items]);
    const filteredItems = (0, react_1.useMemo)(() => {
        const query = searchQuery.trim().toLowerCase();
        const filtered = items.filter(item => {
            if (quick === 'mine' && !needsMe(item))
                return false;
            if (quick !== 'mine' && quick !== 'all' && stageOf(item.status) !== quick)
                return false;
            if (condition !== 'all' && (item.proposedCondition || '').trim() !== condition)
                return false;
            if (!(0, listUi_1.inDateRange)(item.requestDate, range))
                return false;
            if (!query)
                return true;
            return [item.id, item.assetName, item.serialNumber, item.requesterName, item.status, item.returnReason, item.managerComment]
                .some(v => (v || '').toLowerCase().includes(query));
        });
        const idOf = (i) => parseInt((i.id || '0').replace(/\D/g, ''), 10) || 0;
        const newestFirst = (a, b) => (0, listUi_1.timeOf)(b.requestDate) - (0, listUi_1.timeOf)(a.requestDate) || idOf(b) - idOf(a);
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
    const getStatusDisplayText = RequestStatusUtils_1.getReturnRequestStatusDisplayText;
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
            compact ? (React.createElement(Button_1.IconButton, { iconProps: { iconName: 'RedEye' }, title: strings.Common.View, ariaLabel: `${strings.Common.View} ${ref}`, onClick: () => openDialog(item, 'View') })) : (React.createElement(Button_1.DefaultButton, { text: strings.Common.View, iconProps: { iconName: 'RedEye' }, ariaLabel: `${strings.Common.View} ${ref}`, onClick: () => openDialog(item, 'View'), styles: listUi_1.cardButtonStyles })),
            isManager && stageOf(item.status) === 'manager' && (React.createElement(React.Fragment, null,
                React.createElement(Button_1.DefaultButton, { text: strings.ReturnRequestList.ButtonReject, onClick: () => openDialog(item, 'Reject'), styles: { ...listUi_1.cardButtonStyles, root: { ...listUi_1.cardButtonStyles.root, color: '#a4262c', borderColor: '#f1bbbc' } } }),
                React.createElement(Button_1.PrimaryButton, { text: strings.ReturnRequestList.ButtonApprove, iconProps: { iconName: 'CheckMark' }, onClick: () => openDialog(item, 'Approve'), styles: listUi_1.cardButtonStyles }))),
            isAdmin && item.status === 'Pending Admin Verification' && (React.createElement(Button_1.PrimaryButton, { text: strings.ReturnRequestList.ButtonVerifyComplete, iconProps: { iconName: 'CheckMark' }, onClick: () => openDialog(item, 'Complete'), styles: {
                    ...listUi_1.cardButtonStyles,
                    root: { ...listUi_1.cardButtonStyles.root, backgroundColor: '#107c10', borderColor: '#107c10' },
                    rootHovered: { backgroundColor: '#0e5c0e', borderColor: '#0e5c0e' }
                } }))));
    };
    const renderCard = (item, compact) => {
        const stage = stageOf(item.status);
        const ago = (0, listUi_1.relativeDay)(item.requestDate);
        return (React.createElement(listUi_1.RecordCard, { key: item.id, compact: compact, idText: item.id.replace('RR-', '#'), badges: React.createElement(React.Fragment, null,
                !compact && React.createElement(listUi_1.Pill, { tone: stageTone(stage), text: getStatusDisplayText(item.status), title: strings.Columns.Status }),
                item.proposedCondition && React.createElement(listUi_1.Pill, { tone: (0, inventoryUi_1.conditionTone)(item.proposedCondition), text: item.proposedCondition, title: strings.Columns.Condition })), title: item.assetName || s.Unspecified, text: item.returnReason, meta: React.createElement(React.Fragment, null,
                item.serialNumber && React.createElement(listUi_1.MetaItem, { icon: "Tag", title: strings.Columns.SerialNumber }, item.serialNumber),
                React.createElement(listUi_1.MetaItem, { icon: "Contact", title: strings.ReturnRequestList.ColEmployee }, item.requesterName || '—'),
                React.createElement(listUi_1.MetaItem, { icon: "Calendar", title: strings.Columns.RequestedDate },
                    (0, listUi_1.formatFlexibleDay)(item.requestDate),
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
            return (React.createElement("div", { className: listUi_1.recordCss.empty },
                React.createElement(Icon_1.Icon, { iconName: "CompletedSolid", style: { fontSize: 28, display: 'block', marginBottom: 8, color: listUi_1.ACCENTS.green } }),
                React.createElement("div", { style: { fontWeight: 600, color: 'var(--text-main, #242424)', marginBottom: 4 } }, s.ReturnNothingForMe),
                React.createElement(Button_1.ActionButton, { iconProps: { iconName: 'List' }, text: (0, LocalizationUtils_1.formatString)(s.ReturnShowAll, items.length), onClick: () => setQuick('all') })));
        }
        return (React.createElement("div", { className: listUi_1.recordCss.empty },
            React.createElement(Icon_1.Icon, { iconName: items.length === 0 ? 'ReturnToSession' : 'Search', style: { fontSize: 28, display: 'block', marginBottom: 8 } }),
            items.length === 0 ? strings.ReturnRequestList.EmptyState : s.EmptyFiltered));
    };
    return (React.createElement("div", { className: listUi_1.recordCss.root },
        React.createElement("div", { className: listUi_1.recordCss.header },
            React.createElement("div", null,
                props.title && React.createElement("h3", { className: listUi_1.recordCss.title }, props.title),
                props.subtitle && React.createElement("p", { className: listUi_1.recordCss.subtitle }, props.subtitle)),
            React.createElement(listUi_1.LayoutSwitch, { layout: layout, onChange: changeLayout })),
        React.createElement(listUi_1.StatusChips, { chips: chips, selected: quick, ariaLabel: s.TilesAria, onSelect: (key) => setQuick(key) }),
        React.createElement("div", { className: listUi_1.recordCss.filters },
            React.createElement(SearchBox_1.SearchBox, { className: listUi_1.recordCss.search, placeholder: strings.ReturnRequestList.SearchPlaceholder, value: searchQuery, onChange: (_, val) => setSearchQuery(val || ''), onClear: () => setSearchQuery('') }),
            conditions.length > 1 && (React.createElement(Dropdown_1.Dropdown, { label: strings.Columns.Condition, options: conditionFilterOptions, selectedKey: condition, onChange: (_, o) => o && setCondition(String(o.key)), styles: { root: { width: 150 } } })),
            React.createElement(Dropdown_1.Dropdown, { label: strings.Columns.RequestedDate, options: (0, listUi_1.dateRangeOptions)(), selectedKey: range, onChange: (_, o) => o && setRange(o.key), styles: { root: { width: 150 } } }),
            React.createElement(Dropdown_1.Dropdown, { label: s.SortLabel, options: sortOptions, selectedKey: sort, onChange: (_, o) => o && setSort(o.key), styles: { root: { width: 180 } } })),
        React.createElement("div", { className: listUi_1.recordCss.resultLine },
            React.createElement("span", null, (0, LocalizationUtils_1.formatString)(s.ReturnResultCount, filteredItems.length, items.length)),
            hasFilters && (React.createElement(Button_1.ActionButton, { iconProps: { iconName: 'ClearFilter' }, text: s.ClearFilters, onClick: () => { setCondition('all'); setRange('all'); setSearchQuery(''); } }))),
        loading && items.length === 0 ? (React.createElement("div", { className: listUi_1.recordCss.grid, "aria-busy": "true", "aria-label": strings.ReturnRequestList.LoadingReturnRequests }, Array.from({ length: 3 }).map((_, i) => (React.createElement("div", { key: i, className: listUi_1.recordCss.card, style: { cursor: 'default' } },
            React.createElement(Shimmer_1.Shimmer, { width: "35%" }),
            React.createElement(Shimmer_1.Shimmer, { width: "70%" }),
            React.createElement(Shimmer_1.Shimmer, null)))))) : filteredItems.length === 0 ? renderEmpty() : layout === 'board' ? (React.createElement(listUi_1.BoardLanes, { lanes: laneStages.map(stage => ({ key: stage, label: stageLabel(stage), color: STAGE_COLOR[stage], items: filteredItems.filter(i => stageOf(i.status) === stage) })), keyOf: (item) => item.id, renderCard: (item) => renderCard(item, true) })) : (React.createElement(React.Fragment, null,
            React.createElement("div", { className: listUi_1.recordCss.grid }, visible.map(item => renderCard(item, false))),
            React.createElement("div", { className: listUi_1.recordCss.pager },
                React.createElement(Pager_1.Pager, { page: activePage, pageSize: PAGE_SIZE, totalItems: filteredItems.length, onChange: setPage })))),
        React.createElement(Dialog_1.Dialog, { hidden: !activeRequest, onDismiss: closeDialog, minWidth: 560, maxWidth: 640, dialogContentProps: {
                type: Dialog_1.DialogType.normal,
                title: actionType === 'Approve' ? strings.ReturnRequestList.DialogTitleApprove :
                    actionType === 'Reject' ? strings.ReturnRequestList.DialogTitleReject :
                        actionType === 'Complete' ? strings.ReturnRequestList.DialogTitleComplete : strings.ReturnRequestList.DialogTitleView,
                subText: activeRequest ? (0, LocalizationUtils_1.formatString)(strings.ReturnRequestList.DialogSubtext, activeRequest.requesterName, activeRequest.assetName) : ''
            }, modalProps: { isBlocking: actionType !== 'View' } },
            React.createElement(Stack_1.Stack, { tokens: { childrenGap: 15 }, style: { marginTop: '15px' } },
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
                        React.createElement(listUi_1.Pill, { tone: stageTone(stageOf(activeRequest.status)), text: getStatusDisplayText(activeRequest.status) })),
                    React.createElement("div", { className: InventoryManagement_module_scss_1.default.responsiveGrid, style: { gap: '12px 16px' } },
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestId),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, activeRequest.id.replace('RR-', '#'))),
                        React.createElement("div", null,
                            React.createElement("span", { style: { color: 'var(--text-muted, #666666)', display: 'block', marginBottom: '2px' } }, strings.Columns.RequestedDate),
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, (0, listUi_1.formatFlexibleDay)(activeRequest.requestDate))),
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
                            React.createElement("strong", { style: { color: 'var(--text-main, #333333)' } }, (0, listUi_1.formatFlexibleDay)(activeRequest.completedDate || activeRequest.verifiedDate)))),
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
                actionType === 'Complete' && (React.createElement(Dropdown_1.Dropdown, { label: strings.ReturnRequestList.LabelFinalCondition, selectedKey: finalCondition, options: conditionOptions, onChange: (_, opt) => setFinalCondition(opt ? opt.key : 'Good') })),
                actionType !== 'View' && (React.createElement(TextField_1.TextField, { label: actionType === 'Reject' ? strings.ReturnRequestList.LabelRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.LabelVerificationComments :
                            strings.ReturnRequestList.LabelManagerComments, placeholder: actionType === 'Reject' ? strings.ReturnRequestList.PlaceholderRejectionReason :
                        actionType === 'Complete' ? strings.ReturnRequestList.PlaceholderVerificationComments :
                            strings.ReturnRequestList.PlaceholderManagerComments, multiline: true, rows: 3, value: comment, onChange: (_, val) => { setComment(val || ''); setActionError(undefined); }, required: actionType === 'Reject' || actionType === 'Complete' })),
                actionError && (React.createElement(MessageBar_1.MessageBar, { messageBarType: MessageBar_1.MessageBarType.error, isMultiline: true, onDismiss: () => setActionError(undefined) }, actionError))),
            React.createElement(Dialog_1.DialogFooter, null, actionType !== 'View' ? (React.createElement(React.Fragment, null,
                React.createElement(Button_1.PrimaryButton, { text: actionType === 'Approve' ? strings.ReturnRequestList.ButtonApprove :
                        actionType === 'Reject' ? strings.ReturnRequestList.ButtonReject : strings.ReturnRequestList.ButtonVerifyComplete, onClick: handleAction, disabled: submitting || ((actionType === 'Reject' || actionType === 'Complete') && !comment.trim()) }),
                React.createElement(Button_1.DefaultButton, { text: strings.Common.Cancel, onClick: closeDialog, disabled: submitting }))) : (React.createElement(React.Fragment, null,
                activeRequest && isManager && stageOf(activeRequest.status) === 'manager' && (React.createElement(React.Fragment, null,
                    React.createElement(Button_1.PrimaryButton, { text: strings.ReturnRequestList.ButtonApprove, onClick: () => setActionType('Approve') }),
                    React.createElement(Button_1.DefaultButton, { text: strings.ReturnRequestList.ButtonReject, onClick: () => setActionType('Reject') }))),
                activeRequest && isAdmin && activeRequest.status === 'Pending Admin Verification' && (React.createElement(Button_1.PrimaryButton, { text: strings.ReturnRequestList.ButtonVerifyComplete, onClick: () => setActionType('Complete') })),
                React.createElement(Button_1.DefaultButton, { text: strings.Common.Close, onClick: closeDialog })))))));
};
exports.ReturnRequestList = ReturnRequestList;
//# sourceMappingURL=ReturnRequestList.js.map
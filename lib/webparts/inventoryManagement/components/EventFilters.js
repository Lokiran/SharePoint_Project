import * as React from 'react';
import { Dropdown, ComboBox, SelectableOptionMenuItemType, DatePicker, SearchBox, ActionButton, IconButton, Icon, Stack, Text } from '@fluentui/react';
import { mergeStyleSets } from '@fluentui/react/lib/Styling';
import { AUDIT_LOG_DATE_RANGE_OPTIONS, AUDIT_LOG_MODULE_OPTIONS, AUDIT_LOG_STATUS_OPTIONS, AUDIT_LOG_SORT_OPTIONS, DEFAULT_ASSET_TYPE_OPTIONS } from '../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';
import { MY_ACTIVITY_KEY } from '../utils/EventLogUtils';
const LINE = 'rgba(128, 128, 128, 0.3)';
const FOCUS = { outline: '2px solid #0f6cbd', outlineOffset: 2 };
/** Date ranges offered as one-click buttons; the rest stay in the Date Range dropdown. */
const QUICK_RANGES = ['All', 'Today', 'Last7', 'Last30'];
const css = mergeStyleSets({
    root: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 16 },
    bar: { display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' },
    search: { flex: '1 1 260px', minWidth: 220 },
    quick: { display: 'inline-flex', flexWrap: 'wrap', padding: 3, borderRadius: 10, background: 'rgba(128, 128, 128, 0.14)' },
    quickButton: {
        padding: '6px 12px', border: 'none', borderRadius: 8, background: 'transparent', cursor: 'pointer',
        font: 'inherit', fontSize: 13, fontWeight: 600, color: 'var(--text-muted, #616161)',
        selectors: { ':hover': { color: 'var(--text-main, #242424)' }, ':focus-visible': FOCUS }
    },
    quickActive: { background: 'var(--surface-bg, #ffffff)', color: 'var(--text-main, #242424)', boxShadow: '0 1px 3px rgba(0, 0, 0, 0.16)' },
    toggle: {
        display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 999, border: `1px solid ${LINE}`,
        background: 'var(--surface-bg, #ffffff)', cursor: 'pointer', font: 'inherit', fontSize: 13, fontWeight: 600, color: 'inherit',
        selectors: { ':hover': { borderColor: 'rgba(128, 128, 128, 0.6)' }, ':focus-visible': FOCUS }
    },
    toggleOn: { background: '#0f6cbd', borderColor: '#0f6cbd', color: '#ffffff', selectors: { ':hover': { borderColor: '#0f6cbd' } } },
    panel: { padding: '12px 14px 14px', borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12 },
    custom: { padding: '12px 14px', borderRadius: 12, background: 'rgba(128, 128, 128, 0.08)' },
    chips: { display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' },
    chip: {
        display: 'inline-flex', alignItems: 'center', gap: 4, padding: '2px 4px 2px 10px', borderRadius: 999,
        border: `1px solid ${LINE}`, background: 'rgba(128, 128, 128, 0.1)', fontSize: 12, color: 'var(--text-main, #242424)'
    }
});
const chipButtonStyles = {
    root: { width: 20, height: 20, padding: 0 },
    icon: { fontSize: 8 }
};
export const EventFilters = (props) => {
    const { filters, onChange, onClear, actionsList, assetTypesList, userOptions, currentUserName } = props;
    // The full set of filters stays folded away until asked for.
    const [open, setOpen] = React.useState(false);
    const dateOptions = AUDIT_LOG_DATE_RANGE_OPTIONS;
    const moduleOptions = AUDIT_LOG_MODULE_OPTIONS;
    const statusOptions = AUDIT_LOG_STATUS_OPTIONS;
    const sortOptions = AUDIT_LOG_SORT_OPTIONS;
    const actionOptions = [
        { key: 'All', text: strings.EventFilters.AllActionsOption },
        ...actionsList.map(action => ({
            key: action,
            text: action.charAt(0).toUpperCase() + action.slice(1)
        }))
    ];
    // Standard types show their localized label; custom types from SharePoint show as stored.
    const getAssetTypeText = (type) => {
        const standard = DEFAULT_ASSET_TYPE_OPTIONS.find(o => String(o.key).toLowerCase() === type.toLowerCase());
        return standard ? standard.text : type;
    };
    const assetTypeOptions = [
        { key: 'All', text: strings.EventFilters.AllAssetsOption },
        ...assetTypesList.map(type => ({
            key: type,
            text: getAssetTypeText(type)
        }))
    ];
    // Searchable: type part of a name to jump to it. Counts reflect the current date/action/module filters.
    const userComboOptions = [
        { key: 'All', text: strings.EventFilters.AllUsersOption },
        ...(currentUserName ? [{ key: MY_ACTIVITY_KEY, text: strings.EventFilters.MyActivityOption }] : []),
        { key: 'divider', text: '-', itemType: SelectableOptionMenuItemType.Divider },
        ...userOptions.map(u => ({
            key: u.name,
            text: u.name,
            ariaLabel: `${u.name} (${u.count})`,
            data: { count: u.count }
        }))
    ];
    const getUserLabel = (user) => user === MY_ACTIVITY_KEY ? strings.EventFilters.MyActivityOption : user;
    // Number of active filters (search and sort are not counted).
    const activeCount = [
        filters.dateRangeType !== 'All',
        filters.action !== 'All',
        filters.module !== 'All',
        filters.assetType !== 'All',
        filters.user !== 'All',
        filters.status !== 'All'
    ].filter(Boolean).length;
    const hasActiveFilters = activeCount > 0;
    const dateText = (type) => dateOptions.find(o => o.key === type)?.text || type;
    // Format date range labels for chips
    const getDateLabel = () => {
        if (filters.dateRangeType !== 'Custom') {
            return dateText(filters.dateRangeType);
        }
        const startStr = filters.startDate ? new Date(filters.startDate).toLocaleDateString() : '';
        const endStr = filters.endDate ? new Date(filters.endDate).toLocaleDateString() : '';
        return `${startStr} - ${endStr}`;
    };
    const handleDateChange = (type) => {
        onChange({
            ...filters,
            dateRangeType: type,
            startDate: type === 'Custom' ? filters.startDate || new Date() : undefined,
            endDate: type === 'Custom' ? filters.endDate || new Date() : undefined
        });
    };
    // Date range validation
    const isDateRangeInvalid = filters.dateRangeType === 'Custom' &&
        filters.startDate &&
        filters.endDate &&
        new Date(filters.startDate) > new Date(filters.endDate);
    const chip = (key, text, onRemove) => (React.createElement("span", { key: key, className: css.chip },
        text,
        React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: onRemove, styles: chipButtonStyles, ariaLabel: `${strings.Common.Reset}: ${text}` })));
    const mine = filters.user === MY_ACTIVITY_KEY;
    return (React.createElement("div", { className: css.root },
        React.createElement("div", { className: css.bar },
            React.createElement(SearchBox, { className: css.search, placeholder: strings.EventFilters.SearchPlaceholder, value: filters.searchQuery, onChange: (_, newValue) => onChange({ ...filters, searchQuery: newValue || '' }), onClear: () => onChange({ ...filters, searchQuery: '' }) }),
            React.createElement("div", { className: css.quick, role: "group", "aria-label": strings.EventFilters.LabelDateRange }, QUICK_RANGES.map(range => (React.createElement("button", { key: range, type: "button", className: `${css.quickButton} ${filters.dateRangeType === range ? css.quickActive : ''}`, "aria-pressed": filters.dateRangeType === range, onClick: () => handleDateChange(range) }, dateText(range))))),
            currentUserName && (React.createElement("button", { type: "button", className: `${css.toggle} ${mine ? css.toggleOn : ''}`, "aria-pressed": mine, onClick: () => onChange({ ...filters, user: mine ? 'All' : MY_ACTIVITY_KEY }) },
                React.createElement(Icon, { iconName: "Contact", "aria-hidden": "true" }),
                strings.EventFilters.MyActivityOption)),
            React.createElement("button", { type: "button", className: css.toggle, "aria-expanded": open, onClick: () => setOpen(!open) },
                React.createElement(Icon, { iconName: "Filter", "aria-hidden": "true" }),
                activeCount > 0 ? formatString(strings.EventFeed.FiltersToggleCount, activeCount) : strings.EventFeed.FiltersToggle,
                React.createElement(Icon, { iconName: open ? 'ChevronUp' : 'ChevronDown', style: { fontSize: 10 }, "aria-hidden": "true" }))),
        open && (React.createElement("div", { className: css.panel },
            React.createElement("div", { className: css.grid },
                React.createElement(Dropdown, { label: strings.EventFilters.LabelDateRange, selectedKey: filters.dateRangeType, options: dateOptions, onChange: (_, option) => option && handleDateChange(option.key) }),
                React.createElement(Dropdown, { label: strings.EventFilters.LabelAction, selectedKey: filters.action, options: actionOptions, onChange: (_, option) => option && onChange({ ...filters, action: option.key }) }),
                React.createElement(Dropdown, { label: strings.EventFilters.LabelModule, selectedKey: filters.module, options: moduleOptions, onChange: (_, option) => option && onChange({ ...filters, module: option.key }) }),
                React.createElement(Dropdown, { label: strings.EventFilters.LabelAssetType, selectedKey: filters.assetType, options: assetTypeOptions, onChange: (_, option) => option && onChange({ ...filters, assetType: option.key }) }),
                React.createElement(ComboBox, { label: strings.EventFilters.LabelUser, selectedKey: filters.user, options: userComboOptions, autoComplete: "on", allowFreeform: false, placeholder: strings.EventFilters.UserSearchPlaceholder, onRenderOption: (option) => option ? (React.createElement("span", { style: { display: 'flex', justifyContent: 'space-between', gap: '12px', width: '100%' } },
                        React.createElement("span", null, option.text),
                        option.data && React.createElement("span", { style: { color: 'var(--text-muted, #6b7280)', fontSize: '0.75rem' } }, option.data.count))) : null, onChange: (_, option) => option && onChange({ ...filters, user: option.key }), useComboBoxAsMenuWidth: true }),
                React.createElement(Dropdown, { label: strings.EventFilters.LabelStatus, selectedKey: filters.status, options: statusOptions, onChange: (_, option) => option && onChange({ ...filters, status: option.key }) }),
                React.createElement(Dropdown, { label: strings.EventFilters.LabelSortOrder, selectedKey: filters.sortOrder, options: sortOptions, onChange: (_, option) => option && onChange({ ...filters, sortOrder: option.key }) })))),
        filters.dateRangeType === 'Custom' && (React.createElement(Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 16 }, className: css.custom, style: { alignItems: 'flex-end' } },
            React.createElement("div", null,
                React.createElement(DatePicker, { label: strings.EventFilters.LabelStartDate, value: filters.startDate, onSelectDate: (date) => date && onChange({ ...filters, startDate: date }), placeholder: strings.EventFilters.StartDatePlaceholder })),
            React.createElement("div", null,
                React.createElement(DatePicker, { label: strings.EventFilters.LabelEndDate, value: filters.endDate, onSelectDate: (date) => date && onChange({ ...filters, endDate: date }), placeholder: strings.EventFilters.EndDatePlaceholder })),
            isDateRangeInvalid && (React.createElement(Text, { style: { color: '#a80000', alignSelf: 'center', fontWeight: 'bold' } }, strings.EventFilters.DateRangeWarning)))),
        hasActiveFilters && (React.createElement("div", { className: css.chips },
            React.createElement(Text, { variant: "smallPlus", style: { color: 'var(--text-muted)', fontWeight: 'bold' } }, strings.EventFilters.ActiveFilters),
            filters.dateRangeType !== 'All' && chip('date', getDateLabel(), () => handleDateChange('All')),
            filters.action !== 'All' && chip('action', formatString(strings.EventFilters.ChipAction, filters.action), () => onChange({ ...filters, action: 'All' })),
            filters.module !== 'All' && chip('module', formatString(strings.EventFilters.ChipModule, filters.module), () => onChange({ ...filters, module: 'All' })),
            filters.assetType !== 'All' && chip('asset', formatString(strings.EventFilters.ChipAsset, getAssetTypeText(filters.assetType)), () => onChange({ ...filters, assetType: 'All' })),
            filters.user !== 'All' && chip('user', formatString(strings.EventFilters.ChipUser, getUserLabel(filters.user)), () => onChange({ ...filters, user: 'All' })),
            filters.status !== 'All' && chip('status', formatString(strings.EventFilters.ChipStatus, filters.status), () => onChange({ ...filters, status: 'All' })),
            React.createElement(ActionButton, { iconProps: { iconName: 'ClearFilter' }, text: strings.EventFilters.ClearAll, onClick: onClear, styles: { root: { height: 26 } } })))));
};
//# sourceMappingURL=EventFilters.js.map
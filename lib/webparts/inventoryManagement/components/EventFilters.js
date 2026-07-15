import * as React from 'react';
import { Dropdown, DatePicker, SearchBox, DefaultButton, IconButton, Stack, Text } from '@fluentui/react';
export const EventFilters = (props) => {
    const { filters, onChange, onClear, actionsList, assetTypesList, usersList } = props;
    const dateOptions = [
        { key: 'All', text: 'All Time' },
        { key: 'Today', text: 'Today' },
        { key: 'Yesterday', text: 'Yesterday' },
        { key: 'Last7', text: 'Last 7 Days' },
        { key: 'Last15', text: 'Last 15 Days' },
        { key: 'Last30', text: 'Last 30 Days' },
        { key: 'Last60', text: 'Last 60 Days' },
        { key: 'Last90', text: 'Last 90 Days' },
        { key: 'ThisWeek', text: 'This Week' },
        { key: 'ThisMonth', text: 'This Month' },
        { key: 'Custom', text: 'Custom Date Range' }
    ];
    const moduleOptions = [
        { key: 'All', text: 'All Modules' },
        { key: 'Inventory', text: 'Inventory' },
        { key: 'Requests', text: 'Requests' },
        { key: 'Returns', text: 'Returns' },
        { key: 'Users', text: 'Users' },
        { key: 'Reports', text: 'Reports' },
        { key: 'Configuration', text: 'Configuration' },
        { key: 'Notifications', text: 'Notifications' }
    ];
    const statusOptions = [
        { key: 'All', text: 'All Statuses' },
        { key: 'Pending', text: 'Pending' },
        { key: 'Approved', text: 'Approved' },
        { key: 'Rejected', text: 'Rejected' },
        { key: 'Assigned', text: 'Assigned' },
        { key: 'Returned', text: 'Returned' },
        { key: 'Completed', text: 'Completed' }
    ];
    const sortOptions = [
        { key: 'NewestFirst', text: 'Newest First' },
        { key: 'OldestFirst', text: 'Oldest First' },
        { key: 'AssetNameAZ', text: 'Asset Name A-Z' },
        { key: 'AssetNameZA', text: 'Asset Name Z-A' },
        { key: 'UserAZ', text: 'User A-Z' },
        { key: 'UserZA', text: 'User Z-A' }
    ];
    const actionOptions = [
        { key: 'All', text: 'All Actions' },
        ...actionsList.map(action => ({
            key: action,
            text: action.charAt(0).toUpperCase() + action.slice(1)
        }))
    ];
    const assetTypeOptions = [
        { key: 'All', text: 'All Assets' },
        ...assetTypesList.map(type => ({
            key: type,
            text: type
        }))
    ];
    const userOptions = [
        { key: 'All', text: 'All Users' },
        ...usersList.map(user => ({
            key: user,
            text: user
        }))
    ];
    // Helper to check if any filter is active (excluding default search/sort)
    const hasActiveFilters = filters.dateRangeType !== 'All' ||
        filters.action !== 'All' ||
        filters.module !== 'All' ||
        filters.assetType !== 'All' ||
        filters.user !== 'All' ||
        filters.status !== 'All';
    // Format date range labels for chips
    const getDateLabel = () => {
        if (filters.dateRangeType !== 'Custom') {
            return dateOptions.find(o => o.key === filters.dateRangeType)?.text || filters.dateRangeType;
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
    return (React.createElement("div", { style: { display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' } },
        React.createElement("div", { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' } },
            React.createElement(SearchBox, { placeholder: "Search by asset name, title, details, user, or action...", value: filters.searchQuery, onChange: (_, newValue) => onChange({ ...filters, searchQuery: newValue || '' }), onClear: () => onChange({ ...filters, searchQuery: '' }), styles: { root: { flexGrow: 1, minWidth: '300px' } } }),
            React.createElement(DefaultButton, { text: "Clear Filters", iconProps: { iconName: 'ClearFilter' }, onClick: onClear, disabled: !hasActiveFilters && !filters.searchQuery })),
        React.createElement("div", { style: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '12px'
            } },
            React.createElement(Dropdown, { label: "Date Range", selectedKey: filters.dateRangeType, options: dateOptions, onChange: (_, option) => option && handleDateChange(option.key) }),
            React.createElement(Dropdown, { label: "Action", selectedKey: filters.action, options: actionOptions, onChange: (_, option) => option && onChange({ ...filters, action: option.key }) }),
            React.createElement(Dropdown, { label: "Module", selectedKey: filters.module, options: moduleOptions, onChange: (_, option) => option && onChange({ ...filters, module: option.key }) }),
            React.createElement(Dropdown, { label: "Asset Type", selectedKey: filters.assetType, options: assetTypeOptions, onChange: (_, option) => option && onChange({ ...filters, assetType: option.key }) }),
            React.createElement(Dropdown, { label: "User", selectedKey: filters.user, options: userOptions, onChange: (_, option) => option && onChange({ ...filters, user: option.key }) }),
            React.createElement(Dropdown, { label: "Status", selectedKey: filters.status, options: statusOptions, onChange: (_, option) => option && onChange({ ...filters, status: option.key }) }),
            React.createElement(Dropdown, { label: "Sort Order", selectedKey: filters.sortOrder, options: sortOptions, onChange: (_, option) => option && onChange({ ...filters, sortOrder: option.key }) })),
        filters.dateRangeType === 'Custom' && (React.createElement(Stack, { horizontal: true, wrap: true, tokens: { childrenGap: 16 }, style: { alignItems: 'flex-end', backgroundColor: '#f3f2f1', padding: '12px', borderRadius: '4px' } },
            React.createElement("div", null,
                React.createElement(DatePicker, { label: "Start Date", value: filters.startDate, onSelectDate: (date) => date && onChange({ ...filters, startDate: date }), placeholder: "Select a start date..." })),
            React.createElement("div", null,
                React.createElement(DatePicker, { label: "End Date", value: filters.endDate, onSelectDate: (date) => date && onChange({ ...filters, endDate: date }), placeholder: "Select an end date..." })),
            isDateRangeInvalid && (React.createElement(Text, { style: { color: '#a80000', alignSelf: 'center', fontWeight: 'bold' } }, "Warning: Start Date must be less than or equal to End Date.")))),
        hasActiveFilters && (React.createElement("div", { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' } },
            React.createElement(Text, { variant: "smallPlus", style: { color: 'var(--text-muted)', marginRight: '4px', fontWeight: 'bold' } }, "Active Filters:"),
            filters.dateRangeType !== 'All' && (React.createElement("span", { style: chipStyle },
                getDateLabel(),
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => handleDateChange('All'), styles: chipButtonStyles }))),
            filters.action !== 'All' && (React.createElement("span", { style: chipStyle },
                "Action: ",
                filters.action,
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, action: 'All' }), styles: chipButtonStyles }))),
            filters.module !== 'All' && (React.createElement("span", { style: chipStyle },
                "Module: ",
                filters.module,
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, module: 'All' }), styles: chipButtonStyles }))),
            filters.assetType !== 'All' && (React.createElement("span", { style: chipStyle },
                "Asset: ",
                filters.assetType,
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, assetType: 'All' }), styles: chipButtonStyles }))),
            filters.user !== 'All' && (React.createElement("span", { style: chipStyle },
                "User: ",
                filters.user,
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, user: 'All' }), styles: chipButtonStyles }))),
            filters.status !== 'All' && (React.createElement("span", { style: chipStyle },
                "Status: ",
                filters.status,
                React.createElement(IconButton, { iconProps: { iconName: 'Cancel' }, onClick: () => onChange({ ...filters, status: 'All' }), styles: chipButtonStyles }))),
            React.createElement(DefaultButton, { text: "Clear All", onClick: onClear, styles: { root: { height: 26, minWidth: 0, padding: '0 8px', fontSize: '0.8rem' } } })))));
};
const chipStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    backgroundColor: '#edebe9',
    padding: '2px 8px',
    borderRadius: '16px',
    fontSize: '0.8rem',
    color: '#323130',
    border: '1px solid #d2d0ce',
    gap: '4px'
};
const chipButtonStyles = {
    root: { width: 14, height: 14, marginLeft: 2, padding: 0 },
    icon: { fontSize: 8, color: '#605e5c' }
};
//# sourceMappingURL=EventFilters.js.map
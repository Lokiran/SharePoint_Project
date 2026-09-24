import * as React from 'react';
import {
  Dropdown,
  IDropdownOption,
  DatePicker,
  SearchBox,
  DefaultButton,
  IconButton,
  Stack,
  Text
} from '@fluentui/react';
import { IAuditLogFilters } from '../models/IEventLog';
import {
  AUDIT_LOG_DATE_RANGE_OPTIONS,
  AUDIT_LOG_MODULE_OPTIONS,
  AUDIT_LOG_STATUS_OPTIONS,
  AUDIT_LOG_SORT_OPTIONS
} from '../constants/DropdownConstants';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../utils/LocalizationUtils';

export interface IEventFiltersProps {
  filters: IAuditLogFilters;
  onChange: (filters: IAuditLogFilters) => void;
  onClear: () => void;
  actionsList: string[];
  assetTypesList: string[];
  usersList: string[];
}

export const EventFilters: React.FC<IEventFiltersProps> = (props) => {
  const { filters, onChange, onClear, actionsList, assetTypesList, usersList } = props;

  const dateOptions = AUDIT_LOG_DATE_RANGE_OPTIONS;
  const moduleOptions = AUDIT_LOG_MODULE_OPTIONS;
  const statusOptions = AUDIT_LOG_STATUS_OPTIONS;
  const sortOptions = AUDIT_LOG_SORT_OPTIONS;

  const actionOptions: IDropdownOption[] = [
    { key: 'All', text: strings.EventFilters.AllActionsOption },
    ...actionsList.map(action => ({
      key: action,
      text: action.charAt(0).toUpperCase() + action.slice(1)
    }))
  ];

  const assetTypeOptions: IDropdownOption[] = [
    { key: 'All', text: strings.EventFilters.AllAssetsOption },
    ...assetTypesList.map(type => ({
      key: type,
      text: type
    }))
  ];

  const userOptions: IDropdownOption[] = [
    { key: 'All', text: strings.EventFilters.AllUsersOption },
    ...usersList.map(user => ({
      key: user,
      text: user
    }))
  ];

  // Helper to check if any filter is active (excluding default search/sort)
  const hasActiveFilters = 
    filters.dateRangeType !== 'All' ||
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

  const handleDateChange = (type: string) => {
    onChange({
      ...filters,
      dateRangeType: type as any,
      startDate: type === 'Custom' ? filters.startDate || new Date() : undefined,
      endDate: type === 'Custom' ? filters.endDate || new Date() : undefined
    });
  };

  // Date range validation
  const isDateRangeInvalid = 
    filters.dateRangeType === 'Custom' &&
    filters.startDate &&
    filters.endDate &&
    new Date(filters.startDate) > new Date(filters.endDate);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
      {/* Search box row */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <SearchBox
          placeholder={strings.EventFilters.SearchPlaceholder}
          value={filters.searchQuery}
          onChange={(_, newValue) => onChange({ ...filters, searchQuery: newValue || '' })}
          onClear={() => onChange({ ...filters, searchQuery: '' })}
          styles={{ root: { flexGrow: 1, minWidth: '300px' } }}
        />
        <DefaultButton
          text={strings.Common.ClearFilters}
          iconProps={{ iconName: 'ClearFilter' }}
          onClick={onClear}
          disabled={!hasActiveFilters && !filters.searchQuery}
        />
      </div>

      {/* Grid of filters */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '12px'
      }}>
        {/* Date Filter */}
        <Dropdown
          label={strings.EventFilters.LabelDateRange}
          selectedKey={filters.dateRangeType}
          options={dateOptions}
          onChange={(_, option) => option && handleDateChange(option.key as string)}
        />

        {/* Action Filter */}
        <Dropdown
          label={strings.EventFilters.LabelAction}
          selectedKey={filters.action}
          options={actionOptions}
          onChange={(_, option) => option && onChange({ ...filters, action: option.key as string })}
        />

        {/* Module Filter */}
        <Dropdown
          label={strings.EventFilters.LabelModule}
          selectedKey={filters.module}
          options={moduleOptions}
          onChange={(_, option) => option && onChange({ ...filters, module: option.key as string })}
        />

        {/* Asset Type Filter */}
        <Dropdown
          label={strings.EventFilters.LabelAssetType}
          selectedKey={filters.assetType}
          options={assetTypeOptions}
          onChange={(_, option) => option && onChange({ ...filters, assetType: option.key as string })}
        />

        {/* User Filter */}
        <Dropdown
          label={strings.EventFilters.LabelUser}
          selectedKey={filters.user}
          options={userOptions}
          onChange={(_, option) => option && onChange({ ...filters, user: option.key as string })}
        />

        {/* Status Filter */}
        <Dropdown
          label={strings.EventFilters.LabelStatus}
          selectedKey={filters.status}
          options={statusOptions}
          onChange={(_, option) => option && onChange({ ...filters, status: option.key as string })}
        />

        {/* Sort Filter */}
        <Dropdown
          label={strings.EventFilters.LabelSortOrder}
          selectedKey={filters.sortOrder}
          options={sortOptions}
          onChange={(_, option) => option && onChange({ ...filters, sortOrder: option.key as any })}
        />
      </div>

      {/* Custom Date Range picker fields */}
      {filters.dateRangeType === 'Custom' && (
        <Stack horizontal wrap tokens={{ childrenGap: 16 }} style={{ alignItems: 'flex-end', backgroundColor: '#f3f2f1', padding: '12px', borderRadius: '4px' }}>
          <div>
            <DatePicker
              label={strings.EventFilters.LabelStartDate}
              value={filters.startDate}
              onSelectDate={(date) => date && onChange({ ...filters, startDate: date })}
              placeholder={strings.EventFilters.StartDatePlaceholder}
            />
          </div>
          <div>
            <DatePicker
              label={strings.EventFilters.LabelEndDate}
              value={filters.endDate}
              onSelectDate={(date) => date && onChange({ ...filters, endDate: date })}
              placeholder={strings.EventFilters.EndDatePlaceholder}
            />
          </div>
          {isDateRangeInvalid && (
            <Text style={{ color: '#a80000', alignSelf: 'center', fontWeight: 'bold' }}>
              {strings.EventFilters.DateRangeWarning}
            </Text>
          )}
        </Stack>
      )}

      {/* Active Filter Chips */}
      {hasActiveFilters && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', marginTop: '4px' }}>
          <Text variant="smallPlus" style={{ color: 'var(--text-muted)', marginRight: '4px', fontWeight: 'bold' }}>
            {strings.EventFilters.ActiveFilters}
          </Text>

          {/* Date Chip */}
          {filters.dateRangeType !== 'All' && (
            <span style={chipStyle}>
              {getDateLabel()}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => handleDateChange('All')}
                styles={chipButtonStyles}
              />
            </span>
          )}

          {/* Action Chip */}
          {filters.action !== 'All' && (
            <span style={chipStyle}>
              {formatString(strings.EventFilters.ChipAction, filters.action)}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onChange({ ...filters, action: 'All' })}
                styles={chipButtonStyles}
              />
            </span>
          )}

          {/* Module Chip */}
          {filters.module !== 'All' && (
            <span style={chipStyle}>
              {formatString(strings.EventFilters.ChipModule, filters.module)}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onChange({ ...filters, module: 'All' })}
                styles={chipButtonStyles}
              />
            </span>
          )}

          {/* Asset Type Chip */}
          {filters.assetType !== 'All' && (
            <span style={chipStyle}>
              {formatString(strings.EventFilters.ChipAsset, filters.assetType)}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onChange({ ...filters, assetType: 'All' })}
                styles={chipButtonStyles}
              />
            </span>
          )}

          {/* User Chip */}
          {filters.user !== 'All' && (
            <span style={chipStyle}>
              {formatString(strings.EventFilters.ChipUser, filters.user)}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onChange({ ...filters, user: 'All' })}
                styles={chipButtonStyles}
              />
            </span>
          )}

          {/* Status Chip */}
          {filters.status !== 'All' && (
            <span style={chipStyle}>
              {formatString(strings.EventFilters.ChipStatus, filters.status)}
              <IconButton
                iconProps={{ iconName: 'Cancel' }}
                onClick={() => onChange({ ...filters, status: 'All' })}
                styles={chipButtonStyles}
              />
            </span>
          )}

          <DefaultButton
            text={strings.EventFilters.ClearAll}
            onClick={onClear}
            styles={{ root: { height: 26, minWidth: 0, padding: '0 8px', fontSize: '0.8rem' } }}
          />
        </div>
      )}
    </div>
  );
};

const chipStyle: React.CSSProperties = {
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

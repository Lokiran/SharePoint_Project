import * as React from 'react';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import { ActionButton } from '@fluentui/react/lib/Button';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { statusBucket, statusBucketLabel } from '../inventory/inventoryUi';
import { CONDITION_NONE, STATUS_ORDER, nameOf, needsAttention, isHeld } from './reportData';
import { reportCss as css, ReportTable } from './reportsUi';
import { ExportButtons, assetColumn } from './reportParts';

export interface IAssetFilters {
  search: string;
  /** 'all', 'attention' (poor or damaged), CONDITION_NONE, or an exact condition. */
  condition: string;
  assignment: 'all' | 'assigned' | 'unassigned';
}

export const NO_ASSET_FILTERS: IAssetFilters = { search: '', condition: 'all', assignment: 'all' };

export interface IAssetsReportProps {
  items: IInventoryItem[];
  /** 'All' or an exact asset type. */
  typeFilter: string;
  /** 'All' or a status bucket key (inStock, assigned, …). */
  statusFilter: string;
  onTypeChange: (type: string) => void;
  onStatusChange: (status: string) => void;
  filters: IAssetFilters;
  onFiltersChange: (filters: IAssetFilters) => void;
  onExportExcel: (rows: IInventoryItem[]) => void;
  onExportPdf: (rows: IInventoryItem[]) => void;
  onOpenAsset: (item: IInventoryItem) => void;
}

/** Filterable, sortable list of every asset; exports follow the filters. */
export const AssetsReport: React.FC<IAssetsReportProps> = (props) => {
  const { items, typeFilter, statusFilter, filters } = props;
  const t = strings.Reports;
  const r = strings.ReportsPage;

  const query = filters.search.trim().toLowerCase();
  const rows = items.filter(i => {
    if (typeFilter !== 'All' && (i.assetType || '').trim() !== typeFilter) return false;
    if (statusFilter !== 'All' && statusBucket(i.status) !== statusFilter) return false;
    const condition = (i.condition || '').trim();
    if (filters.condition === 'attention' ? !needsAttention(i)
      : filters.condition === CONDITION_NONE ? !!condition
        : filters.condition !== 'all' && condition !== filters.condition) return false;
    if (filters.assignment !== 'all' && isHeld(i) !== (filters.assignment === 'assigned')) return false;
    if (!query) return true;
    return [nameOf(i), i.serialNumber, i.assetType, i.assignedTo, i.assignedToEmail, i.vendor, i.status]
      .some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  }).sort((a, b) => nameOf(a).localeCompare(nameOf(b)));

  const distinct = (values: (string | undefined)[]): string[] =>
    Array.from(new Set(values.map(v => (v || '').trim()).filter(Boolean))).sort();
  const option = (key: string, text: string): IDropdownOption => ({ key, text });

  const typeOptions = [option('All', r.FilterAllTypes)].concat(distinct(items.map(i => i.assetType)).map(v => option(v, v)));
  const statusOptions = [option('All', r.FilterAllStatuses)]
    .concat(STATUS_ORDER.filter(b => items.some(i => statusBucket(i.status) === b)).map(b => option(b, statusBucketLabel(b))));
  const conditionOptions = [option('all', strings.RecordLists.AllConditions), option('attention', t.KpiCondition)]
    .concat(distinct(items.map(i => i.condition)).map(v => option(v, v)))
    .concat(items.some(i => !(i.condition || '').trim()) ? [option(CONDITION_NONE, strings.RecordLists.Unspecified)] : []);
  const assignmentOptions = [option('all', t.AssignmentAll), option('assigned', statusBucketLabel('assigned')), option('unassigned', r.ColUnassigned)];

  const hasFilters = typeFilter !== 'All' || statusFilter !== 'All' || filters.condition !== 'all' || filters.assignment !== 'all' || !!query;
  const clear = (): void => {
    props.onTypeChange('All');
    props.onStatusChange('All');
    props.onFiltersChange(NO_ASSET_FILTERS);
  };

  return (
    <div>
      <div className={css.toolbar}>
        <SearchBox
          className={css.search}
          placeholder={t.SearchAssets}
          value={filters.search}
          onChange={(_, v) => props.onFiltersChange({ ...filters, search: v || '' })}
          onClear={() => props.onFiltersChange({ ...filters, search: '' })}
        />
        <Dropdown label={r.LabelAssetType} options={typeOptions} selectedKey={typeFilter} onChange={(_, o) => o && props.onTypeChange(String(o.key))} styles={{ root: { width: 150 } }} />
        <Dropdown label={r.LabelAssetStatus} options={statusOptions} selectedKey={statusFilter} onChange={(_, o) => o && props.onStatusChange(String(o.key))} styles={{ root: { width: 160 } }} />
        <Dropdown label={strings.Columns.Condition} options={conditionOptions} selectedKey={filters.condition} onChange={(_, o) => o && props.onFiltersChange({ ...filters, condition: String(o.key) })} styles={{ root: { width: 160 } }} />
        <Dropdown label={t.LabelAssignment} options={assignmentOptions} selectedKey={filters.assignment} onChange={(_, o) => o && props.onFiltersChange({ ...filters, assignment: o.key as IAssetFilters['assignment'] })} styles={{ root: { width: 190 } }} />
      </div>

      <div className={css.resultLine}>
        <span className={css.actions}>
          {formatString(t.ResultAssets, rows.length, items.length)}
          {hasFilters && <ActionButton iconProps={{ iconName: 'ClearFilter' }} text={strings.RecordLists.ClearFilters} onClick={clear} />}
        </span>
        <ExportButtons onExcel={() => props.onExportExcel(rows)} onPdf={() => props.onExportPdf(rows)} disabled={rows.length === 0} />
      </div>

      <ReportTable
        rows={rows}
        columns={[assetColumn.asset(), assetColumn.type(), assetColumn.status(), assetColumn.condition(), assetColumn.assignedTo(), assetColumn.purchased(), assetColumn.age(), assetColumn.warranty()]}
        keyOf={i => i.id}
        onOpen={props.onOpenAsset}
        resetKey={[typeFilter, statusFilter, filters.condition, filters.assignment, query].join('|')}
        emptyText={items.length === 0 ? t.NoData : strings.RecordLists.EmptyFiltered}
        ariaLabel={r.DetailedTitle}
      />
    </div>
  );
};

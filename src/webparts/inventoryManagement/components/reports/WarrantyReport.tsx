import * as React from 'react';
import { Bar } from 'react-chartjs-2';
import { SearchBox } from '@fluentui/react/lib/SearchBox';
import { Dropdown, IDropdownOption } from '@fluentui/react/lib/Dropdown';
import * as strings from 'InventoryManagementWebPartStrings';
import { formatString } from '../../utils/LocalizationUtils';
import { IInventoryItem } from '../../models/IInventoryItem';
import { barValueLabelsPlugin } from '../../utils/ChartPlugins';
import { LIFECYCLE_YEARS } from '../inventory/inventoryUi';
import { StatusChips, IStatusChip, parseFlexibleDate, timeOf } from '../common/listUi';
import { WARRANTY_BUCKETS, WarrantyBucket, nameOf, warrantyBucket, warrantyDays, isPastLifecycle, monthKey, monthSeries } from './reportData';
import { WARRANTY_COLOR, warrantyBucketLabel } from './reportLabels';
import { reportCss as css, PALETTE, BAR_STYLE, ReportCard, ReportTable, barOptions } from './reportsUi';
import { ExportButtons, assetColumn } from './reportParts';

/** 'attention' = expired or ending within 90 days; 'lifecycle' = older than the planned lifecycle. */
export type WarrantyChip = 'all' | 'attention' | 'lifecycle' | WarrantyBucket;

export interface IWarrantyReportProps {
  items: IInventoryItem[];
  chip: WarrantyChip;
  onChipChange: (chip: WarrantyChip) => void;
  onExportExcel: (rows: IInventoryItem[]) => void;
  onExportPdf: (rows: IInventoryItem[]) => void;
  onOpenAsset: (item: IInventoryItem) => void;
}

const needsAttention = (bucket: WarrantyBucket): boolean => bucket === 'expired' || bucket === 'within30' || bucket === 'within90';

/** Warranty end dates and replacement planning: what has lapsed, what is about to, and what is due for refresh. */
export const WarrantyReport: React.FC<IWarrantyReportProps> = (props) => {
  const { items, chip } = props;
  const t = strings.Reports;
  const r = strings.ReportsPage;
  const [search, setSearch] = React.useState('');
  const [type, setType] = React.useState('All');

  const query = search.trim().toLowerCase();
  // The chips count within the search and type filter, so the numbers match the list.
  const scoped = items.filter(i => {
    if (type !== 'All' && (i.assetType || '').trim() !== type) return false;
    if (!query) return true;
    return [nameOf(i), i.serialNumber, i.assetType, i.assignedTo, i.vendor].some(v => (v || '').toLowerCase().indexOf(query) >= 0);
  });

  const matches = (i: IInventoryItem, which: WarrantyChip): boolean =>
    which === 'all' ? true
      : which === 'lifecycle' ? isPastLifecycle(i)
        : which === 'attention' ? needsAttention(warrantyBucket(i))
          : warrantyBucket(i) === which;
  const count = (which: WarrantyChip): number => scoped.filter(i => matches(i, which)).length;

  const chips: IStatusChip[] = [
    { key: 'all', label: strings.RecordLists.TileAll, count: scoped.length },
    { key: 'attention', label: t.WarrantyAttention, count: count('attention'), color: PALETTE.orange },
    ...WARRANTY_BUCKETS.map(b => ({ key: b as string, label: warrantyBucketLabel(b), count: count(b), color: WARRANTY_COLOR[b] })),
    { key: 'lifecycle', label: formatString(t.KpiLifecycleHint, LIFECYCLE_YEARS), count: count('lifecycle'), color: PALETTE.purple }
  ];

  // Soonest warranty end first (no date last); the lifecycle view lists the oldest purchase first.
  const rows = scoped.filter(i => matches(i, chip)).sort((a, b) => {
    if (chip === 'lifecycle') return timeOf(a.purchaseDate) - timeOf(b.purchaseDate);
    const da = warrantyDays(a), db = warrantyDays(b);
    return (da === undefined ? Number.MAX_SAFE_INTEGER : da) - (db === undefined ? Number.MAX_SAFE_INTEGER : db);
  });

  // Warranties ending in each of the next 12 months.
  const months = monthSeries(0, 12);
  const endingIn = months.map(m => scoped.filter(i => { const d = parseFlexibleDate(i.warrantyExpiry); return !!d && monthKey(d) === m.key; }).length);
  const monthlyData = {
    labels: months.map(m => m.label),
    datasets: [{ label: t.ChartWarrantyMonthly, data: endingIn, backgroundColor: PALETTE.blue, ...BAR_STYLE }]
  };

  const typeOptions: IDropdownOption[] = [{ key: 'All', text: r.FilterAllTypes }]
    .concat(Array.from(new Set(items.map(i => (i.assetType || '').trim()).filter(Boolean))).sort().map(v => ({ key: v, text: v })));

  return (
    <div>
      <StatusChips chips={chips} selected={chip} ariaLabel={r.WarrantyTitle} onSelect={(key) => props.onChipChange(chip === key ? 'all' : key as WarrantyChip)} />

      <div className={css.toolbar}>
        <SearchBox className={css.search} placeholder={t.SearchAssets} value={search} onChange={(_, v) => setSearch(v || '')} onClear={() => setSearch('')} />
        <Dropdown label={r.LabelAssetType} options={typeOptions} selectedKey={type} onChange={(_, o) => o && setType(String(o.key))} styles={{ root: { width: 170 } }} />
      </div>

      <div className={css.resultLine}>
        <span>{formatString(t.ResultAssets, rows.length, items.length)}</span>
        <ExportButtons onExcel={() => props.onExportExcel(rows)} onPdf={() => props.onExportPdf(rows)} disabled={rows.length === 0} />
      </div>

      <ReportTable
        rows={rows}
        columns={[assetColumn.asset(), assetColumn.type(), assetColumn.status(), assetColumn.assignedTo(), assetColumn.purchased(), assetColumn.age(), assetColumn.replaceBy(), assetColumn.warranty()]}
        keyOf={i => i.id}
        onOpen={props.onOpenAsset}
        resetKey={[chip, type, query].join('|')}
        emptyText={items.length === 0 ? t.NoData : strings.RecordLists.EmptyFiltered}
        ariaLabel={r.WarrantyTitle}
      />

      <div className={css.section}>
        <ReportCard title={t.ChartWarrantyMonthly} subtitle={t.ChartWarrantyMonthlySub}>
          <div className={css.chartBox} style={{ height: 220 }}>
            <Bar data={monthlyData} options={barOptions({ valueLabels: true }) as any} plugins={[barValueLabelsPlugin]} />
          </div>
        </ReportCard>
      </div>
    </div>
  );
};

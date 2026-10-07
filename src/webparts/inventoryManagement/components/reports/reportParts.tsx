// Pieces several report tabs share: export buttons and the asset table columns.
import * as React from 'react';
import { DefaultButton } from '@fluentui/react/lib/Button';
import * as strings from 'InventoryManagementWebPartStrings';
import { IInventoryItem } from '../../models/IInventoryItem';
import { statusBucket, statusBucketLabel, statusTone, conditionTone, formatDay, ageText, warrantyInfo } from '../inventory/inventoryUi';
import { Pill, timeOf } from '../common/listUi';
import { STATUS_ORDER, nameOf, replaceBy, warrantyDays } from './reportData';
import { reportCss as css, IReportColumn } from './reportsUi';

export const ExportButtons: React.FC<{ onExcel?: () => void; onPdf?: () => void; disabled?: boolean }> = ({ onExcel, onPdf, disabled }) => (
  <span className={css.actions}>
    {onExcel && <DefaultButton text={strings.ReportsPage.ExportExcel} iconProps={{ iconName: 'ExcelDocument', styles: { root: { color: '#107c41' } } }} onClick={onExcel} disabled={disabled} />}
    {onPdf && <DefaultButton text={strings.ReportsPage.ExportPDF} iconProps={{ iconName: 'PDF', styles: { root: { color: '#d13438' } } }} onClick={onPdf} disabled={disabled} />}
  </span>
);

const dash = <span className={css.muted}>—</span>;

/** Column builders for tables of inventory items; each tab picks the ones it needs. */
export const assetColumn = {
  asset: (): IReportColumn<IInventoryItem> => ({
    key: 'asset', name: strings.Columns.AssetName, minWidth: 170, maxWidth: 260,
    sortValue: i => nameOf(i).toLowerCase(),
    render: i => (
      <span className={css.two}>
        <span className={css.strong}>{nameOf(i) || strings.InventoryExplorer.Unnamed}</span>
        <span className={css.meta}>{i.serialNumber || strings.Common.NotAvailable}</span>
      </span>
    )
  }),
  type: (): IReportColumn<IInventoryItem> => ({
    key: 'type', name: strings.ReportsPage.LabelAssetType, minWidth: 90, maxWidth: 130,
    sortValue: i => (i.assetType || '').toLowerCase(),
    render: i => <span className={css.cellText}>{i.assetType || '—'}</span>
  }),
  status: (): IReportColumn<IInventoryItem> => ({
    key: 'status', name: strings.Columns.Status, minWidth: 110, maxWidth: 140,
    sortValue: i => STATUS_ORDER.indexOf(statusBucket(i.status)),
    render: i => <Pill tone={statusTone(i.status)} text={i.status || statusBucketLabel('other')} />
  }),
  condition: (): IReportColumn<IInventoryItem> => ({
    key: 'condition', name: strings.Columns.Condition, minWidth: 80, maxWidth: 110,
    sortValue: i => (i.condition || '').toLowerCase(),
    render: i => i.condition ? <Pill tone={conditionTone(i.condition)} text={i.condition} /> : dash
  }),
  assignedTo: (): IReportColumn<IInventoryItem> => ({
    key: 'assignedTo', name: strings.Columns.AssignedTo, minWidth: 120, maxWidth: 180,
    sortValue: i => (i.assignedTo || '').toLowerCase(),
    render: i => i.assignedTo
      ? <span className={css.cellText} title={i.assignedToEmail}>{i.assignedTo}</span>
      : <span className={css.muted}>{strings.ReportsPage.ColUnassigned}</span>
  }),
  purchased: (): IReportColumn<IInventoryItem> => ({
    key: 'purchased', name: strings.Columns.PurchaseDate, minWidth: 100, maxWidth: 120,
    sortValue: i => timeOf(i.purchaseDate),
    render: i => <span className={css.cellText}>{formatDay(i.purchaseDate)}</span>
  }),
  age: (): IReportColumn<IInventoryItem> => ({
    key: 'age', name: strings.Reports.ColAge, minWidth: 80, maxWidth: 110,
    // Older assets have the earlier purchase date, so they sort as "larger".
    sortValue: i => -timeOf(i.purchaseDate),
    render: i => <span className={css.cellText}>{ageText(i.purchaseDate) || '—'}</span>
  }),
  replaceBy: (): IReportColumn<IInventoryItem> => ({
    key: 'replaceBy', name: strings.Reports.ColReplaceBy, minWidth: 100, maxWidth: 120,
    sortValue: i => { const d = replaceBy(i); return d ? d.getTime() : Number.MAX_SAFE_INTEGER; },
    render: i => { const d = replaceBy(i); return d ? <span className={css.cellText}>{formatDay(d.toISOString())}</span> : dash; }
  }),
  warranty: (): IReportColumn<IInventoryItem> => ({
    key: 'warranty', name: strings.Columns.WarrantyExpiry, minWidth: 150, maxWidth: 200,
    sortValue: i => { const days = warrantyDays(i); return days === undefined ? Number.MAX_SAFE_INTEGER : days; },
    render: i => { const w = warrantyInfo(i.warrantyExpiry); return <Pill tone={w.tone} text={w.text} />; }
  })
};
